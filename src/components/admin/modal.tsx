"use client";

import React, { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

const emptySubscribe = () => () => {};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "lg",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const widthClassMap: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
  };

  const resolvedWidthClass = maxWidth.startsWith("max-w-")
    ? maxWidth
    : widthClassMap[maxWidth] || "max-w-lg";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-ink-950/70 dark:bg-ink-950/85 backdrop-blur-xs animate-fade-in"
    >
      {/* Click outside to dismiss backdrop */}
      <div
        className="fixed inset-0 cursor-pointer"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Centered Modal Container */}
      <div
        ref={modalRef}
        className={`relative z-10 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-2xl rounded-2xl w-full ${resolvedWidthClass} max-h-[90vh] flex flex-col overflow-hidden transition-colors`}
      >
        {/* Sticky Header */}
        <div className="p-5 sm:px-6 border-b border-ink-200 dark:border-ink-800 flex items-center justify-between shrink-0 bg-white dark:bg-ink-900">
          <div>
            <h2
              id="modal-title"
              className="font-display font-bold text-ink-900 dark:text-ink-50 text-base sm:text-lg"
            >
              {title}
            </h2>
            {description && (
              <p className="text-xs text-ink-600 dark:text-ink-400 mt-0.5">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 font-sans text-xs sm:text-sm bg-white dark:bg-ink-900">
          {children}
        </div>

        {/* Sticky Action Footer */}
        {footer && (
          <div className="p-4 sm:px-6 border-t border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
