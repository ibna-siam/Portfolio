"use client";

import React from "react";
import { FiAlertTriangle, FiTrash2 } from "react-icons/fi";
import { Modal } from "@/components/admin/modal";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  itemType?: string;
  isPending?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  itemType = "record",
  isPending = false,
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-xl text-xs font-mono text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200 bg-ink-100 hover:bg-ink-200 dark:bg-ink-800 dark:hover:bg-ink-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
          >
            <FiTrash2 size={13} aria-hidden="true" />
            <span>{isPending ? "Deleting..." : `Delete ${itemType}`}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-xs font-mono">
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-800 dark:text-red-300 flex items-start gap-3">
          <FiAlertTriangle
            size={18}
            className="shrink-0 text-red-600 dark:text-red-400 mt-0.5"
          />
          <div className="space-y-1">
            <p className="font-semibold font-sans">Warning: This action is permanent</p>
            <p className="text-[11px] leading-relaxed opacity-90">
              Are you sure you want to delete{" "}
              <span className="font-bold underline">{itemName}</span>? All associated
              audit revisions and relationships will be permanently removed or detached.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
