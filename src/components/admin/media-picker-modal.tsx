"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiImage,
  FiSearch,
  FiCheck,
  FiExternalLink,
  FiUploadCloud,
} from "react-icons/fi";
import { Modal } from "./modal";

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Media Asset"
      description="Choose an asset registered in the Cloudinary Media Library"
      maxWidth="max-w-4xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-ink-600 dark:text-ink-400 truncate max-w-xs sm:max-w-md">
            {selectedAsset ? (
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
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
              className="px-4 py-2 rounded-xl text-xs font-mono text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200 bg-ink-100 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedAsset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium text-ink-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md dark:shadow-clay-card-dark active:translate-y-0.5 transition-all"
            >
              <FiCheck className="w-3.5 h-3.5" />
              <span>Confirm Selection</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-ink-200 dark:border-ink-800">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 dark:text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by public ID, alt text, or format..."
              className="w-full bg-white dark:bg-ink-900 border border-ink-300 dark:border-ink-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-ink-900 dark:text-ink-100 placeholder:text-ink-500 dark:placeholder:text-ink-400 shadow-sm focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          <Link
            href="/admin/media"
            target="_blank"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono text-ink-700 dark:text-ink-300 hover:text-emerald-700 dark:hover:text-emerald-400 bg-ink-100 dark:bg-ink-900 hover:bg-ink-200 dark:hover:bg-ink-800 border border-ink-200 dark:border-ink-800 transition-colors shrink-0"
          >
            <FiUploadCloud className="w-3.5 h-3.5" />
            <span>Upload to Media Library</span>
            <FiExternalLink className="w-3 h-3 text-ink-500 dark:text-ink-400" />
          </Link>
        </div>

        {/* Assets Grid */}
        <div>
          {filteredAssets.length === 0 ? (
            <div className="py-16 text-center text-ink-600 dark:text-ink-400">
              <FiImage className="w-12 h-12 mx-auto mb-3 opacity-40 text-ink-400 dark:text-ink-500" />
              <p className="text-sm font-medium text-ink-800 dark:text-ink-200">
                No media assets found
              </p>
              <p className="text-xs text-ink-600 dark:text-ink-400 mt-1 max-w-sm mx-auto">
                {assets.length === 0
                  ? "Your media library is empty. Upload images in the Media Library to use them here."
                  : "No assets match your search criteria."}
              </p>
              {assets.length === 0 && (
                <Link
                  href="/admin/media"
                  target="_blank"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
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
                        ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/5 ring-2 ring-emerald-500/30 shadow-md"
                        : "border-ink-200 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/60 hover:border-ink-300 dark:hover:border-ink-700 hover:bg-ink-100/60 dark:hover:bg-ink-900"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video w-full bg-ink-100 dark:bg-ink-950 relative overflow-hidden flex items-center justify-center">
                      <Image
                        src={asset.secureUrl}
                        alt={asset.altText || asset.publicId}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-white dark:text-ink-950 flex items-center justify-center shadow-lg">
                          <FiCheck className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                      {asset.format && (
                        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-ink-900/80 dark:bg-ink-950/80 text-white dark:text-ink-300 backdrop-blur-xs">
                          {asset.format}
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <div className="font-mono text-[11px] text-ink-800 dark:text-ink-200 font-medium truncate mb-1">
                        {asset.publicId.split("/").pop()}
                      </div>
                      <div className="text-[10px] text-ink-600 dark:text-ink-400 flex items-center justify-between font-mono">
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
      </div>
    </Modal>
  );
}
