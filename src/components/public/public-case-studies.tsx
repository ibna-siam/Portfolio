"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiAlertTriangle,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiFolder,
} from "react-icons/fi";
import { PublicCaseStudySummary } from "@/lib/public-data";

interface PublicCaseStudiesProps {
  caseStudies: PublicCaseStudySummary[];
}

export function PublicCaseStudies({ caseStudies }: PublicCaseStudiesProps) {
  const [activeGroup, setActiveGroup] = useState<"all" | "accounting" | "macroeconomics">(
    "all"
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const filtered = caseStudies.filter((item) => {
    if (activeGroup === "all") return true;
    return item.groupId === activeGroup;
  });

  const displayedStudies = isExpanded ? filtered : filtered.slice(0, 4);
  const remainingCount = Math.max(0, filtered.length - 4);

  const handleGroupChange = (group: "all" | "accounting" | "macroeconomics") => {
    setActiveGroup(group);
    setIsExpanded(false); // Reset to clean 4-item initial view on tab switch
  };

  const accountingCount = caseStudies.filter((c) => c.groupId === "accounting").length;
  const macroCount = caseStudies.filter((c) => c.groupId === "macroeconomics").length;

  return (
    <section
      id="case-studies"
      className="py-20 sm:py-24 bg-white dark:bg-ink-950/70 border-t border-ink-200/60 dark:border-ink-800/60"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block">
            Evidence-Based Coursework & Research
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 dark:text-ink-50 tracking-tight">
            Financial Case Studies & Applied Analysis
          </h2>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-300 leading-relaxed">
            Detailed examinations of audited financial statements, operational cost
            models, taxation schedules under the Bangladesh Income Tax Act 2023, and
            macroeconomic dynamics.
          </p>
        </div>

        {/* Group Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter case studies by discipline"
          className="flex justify-center gap-2 mb-10 flex-wrap"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeGroup === "all"}
            onClick={() => handleGroupChange("all")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer ${
              activeGroup === "all"
                ? "bg-emerald-700 text-white font-semibold shadow-xs"
                : "bg-ink-100 dark:bg-ink-900 text-ink-700 dark:text-ink-300 font-medium hover:bg-ink-200 dark:hover:bg-ink-800"
            }`}
          >
            <span>All Studies</span>
            <span
              className={`text-[11px] font-mono px-1.5 py-0.5 rounded-full ${
                activeGroup === "all"
                  ? "bg-ink-950/30 text-white font-bold"
                  : "bg-ink-200 dark:bg-ink-800 text-ink-600 dark:text-ink-300"
              }`}
            >
              {caseStudies.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeGroup === "accounting"}
            onClick={() => handleGroupChange("accounting")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer ${
              activeGroup === "accounting"
                ? "bg-emerald-700 text-white font-semibold shadow-xs"
                : "bg-ink-100 dark:bg-ink-900 text-ink-700 dark:text-ink-300 font-medium hover:bg-ink-200 dark:hover:bg-ink-800"
            }`}
          >
            <span>Applied Accounting</span>
            <span
              className={`text-[11px] font-mono px-1.5 py-0.5 rounded-full ${
                activeGroup === "accounting"
                  ? "bg-ink-950/30 text-white font-bold"
                  : "bg-ink-200 dark:bg-ink-800 text-ink-600 dark:text-ink-300"
              }`}
            >
              {accountingCount}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeGroup === "macroeconomics"}
            onClick={() => handleGroupChange("macroeconomics")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer ${
              activeGroup === "macroeconomics"
                ? "bg-emerald-700 text-white font-semibold shadow-xs"
                : "bg-ink-100 dark:bg-ink-900 text-ink-700 dark:text-ink-300 font-medium hover:bg-ink-200 dark:hover:bg-ink-800"
            }`}
          >
            <span>Macroeconomic Research</span>
            <span
              className={`text-[11px] font-mono px-1.5 py-0.5 rounded-full ${
                activeGroup === "macroeconomics"
                  ? "bg-ink-950/30 text-white font-bold"
                  : "bg-ink-200 dark:bg-ink-800 text-ink-600 dark:text-ink-300"
              }`}
            >
              {macroCount}
            </span>
          </button>
        </div>

        {/* Case Studies Grid */}
        <div id="case-studies-grid" className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {displayedStudies.map((study) => (
            <article
              key={study.id}
              className="rounded-2xl p-6 sm:p-7 bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-sm hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Meta pills bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-ink-800 text-ink-800 dark:text-ink-200 border border-ink-200 dark:border-ink-700">
                    {study.category}
                  </span>

                  {study.hasDiscrepancy ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/25 font-semibold">
                      <FiAlertTriangle
                        size={12}
                        className="text-amber-600 dark:text-amber-400"
                      />
                      Discrepancy Disclosed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 font-medium">
                      <FiCheckCircle
                        size={12}
                        className="text-emerald-600 dark:text-emerald-400"
                      />
                      Empirical Case Study
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-xl sm:text-2xl text-ink-900 dark:text-ink-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  <Link href={`/case-studies/${study.slug}`} prefetch={true}>
                    {study.title}
                  </Link>
                </h3>

                {/* Compact Financial Metric Strip */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-ink-950/70 border border-ink-200/70 dark:border-ink-800/70 text-xs">
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-ink-500 dark:text-ink-400 font-medium">
                      Framework
                    </span>
                    <span
                      className="font-semibold text-ink-900 dark:text-ink-100 truncate block mt-0.5"
                      title={study.framework}
                    >
                      {study.framework}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-ink-500 dark:text-ink-400 font-medium">
                      Currency
                    </span>
                    <span className="font-mono font-semibold text-ink-900 dark:text-ink-100 truncate block mt-0.5">
                      {study.currencyUnit}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-ink-500 dark:text-ink-400 font-medium">
                      Discipline
                    </span>
                    <span className="font-semibold text-ink-900 dark:text-ink-100 truncate block mt-0.5">
                      {study.groupShort}
                    </span>
                  </div>
                </div>

                {/* Brief description */}
                <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-300 leading-relaxed line-clamp-3">
                  {study.description}
                </p>

                {/* Discrepancy Notice Snippet (if active) */}
                {study.hasDiscrepancy && study.discrepancyHeadline && (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200">
                    <span className="font-semibold block font-mono text-[11px]">
                      Notice:
                    </span>
                    <span className="text-[11px] leading-tight block mt-0.5">
                      {study.discrepancyHeadline}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="pt-4 mt-5 border-t border-ink-100 dark:border-ink-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-ink-600 dark:text-ink-400">
                  {study.groupShort} Case Study
                </span>
                <Link
                  href={`/case-studies/${study.slug}`}
                  prefetch={true}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                >
                  <span>View Case Study</span>
                  <FiArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Progressive Disclosure & Full Catalog Action Bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {filtered.length > 4 && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              aria-controls="case-studies-grid"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 shadow-xs hover:bg-emerald-100 dark:hover:bg-emerald-500/20 active:translate-y-0.5 transition-all cursor-pointer"
            >
              {isExpanded ? (
                <>
                  <FiChevronUp size={16} />
                  <span>Show Less (Collapse to 4)</span>
                </>
              ) : (
                <>
                  <FiChevronDown size={16} />
                  <span>See More Case Studies ({remainingCount} remaining)</span>
                </>
              )}
            </button>
          )}

          <Link
            href="/case-studies"
            prefetch={true}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-ink-700 dark:text-ink-300 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-xs hover:bg-slate-50 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-ink-100 transition-colors"
          >
            <FiFolder size={15} className="text-emerald-700 dark:text-emerald-400" />
            <span>Explore Complete Catalog ({caseStudies.length} Studies)</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
