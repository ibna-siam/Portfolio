"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FiAlertTriangle, FiRefreshCw, FiArrowLeft } from "react-icons/fi";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized error digest to client console for diagnostics without exposing sensitive data
    console.error(
      "[APP_ERROR] Handled runtime error boundary:",
      error.digest || "No digest"
    );
  }, [error]);

  return (
    <main className="min-h-screen bg-ink-950 text-ink-100 flex items-center justify-center p-6 font-body">
      <div className="max-w-md w-full bg-ink-900 border border-ink-800 shadow-clay-card-dark rounded-2xl p-8 text-center animate-fade-up">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 shadow-clay-inset-dark flex items-center justify-center text-rose-400 mx-auto mb-4">
          <FiAlertTriangle className="w-6 h-6" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink-50 mb-2">
          Temporary Service Disruption
        </h1>
        <p className="text-sm text-ink-400 mb-6 leading-relaxed">
          The requested portfolio service encountered a momentary operational issue. No
          data has been compromised. Please retry or return to the main portfolio.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-clay-card-dark hover:bg-emerald-500/20 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium text-ink-300 bg-ink-800/60 border border-ink-700/60 shadow-clay-card-dark hover:bg-ink-800 hover:text-ink-100 active:translate-y-0.5 transition-all"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 text-[10px] font-mono text-ink-600">
            Reference ID: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
