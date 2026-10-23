"use client";

import React, { useState, useTransition } from "react";
import {
  FiUploadCloud,
  FiSearch,
  FiCopy,
  FiCheck,
  FiTrash2,
  FiEdit3,
  FiAlertTriangle,
  FiImage,
  FiCheckCircle,
  FiMaximize2,
  FiLock,
  FiX,
} from "react-icons/fi";
import {
  getUploadSignatureAction,
  registerMediaAssetAction,
  updateMediaAssetAltTextAction,
  deleteMediaAssetAction,
} from "./actions";
import type { CloudinaryConfigStatus } from "@/lib/cloudinary";
import { Modal } from "@/components/admin/modal";

export interface MediaAssetItem {
  id: string;
  publicId: string;
  secureUrl: string;
  format: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
  altText: string | null;
  folder: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface MediaClientProps {
  initialAssets: MediaAssetItem[];
  configStatus: CloudinaryConfigStatus;
}

export function MediaClient({ initialAssets, configStatus }: MediaClientProps) {
  const [assets, setAssets] = useState<MediaAssetItem[]>(initialAssets);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadProgressText, setUploadProgressText] = useState<string>("");

  // Edit Alt Text Modal state
  const [editingAsset, setEditingAsset] = useState<MediaAssetItem | null>(null);
  const [altTextInput, setAltTextInput] = useState("");
  const [isPendingAlt, startAltTransition] = useTransition();

