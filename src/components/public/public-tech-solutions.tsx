"use client";

import { useState } from "react";
import {
  FiTool,
  FiExternalLink,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

interface TechSolutionItem {
  id: string;
  title: string;
  category: string;
  status: string;
  statusTheme: string;
  problem: string;
  solution: string;
  userRole: string;
  techStack: string[];
  features: string[];
  verifiedRepo: string | null;
  verifiedDemo: string | null;
  linkText: string;
  sortOrder: number;
}

interface PublicTechSolutionsProps {
  solutions: TechSolutionItem[];
}

export function PublicTechSolutions({ solutions }: PublicTechSolutionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_LIMIT = 3;
  const visibleSolutions = isExpanded ? solutions : solutions.slice(0, INITIAL_LIMIT);
  const hasMore = solutions.length > INITIAL_LIMIT;
  const remainingCount = solutions.length - INITIAL_LIMIT;

  return (
    <section
      id="tech-solutions"
      className="py-20 sm:py-24 bg-ink-100/30 dark:bg-ink-950/40 border-t border-ink-200/60 dark:border-ink-800/60 scroll-mt-20"
    >
      <div id="solutions" className="scroll-mt-20" />
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block">
            Supporting Capability · 25% Weight
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 dark:text-ink-50 tracking-tight">
            Business & Technology Solutions
          </h2>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-300 leading-relaxed">
            Practical software systems, calculation engines, and digital workflows
            developed to automate expense reconciliations, managerial budgeting, and
            financial reporting.
          </p>
        </div>

        {/* Positioning & Hierarchy Grounding Notice */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3 max-w-2xl">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <FiTool size={18} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs sm:text-sm font-bold text-ink-900 dark:text-ink-50">
                Technological Capability Supporting Accounting Rigor
              </h3>
              <p className="text-xs text-ink-600 dark:text-ink-400 leading-relaxed">
                These projects demonstrate practical problem-solving using modern web
                tools and structured calculation logic. They serve as complementary
                evidence of analytical capability, distinct from the core academic
                accounting case studies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-3 py-1 rounded-lg bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border border-ink-200 dark:border-ink-700">
              {solutions.length} Verified Systems
            </span>
          </div>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {visibleSolutions.map((solution) => (
            <article
              key={solution.id}
              className="bg-white dark:bg-ink-900 rounded-3xl p-6 border border-ink-200/80 dark:border-ink-800/80 hover:border-emerald-500/30 shadow-clay-card dark:shadow-clay-card-dark transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800">
                    <FiCheckCircle size={12} className="shrink-0" />
                    <span>{solution.status}</span>
                  </span>
                  <span className="text-[11px] font-mono text-ink-600 dark:text-ink-400">
                    {solution.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-lg text-ink-900 dark:text-ink-50 leading-snug">
                  {solution.title}
                </h3>

                {/* Problem & Solution */}
                <div className="space-y-2 text-xs text-ink-600 dark:text-ink-300">
                  <p>
                    <strong className="text-ink-900 dark:text-ink-100">Problem: </strong>
                    {solution.problem}
                  </p>
                  <p>
                    <strong className="text-ink-900 dark:text-ink-100">Solution: </strong>
                    {solution.solution}
                  </p>
                </div>

                {/* Tech Stack Pills */}
                {solution.techStack && solution.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {solution.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 border border-ink-200 dark:border-ink-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Link Footer */}
              {solution.verifiedRepo && (
                <div className="pt-4 border-t border-ink-100 dark:border-ink-800/80">
                  <a
                    href={solution.verifiedRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                  >
                    <span>{solution.linkText || "View Repository"}</span>
                    <FiExternalLink size={13} />
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Progressive Disclosure Action */}
        {hasMore && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-controls="tech-solutions"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm bg-white dark:bg-ink-900 text-ink-800 dark:text-ink-200 border border-ink-200 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800 hover:border-ink-300 dark:hover:border-ink-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              {isExpanded ? (
                <>
                  <FiChevronUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Show Less Solutions</span>
                </>
              ) : (
                <>
                  <FiChevronDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>See More Solutions ({remainingCount} more)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
