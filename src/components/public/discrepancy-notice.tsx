import { FiAlertTriangle, FiShield, FiFileText } from "react-icons/fi";
import { PublicDiscrepancyNotice } from "@/lib/public-data";

interface DiscrepancyNoticeProps {
  discrepancy: PublicDiscrepancyNotice;
}

export function DiscrepancyNotice({ discrepancy }: DiscrepancyNoticeProps) {
  return (
    <aside
      aria-label="Financial Integrity Notice"
      data-testid="discrepancy-notice"
      className="rounded-2xl p-5 sm:p-6 bg-amber-500/10 border-2 border-amber-500/30 text-ink-900 dark:text-ink-100 space-y-4 my-6 shadow-sm"
    >
      {/* Top Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <FiAlertTriangle size={18} aria-hidden="true" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-amber-700 dark:text-amber-400 block">
              Academic Financial Integrity Disclosure
            </span>
            <h3 className="font-display font-bold text-base sm:text-lg text-ink-900 dark:text-white leading-snug">
              {discrepancy.headline}
            </h3>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono text-xs font-semibold border border-amber-500/30">
          <FiShield size={12} aria-hidden="true" />
          {discrepancy.statusText}
        </span>
      </div>

      {/* Summary Narrative */}
      <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed font-medium">
        {discrepancy.summary}
      </p>

      {/* Technical Reconciliation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2 border-t border-amber-500/20 text-xs">
        <div className="p-3.5 rounded-xl bg-white/70 dark:bg-ink-950/60 border border-amber-500/20 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400 font-semibold flex items-center gap-1.5">
            <FiFileText size={12} className="text-amber-600 dark:text-amber-400" />
            Formula / Relationship Tested
          </span>
          <p className="font-mono text-xs text-ink-900 dark:text-ink-100 font-semibold break-words">
            {discrepancy.formulaTested}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white/70 dark:bg-ink-950/60 border border-amber-500/20 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400 font-semibold">
            Raw Source Values Preserved
          </span>
          <p className="font-mono text-xs text-ink-800 dark:text-ink-200">
            {discrepancy.originalValues}
          </p>
        </div>
      </div>

      {/* Preservation Policy */}
      <div className="text-xs text-ink-600 dark:text-ink-400 italic pt-1">
        <strong>Preservation Policy:</strong> {discrepancy.preservationPolicy}
      </div>
    </aside>
  );
}
