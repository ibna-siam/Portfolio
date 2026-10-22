"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiImage,
  FiSearch,
  FiCheck,
  FiX,
  FiExternalLink,
  FiUploadCloud,
} from "react-icons/fi";

export interface MediaPickerAsset {
  id: string;
  publicId: string;
  secureUrl: string;
  format: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
  altText: string | null;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: MediaPickerAsset) => void;
  assets?: MediaPickerAsset[];
  currentSelectedUrl?: string | null;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  assets = [],
  currentSelectedUrl,
}: MediaPickerModalProps) {
  const [search, setSearch] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<MediaPickerAsset | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAssets = assets.filter((asset) => {
    const query = search.toLowerCase();
    return (
      asset.publicId.toLowerCase().includes(query) ||
      (asset.altText && asset.altText.toLowerCase().includes(query)) ||
      (asset.format && asset.format.toLowerCase().includes(query))
    );
  });

  const handleConfirm = () => {
    if (selectedAsset) {
      onSelect(selectedAsset);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-picker-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-ink-900 border border-ink-800 shadow-clay-card-dark rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-ink-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-clay-inset-dark flex items-center justify-center text-emerald-400">
              <FiImage className="w-5 h-5" />
            </div>
            <div>
              <h3 id="media-picker-title" className="font-display font-bold text-ink-50 text-base">
                Select Media Asset
              </h3>
              <p className="text-xs text-ink-400">
                Choose an asset registered in the Cloudinary Media Library
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/media"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-ink-300 hover:text-emerald-400 bg-ink-800/60 hover:bg-ink-800 border border-ink-700/60 transition-colors"
            >
              <FiUploadCloud className="w-3.5 h-3.5" />
              <span>Upload New</span>
              <FiExternalLink className="w-3 h-3 text-ink-400" />
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-ink-400 hover:text-ink-100 hover:bg-ink-800/80 transition-colors"
              aria-label="Close dialog"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-ink-800/60 bg-ink-950/40">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by public ID, alt text, or format..."
              className="w-full bg-ink-900 border border-ink-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-ink-100 placeholder:text-ink-500 shadow-clay-inset-dark focus:outline-none focus:border-emerald-500/60"
            />
          </div>
        </div>

        {/* Assets Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {filteredAssets.length === 0 ? (
            <div className="py-16 text-center text-ink-500">
              <FiImage className="w-12 h-12 mx-auto mb-3 opacity-30 text-ink-400" />
              <p className="text-sm font-medium text-ink-300">No media assets found</p>
              <p className="text-xs text-ink-500 mt-1 max-w-sm mx-auto">
                {assets.length === 0
                  ? "Your media library is empty. Upload images in the Media Library to use them here."
                  : "No assets match your search criteria."}
              </p>
              {assets.length === 0 && (
                <Link
                  href="/admin/media"
                  target="_blank"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
                >
                  <FiUploadCloud className="w-4 h-4" />
                  <span>Go to Media Library</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => {
                const isSelected =
                  selectedAsset?.id === asset.id ||
                  (!selectedAsset && currentSelectedUrl === asset.secureUrl);

                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setSelectedAsset(asset)}
                    className={`text-left rounded-xl overflow-hidden border transition-all cursor-pointer group relative flex flex-col ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-500/5 ring-2 ring-emerald-500/30 shadow-clay-card-dark"
                        : "border-ink-800 bg-ink-950/60 hover:border-ink-700 hover:bg-ink-900"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video w-full bg-ink-950 relative overflow-hidden flex items-center justify-center">
                      <Image
                        src={asset.secureUrl}
                        alt={asset.altText || asset.publicId}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-ink-950 flex items-center justify-center shadow-lg">
                          <FiCheck className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                      {asset.format && (
                        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-ink-950/80 text-ink-300 backdrop-blur-xs">
                          {asset.format}
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <div className="font-mono text-[11px] text-ink-200 font-medium truncate mb-1">
                        {asset.publicId.split("/").pop()}
                      </div>
                      <div className="text-[10px] text-ink-500 flex items-center justify-between font-mono">
                        <span>
                          {asset.width && asset.height
                            ? `${asset.width}x${asset.height}`
                            : "Raster"}
                        </span>
                        {asset.bytes && <span>{(asset.bytes / 1024).toFixed(0)} KB</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-ink-800 bg-ink-950/60 flex items-center justify-between">
          <div className="text-xs text-ink-400 truncate max-w-md">
            {selectedAsset ? (
              <span className="font-mono text-emerald-400">
                Selected: {selectedAsset.publicId}
              </span>
            ) : (
              <span>Select an asset to attach</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-ink-400 hover:text-ink-200 bg-ink-900 border border-ink-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedAsset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium text-ink-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-clay-card-dark active:translate-y-0.5 transition-all"
            >
              <FiCheck className="w-3.5 h-3.5" />
              <span>Confirm Selection</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
