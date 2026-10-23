import React from "react";

interface FormCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export function FormCard({
  title,
  description,
  children,
  className = "",
  headerAction,
}: FormCardProps) {
  return (
    <div
      className={`bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl p-5 sm:p-6 shadow-xs transition-colors ${className}`}
    >
      <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-ink-100 dark:border-ink-800">
        <div>
          <h2 className="font-display font-bold text-base text-ink-900 dark:text-ink-100 tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {headerAction && <div className="shrink-0">{headerAction}</div>}
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
}
