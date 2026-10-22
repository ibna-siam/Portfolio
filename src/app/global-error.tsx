"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GLOBAL_ERROR] Caught critical root layout error:", error.digest || "No digest");
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-[#e2e8f0] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-[#0f172a] border border-[#1e293b] rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-4 text-xl">
            ⚠
          </div>
          <h1 className="text-xl font-bold text-white mb-2">
            Application Error
          </h1>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            A critical rendering failure occurred. Your session and portfolio data remain intact.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
