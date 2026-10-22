import { FiDatabase, FiInfo } from "react-icons/fi";
import { PublicFinancialSchedule } from "@/lib/public-data";

interface FinancialScheduleTableProps {
  schedule: PublicFinancialSchedule;
  currencyUnit?: string;
}

export function FinancialScheduleTable({
  schedule,
  currencyUnit,
}: FinancialScheduleTableProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-sm overflow-hidden my-6">
      {/* Table Header / Title Bar */}
      <div className="px-5 py-4 border-b border-ink-200 dark:border-ink-800 bg-ink-50/70 dark:bg-ink-950/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <FiDatabase size={14} aria-hidden="true" />
          </div>
          <h4 className="font-display font-bold text-sm sm:text-base text-ink-900 dark:text-ink-50">
            {schedule.title}
          </h4>
        </div>

        {currencyUnit && (
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 border border-ink-200 dark:border-ink-700">
            Unit: {currencyUnit}
          </span>
        )}
      </div>

      {/* Responsive Overflow Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-ink-200 dark:border-ink-800 bg-ink-100/50 dark:bg-ink-900/80">
              {schedule.headers.map((header, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`px-4 py-3 font-mono font-semibold text-ink-700 dark:text-ink-300 uppercase tracking-wider text-[11px] ${
                    idx === 0 ? "text-left" : "text-right"
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 dark:divide-ink-800/60 font-body">
            {schedule.rows.map((row, rIdx) => {
              const isLastRow = rIdx === schedule.rows.length - 1;
              const isTotal =
                row[0]?.toLowerCase().includes("total") ||
                row[0]?.toLowerCase().includes("net") ||
                isLastRow;

              return (
                <tr
                  key={rIdx}
                  className={`transition-colors hover:bg-emerald-500/5 ${
                    isTotal
                      ? "bg-ink-50/80 dark:bg-ink-950/70 font-semibold"
                      : rIdx % 2 === 1
                      ? "bg-ink-50/30 dark:bg-ink-950/20"
                      : "bg-white dark:bg-ink-900"
                  }`}
                >
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`px-4 py-2.5 whitespace-nowrap text-xs ${
                        cIdx === 0
                          ? "text-ink-800 dark:text-ink-200 font-medium text-left"
                          : "text-ink-700 dark:text-ink-300 tabular-nums text-right font-mono"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Schedule Notes */}
      {schedule.notes && (
        <div className="px-5 py-3 border-t border-ink-200 dark:border-ink-800 bg-ink-50/40 dark:bg-ink-950/40 flex items-start gap-2 text-xs text-ink-500 dark:text-ink-400">
          <FiInfo size={13} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
          <p className="leading-relaxed font-mono text-[11px]">{schedule.notes}</p>
        </div>
      )}
    </div>
  );
}