  // Delete Confirmation Modal state
  const [deletingAsset, setDeletingAsset] = useState<MediaAssetItem | null>(null);
  const [isPendingDelete, startDeleteTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  // Asset Detail Modal
  const [viewingAsset, setViewingAsset] = useState<MediaAssetItem | null>(null);

  // Copy URL to clipboard
  const handleCopyUrl = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // Fallback
      setCopiedId(null);
    }
  };

  // Upload Handler
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);
    setActionError(null);

    // 1. Client-side sanity checks
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setUploadError("Invalid file type. Only JPEG, PNG, and WebP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File exceeds the maximum allowed size of 5 MB.");
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    setUploadProgressText("Requesting signed upload authorization...");

    try {
      // 2. Request cryptographically signed parameters from server
      const ticketRes = await getUploadSignatureAction();
      if (!ticketRes.success || !ticketRes.data) {
        throw new Error(ticketRes.error || "Failed to obtain upload authorization.");
      }

      const { signature, timestamp, folder, apiKey, cloudName } = ticketRes.data;

      // 3. Perform direct browser-to-Cloudinary upload
      setUploadProgressText("Transmitting asset directly to Cloudinary...");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      const cloudUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const cloudRes = await fetch(cloudUrl, {
        method: "POST",
        body: formData,
      });

      if (!cloudRes.ok) {
        const errJson = await cloudRes.json().catch(() => ({}));
        throw new Error(
          errJson.error?.message ||
            `Cloudinary upload failed with status ${cloudRes.status}`
        );
      }

      const cloudData = await cloudRes.json();

      // 4. Send returned payload to server for cryptographic signature verification and DB registration
      setUploadProgressText(
        "Verifying cryptographic signature and registering in PostgreSQL..."
      );
      const registerRes = await registerMediaAssetAction({
        public_id: cloudData.public_id,
        version: cloudData.version,
        signature: cloudData.signature,
        format: cloudData.format,
        bytes: cloudData.bytes,
        width: cloudData.width,
        height: cloudData.height,
        secure_url: cloudData.secure_url,
        alt_text: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      });

      if (!registerRes.success || !registerRes.data) {
        throw new Error(
          registerRes.error || "Server failed to verify and register asset."
        );
      }

      const newAsset: MediaAssetItem = {
        ...registerRes.data,
        createdAt: new Date(registerRes.data.createdAt),
        updatedAt: new Date(registerRes.data.updatedAt),
      };

      setAssets((prev) => [newAsset, ...prev]);
      setUploadSuccess(`Asset '${file.name}' successfully uploaded and registered.`);
    } catch (err) {
      console.error("[UPLOAD_ERROR]", err);
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      setUploadProgressText("");
      e.target.value = "";
    }
  };

  // Alt Text Save Handler
  const handleSaveAltText = () => {
    if (!editingAsset) return;
    setActionError(null);

    startAltTransition(async () => {
      const res = await updateMediaAssetAltTextAction(editingAsset.id, altTextInput);
      if (res.success) {
        setAssets((prev) =>
          prev.map((a) =>
            a.id === editingAsset.id ? { ...a, altText: altTextInput.trim() || null } : a
          )
        );
        setEditingAsset(null);
      } else {
        setActionError(res.error || "Failed to update alt text.");
      }
    });
  };

  // Delete Handler
  const handleDeleteConfirm = () => {
    if (!deletingAsset) return;
    setActionError(null);

    startDeleteTransition(async () => {
      const res = await deleteMediaAssetAction(deletingAsset.id);
      if (res.success) {
        setAssets((prev) => prev.filter((a) => a.id !== deletingAsset.id));
        setDeletingAsset(null);
      } else {
        setActionError(res.error || "Failed to delete asset.");
      }
    });
  };

  // Filtering & Search
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.publicId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.altText && asset.altText.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFormat =
      selectedFormat === "all" ||
      (asset.format && asset.format.toLowerCase() === selectedFormat.toLowerCase());

    return matchesSearch && matchesFormat;
  });

  return (
    <div className="space-y-8">
      {/* Cloudinary Status Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-ink-100 dark:border-ink-800/80">
        <span className="text-xs font-mono text-ink-600 dark:text-ink-400">
          Total Assets: {assets.length} items
        </span>
        <div className="flex items-center gap-2">
          {configStatus.isConfigured ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono shadow-xs font-semibold">
              <FiCheckCircle className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Cloudinary Connected ({configStatus.cloudName})</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-mono shadow-xs font-semibold">
              <FiLock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Standby (Read-Only Mode)</span>
            </div>
          )}
        </div>
      </div>

      {/* Global Alerts */}
      {!configStatus.isConfigured && (
        <div
          role="alert"
          className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-200 p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-3 shadow-xs leading-relaxed"
        >
          <FiAlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block font-mono uppercase text-xs tracking-wider mb-1">
              Configuration Notice · Credentials Required for Live Uploads
            </span>
            <span>
              Cloudinary API credentials are not yet configured in{" "}
              <code className="bg-ink-100 dark:bg-ink-950 px-1.5 py-0.5 rounded border border-ink-200 dark:border-ink-800 font-mono">
                .env
              </code>
              . To enable signed uploads, configure{" "}
              <code className="bg-ink-100 dark:bg-ink-950 px-1.5 py-0.5 rounded border border-ink-200 dark:border-ink-800 font-mono">
                NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
              </code>
              ,{" "}
              <code className="bg-ink-100 dark:bg-ink-950 px-1.5 py-0.5 rounded border border-ink-200 dark:border-ink-800 font-mono">
                CLOUDINARY_API_KEY
              </code>
              , and{" "}
              <code className="bg-ink-100 dark:bg-ink-950 px-1.5 py-0.5 rounded border border-ink-200 dark:border-ink-800 font-mono">
                CLOUDINARY_API_SECRET
              </code>
              . Existing database assets remain securely viewable.
            </span>
          </div>
        </div>
      )}

      {actionError && (
        <div
          role="alert"
          className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-800 dark:text-red-300 p-4 rounded-2xl text-xs flex items-start gap-3 shadow-xs animate-fade-up"
        >
          <FiAlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-body">{actionError}</span>
        </div>
      )}

      {uploadError && (
        <div
          role="alert"
          className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-800 dark:text-red-300 p-4 rounded-2xl text-xs flex items-start gap-3 shadow-xs animate-fade-up"
        >
          <FiAlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-body">{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div
          role="alert"
          className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 p-4 rounded-2xl text-xs flex items-start gap-3 shadow-xs animate-fade-up"
        >
          <FiCheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-body">{uploadSuccess}</span>
        </div>
      )}

      {/* Upload Zone */}
      <section className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-sm dark:shadow-clay-card-dark rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiUploadCloud className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <h2 className="font-display text-lg font-bold text-ink-900 dark:text-ink-50">
              Direct Signed Media Upload
            </h2>
          </div>
          <span className="text-xs font-mono text-ink-600 dark:text-ink-400">
            JPG, PNG, WEBP (Max 5 MB)
          </span>
        </div>

        <div className="relative border-2 border-dashed border-ink-200 dark:border-ink-800 hover:border-emerald-500/50 rounded-xl p-8 sm:p-12 text-center transition-all bg-ink-50/50 dark:bg-ink-950/60 group">
          <input
            id="media-file-input"
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            disabled={!configStatus.isConfigured || isUploading}
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            aria-label="Upload media file"
          />

          <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-sm dark:shadow-clay-card-dark flex items-center justify-center text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <FiUploadCloud className="w-7 h-7" />
            </div>

            {isUploading ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                  <svg
                    className="animate-spin h-4 w-4 text-emerald-700 dark:text-emerald-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Processing Upload</span>
                </div>
                <p className="text-xs text-ink-600 dark:text-ink-400 font-mono">
                  {uploadProgressText}
                </p>
              </div>
            ) : configStatus.isConfigured ? (
              <div>
                <p className="text-sm font-medium text-ink-800 dark:text-ink-200">
                  <span className="text-emerald-700 dark:text-emerald-400 underline font-semibold">
                    Click to select an image
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-ink-600 dark:text-ink-400 mt-1 font-mono">
                  Authenticated direct browser upload with server signature verification.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-ink-700 dark:text-ink-300">
                  Uploads disabled until Cloudinary credentials are configured.
                </p>
                <p className="text-xs text-ink-600 dark:text-ink-400 mt-1 font-mono">
                  Existing assets remain viewable.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-500 dark:text-ink-400">
            <FiSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets by ID or alt text..."
            className="w-full bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-ink-900 dark:text-ink-100 placeholder:text-ink-500 dark:placeholder:text-ink-400 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-body shadow-xs transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-500 hover:text-ink-800 dark:hover:text-ink-200"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Format Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-ink-100 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl shadow-xs overflow-x-auto">
          {["all", "webp", "jpg", "jpeg", "png"].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                selectedFormat === fmt
                  ? "bg-emerald-600 text-white shadow-xs font-semibold"
                  : "text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200"
              }`}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white dark:bg-ink-900/60 border border-ink-200 dark:border-ink-800 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-ink-100 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 flex items-center justify-center text-ink-400 dark:text-ink-500 mx-auto mb-4">
            <FiImage className="w-7 h-7" />
          </div>
          <h3 className="font-display text-lg font-bold text-ink-800 dark:text-ink-200 mb-1">
            {assets.length === 0 ? "No Media Assets Registered" : "No Assets Match Query"}
          </h3>
          <p className="text-xs text-ink-600 dark:text-ink-400 max-w-md mx-auto leading-relaxed">
            {assets.length === 0
              ? "The media asset register is currently empty. Uploaded assets will appear here with full metadata and copyable URLs."
              : "Try adjusting your search terms or format filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => {
            const sizeInKb = asset.bytes ? (asset.bytes / 1024).toFixed(1) : "—";

            return (
              <div
                key={asset.id}
                className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl shadow-sm dark:shadow-clay-card-dark overflow-hidden flex flex-col group transition-all hover:border-emerald-500/40"
              >
                {/* Thumbnail Display with Aspect Ratio Well */}
                <div className="relative aspect-video bg-ink-100 dark:bg-ink-950 border-b border-ink-200 dark:border-ink-800/80 overflow-hidden flex items-center justify-center">
                  <img
                    src={asset.secureUrl}
                    alt={asset.altText || asset.publicId}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Format & Dimensions Overlay Pill */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-white/90 dark:bg-ink-950/80 backdrop-blur-md text-emerald-700 dark:text-emerald-400 border border-ink-200 dark:border-ink-800 shadow-xs">
                      {asset.format || "IMG"}
                    </span>
                    {asset.width && asset.height && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-ink-700 dark:text-ink-300 bg-white/90 dark:bg-ink-950/80 backdrop-blur-md border border-ink-200 dark:border-ink-800 shadow-xs">
                        {asset.width}×{asset.height}
                      </span>
                    )}
                  </div>

                  {/* Quick Expand Button */}
                  <button
                    onClick={() => setViewingAsset(asset)}
                    className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-white/90 dark:bg-ink-950/80 backdrop-blur-md text-ink-700 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white border border-ink-200 dark:border-ink-800 hover:border-emerald-500/50 shadow-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    aria-label="View full details"
                  >
                    <FiMaximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Asset Metadata & Controls */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-mono text-ink-900 dark:text-ink-100 font-semibold truncate mb-1">
                      {asset.publicId}
                    </div>
                    <div className="text-[11px] text-ink-600 dark:text-ink-400 flex items-center justify-between font-mono">
                      <span>Size: {sizeInKb} KB</span>
                      <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Alt Text summary */}
                    <div className="mt-2 text-xs text-ink-700 dark:text-ink-300 bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800/80 rounded-lg p-2">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-mono uppercase text-ink-600 dark:text-ink-400 font-semibold">
                          Alt Text
                        </span>
                        <button
                          onClick={() => {
                            setEditingAsset(asset);
                            setAltTextInput(asset.altText || "");
                          }}
                          className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                        >
                          <FiEdit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                      <p className="text-ink-800 dark:text-ink-200 line-clamp-1 italic text-[11px]">
                        {asset.altText || "No alt text assigned."}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-ink-100 dark:border-ink-800/80">
                    <button
                      onClick={() => handleCopyUrl(asset.id, asset.secureUrl)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium bg-ink-100 hover:bg-ink-200 dark:bg-ink-950 dark:hover:bg-ink-800 text-ink-800 dark:text-ink-200 border border-ink-200 dark:border-ink-800 transition-all cursor-pointer"
                    >
                      {copiedId === asset.id ? (
                        <>
                          <FiCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                            Copied!
                          </span>
                        </>
                      ) : (
                        <>
                          <FiCopy className="w-3.5 h-3.5 text-ink-600 dark:text-ink-400" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setDeletingAsset(asset)}
                      className="p-2 rounded-xl text-ink-500 dark:text-ink-400 hover:text-red-600 dark:hover:text-red-400 bg-ink-100 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 hover:border-red-300 dark:hover:border-red-500/30 transition-all cursor-pointer"
                      aria-label="Delete asset"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Alt Text Modal */}
      <Modal
        isOpen={!!editingAsset}
        onClose={() => setEditingAsset(null)}
        title="Edit Alternative Text"
        description="Descriptive alternative text ensures accessibility compliance (WCAG 2.1 AA) and improves search engine indexing."
        maxWidth="max-w-md"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditingAsset(null)}
              className="px-4 py-2 rounded-xl text-xs font-mono text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white bg-ink-100 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isPendingAlt}
              onClick={handleSaveAltText}
              className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 shadow-sm transition-all disabled:opacity-50"
            >
              {isPendingAlt ? "Saving..." : "Save Alt Text"}
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <textarea
            value={altTextInput}
            onChange={(e) => setAltTextInput(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Describe this image accurately..."
            className="w-full bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 text-ink-900 dark:text-ink-100 placeholder:text-ink-500 dark:placeholder:text-ink-400 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-body transition-colors"
          />
          <div className="text-right text-[11px] font-mono text-ink-600 dark:text-ink-400">
            {altTextInput.length}/500 characters
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingAsset}
        onClose={() => setDeletingAsset(null)}
        title="Confirm Asset Deletion"
        description="This will permanently delete the media asset from Cloudinary and erase its database record."
        maxWidth="max-w-md"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeletingAsset(null)}
              className="px-4 py-2 rounded-xl text-xs font-mono text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white bg-ink-100 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isPendingDelete}
              onClick={handleDeleteConfirm}
              className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-all disabled:opacity-50"
            >
              {isPendingDelete ? "Deleting..." : "Permanently Delete"}
            </button>
          </div>
        }
      >
        {deletingAsset && (
          <div className="space-y-3">
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center gap-3">
              <FiTrash2 className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
              <div className="text-xs text-red-800 dark:text-red-300">
                <span className="font-semibold block">Irreversible Operation</span>
                Asset <code className="font-mono">{deletingAsset.publicId}</code> will be
                removed.
              </div>
            </div>
            <p className="text-xs text-ink-700 dark:text-ink-300 leading-relaxed font-body">
              Are you sure you want to proceed? Any case study or competency referencing
              this asset URL will need to be updated.
            </p>
          </div>
        )}
      </Modal>

      {/* Asset Full Preview Modal */}
      <Modal
        isOpen={!!viewingAsset}
        onClose={() => setViewingAsset(null)}
        title="Asset Details & Inspector"
        description="Inspect high-resolution preview and CDN metadata for this asset."
        maxWidth="max-w-2xl"
        footer={
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setViewingAsset(null)}
              className="px-4 py-2 rounded-xl text-xs font-mono text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white bg-ink-100 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 transition-colors"
            >
              Close Inspector
            </button>
          </div>
        }
      >
        {viewingAsset && (
          <div className="space-y-4">
            {/* Large Preview */}
            <div className="max-h-80 bg-ink-100 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl p-2 flex items-center justify-center overflow-hidden">
              <img
                src={viewingAsset.secureUrl}
                alt={viewingAsset.altText || viewingAsset.publicId}
                className="max-h-72 max-w-full object-contain"
              />
            </div>

            {/* Metadata Table */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 bg-ink-50 dark:bg-ink-950/60 rounded-lg border border-ink-200 dark:border-ink-800/60">
                <span className="text-ink-500 dark:text-ink-400">Public ID:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {viewingAsset.publicId}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-ink-50 dark:bg-ink-950/60 rounded-lg border border-ink-200 dark:border-ink-800/60">
                <span className="text-ink-500 dark:text-ink-400">Dimensions:</span>
                <span className="text-ink-800 dark:text-ink-200">
                  {viewingAsset.width} × {viewingAsset.height} px
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-ink-50 dark:bg-ink-950/60 rounded-lg border border-ink-200 dark:border-ink-800/60">
                <span className="text-ink-500 dark:text-ink-400">Format / Mime:</span>
                <span className="text-ink-800 dark:text-ink-200 uppercase font-semibold">
                  {viewingAsset.format}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-ink-50 dark:bg-ink-950/60 rounded-lg border border-ink-200 dark:border-ink-800/60">
                <span className="text-ink-500 dark:text-ink-400">Size:</span>
                <span className="text-ink-800 dark:text-ink-200">
                  {viewingAsset.bytes ? (viewingAsset.bytes / 1024).toFixed(2) : "—"} KB
                </span>
              </div>
              <div className="flex flex-col gap-1 p-2 bg-ink-50 dark:bg-ink-950/60 rounded-lg border border-ink-200 dark:border-ink-800/60">
                <span className="text-ink-500 dark:text-ink-400">Secure CDN URL:</span>
                <span className="text-[11px] text-ink-700 dark:text-ink-300 break-all select-all font-mono">
                  {viewingAsset.secureUrl}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
