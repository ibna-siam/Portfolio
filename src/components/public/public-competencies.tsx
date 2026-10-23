"use client";

import { useState } from "react";
import { FiCheckCircle, FiTag, FiChevronDown, FiChevronUp } from "react-icons/fi";

interface CompetencyItem {
  id: string;
  name: string;
  domain: string;
  category: string;
  evidenceLabel: string;
  description: string;
  frameworkTags: string[];
  relatedProject: string;
  sortOrder: number;
}

interface PublicCompetenciesProps {
  competencies: CompetencyItem[];
}

const CATEGORIES = [
  { id: "All", label: "All Disciplines" },
  { id: "Financial Accounting", label: "Financial Accounting" },
  { id: "Managerial Accounting", label: "Managerial Accounting" },
  { id: "Taxation & Audit", label: "Taxation & Audit" },
  { id: "Software & Tech", label: "Software & Tech" },
];

export function PublicCompetencies({ competencies }: PublicCompetenciesProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isExpanded, setIsExpanded] = useState(false);

  const filtered =
    activeCategory === "All"
      ? competencies
      : competencies.filter(
          (c) => c.category === activeCategory || c.domain === activeCategory
        );

  const displayedCompetencies = isExpanded ? filtered : filtered.slice(0, 4);
  const remainingCount = Math.max(0, filtered.length - 4);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setIsExpanded(false); // Reset to 4 items on category switch
  };

  return (
    <section
      id="competencies"
      className="py-20 sm:py-24 bg-slate-50/80 dark:bg-ink-900/40 border-t border-ink-200/80 dark:border-ink-800/80"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 dark:text-emerald-300 font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block">
            Domain Capabilities
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 dark:text-ink-50 tracking-tight">
            Accounting & Analytical Competencies
          </h2>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-300 leading-relaxed">
            A structured matrix of financial accounting, managerial costing, regulatory
            compliance, and spreadsheet-based financial modeling grounded in academic
            coursework and empirical case studies.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter competencies by discipline"
          className="flex justify-center gap-2 mb-10 flex-wrap"
        >
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const count =
              cat.id === "All"
                ? competencies.length
                : competencies.filter((c) => c.category === cat.id || c.domain === cat.id)
                    .length;

            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer ${
                  isSelected
                    ? "bg-emerald-700 text-white font-semibold shadow-xs"
                    : "bg-white dark:bg-ink-900 text-ink-700 dark:text-ink-300 font-medium hover:bg-slate-100 dark:hover:bg-ink-800 border border-ink-200 dark:border-ink-800"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-ink-950/30 text-white font-bold"
                      : "bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Competencies Grid */}
        <div
          id="competencies-grid"
          className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5"
        >
          {displayedCompetencies.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-ink-900 rounded-xl p-5 sm:p-6 border border-ink-200/90 dark:border-ink-800 border-l-4 border-l-emerald-600 dark:border-l-emerald-500 hover:border-emerald-500/50 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-emerald-800 dark:text-emerald-300 uppercase font-semibold">
                    {item.domain}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 font-medium">
                    <FiCheckCircle
                      size={12}
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                    {item.evidenceLabel}
                  </span>
                </div>

                {/* Skill Title */}
                <h3 className="font-display font-bold text-base sm:text-lg text-ink-900 dark:text-ink-50 leading-snug">
                  {item.name}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Framework Tags */}
                {item.frameworkTags && item.frameworkTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.frameworkTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border border-ink-200 dark:border-ink-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Related Study Anchor */}
              <div className="pt-3.5 mt-4 border-t border-ink-100 dark:border-ink-800/80 flex items-center justify-between text-xs font-mono text-ink-600 dark:text-ink-400">
                <span className="text-xs flex items-center gap-1 font-medium text-ink-600 dark:text-ink-400">
                  <FiTag size={12} className="text-emerald-600 dark:text-emerald-400" />
                  Applied in:
                </span>
                <span className="font-medium text-ink-800 dark:text-ink-200 truncate max-w-[240px]">
                  {item.relatedProject}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Progressive Disclosure Control */}
        {filtered.length > 4 && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              aria-controls="competencies-grid"
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
                  <span>See More Competencies ({remainingCount} remaining)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
