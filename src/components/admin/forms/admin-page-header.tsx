import React from "react";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-ink-200 dark:border-ink-800">
      <div className="space-y-1.5">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-ink-500 font-mono"
        >
          <Link
            href="/admin"
            className="hover:text-ink-900 dark:hover:text-ink-100 transition-colors"
          >
            Admin
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <FiChevronRight
                size={12}
                className="text-ink-400 shrink-0"
                aria-hidden="true"
              />
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-ink-900 dark:hover:text-ink-100 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className="text-ink-900 dark:text-ink-100 font-medium"
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Title & Description */}
        <h1 className="font-display font-bold text-2xl text-ink-900 dark:text-ink-50 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-ink-500 dark:text-ink-400 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Action Buttons Slot */}
      {actions && (
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
