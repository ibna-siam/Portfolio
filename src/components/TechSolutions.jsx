import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FiCpu,
  FiCode,
  FiLayers,
  FiExternalLink,
  FiCheckCircle,
  FiAlertCircle,
  FiTool,
} from "react-icons/fi";
import { TECH_SOLUTIONS } from "../data/techSolutionsData";
import { SectionHeading } from "./SectionHeading";

export default function TechSolutions() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const getStatusBadge = (statusTheme) => {
    switch (statusTheme) {
      case "emerald":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
          icon: FiCheckCircle,
        };
      case "blue":
        return {
          bg: "bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800",
          icon: FiCpu,
        };
      case "purple":
      default:
        return {
          bg: "bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800",
          icon: FiLayers,
        };
    }
  };

  return (
    <section id="solutions" className="py-24 bg-ink-100/30 dark:bg-ink-950/40">
      <div ref={ref} className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Canonical Section Heading */}
          <SectionHeading
            label="Supporting Capability · 25% Weight"
            title="Business & Technology Solutions"
            subtitle="Practical software systems, calculation engines, and digital workflows developed to automate expense reconciliations, managerial budgeting, and financial reporting."
          />

          {/* Positioning & Hierarchy Grounding Notice */}
          <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3 max-w-2xl">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                <FiTool size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-ink-900 dark:text-ink-50">
                  Technological Capability Supporting Accounting Rigor
                </h3>
                <p className="text-xs text-ink-600 dark:text-ink-400 leading-relaxed">
                  These projects demonstrate practical problem-solving using modern web tools and structured calculation logic. They serve as complementary evidence of analytical capability, distinct from the five core academic accounting case studies.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-3 py-1 rounded-lg bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border border-ink-200 dark:border-ink-700">
                3 Verified Systems
              </span>
            </div>
          </div>

          {/* Solutions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TECH_SOLUTIONS.map((solution, idx) => {
              const badge = getStatusBadge(solution.statusTheme, solution.status);
              const BadgeIcon = badge.icon;

              return (
                <motion.article
                  key={solution.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className="bg-white dark:bg-ink-900 rounded-2xl p-6 border border-ink-200 dark:border-ink-800 hover:border-teal-400/40 dark:hover:border-teal-500/30 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-5 group"
                >
                  <div className="space-y-4">
                    {/* Status & Category Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${badge.bg}`}
                      >
                        <BadgeIcon size={12} className="shrink-0" />
                        <span>{solution.status}</span>
                      </span>

                      <span className="text-[11px] font-mono text-ink-400 dark:text-ink-500">
                        Solution {idx + 1}
                      </span>
                    </div>

                    {/* Title & Category */}
                    <div>
                      <h4 className="font-display font-bold text-base sm:text-lg text-ink-900 dark:text-ink-50 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
                        {solution.title}
                      </h4>
                      <p className="text-xs font-mono text-teal-700 dark:text-teal-400 mt-1">
                        {solution.category}
                      </p>
                    </div>

                    {/* Business Problem Box */}
                    <div className="p-3 rounded-xl bg-ink-50 dark:bg-ink-800/50 border border-ink-100 dark:border-ink-800 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-ink-800 dark:text-ink-200">
                        <FiAlertCircle className="text-amber-600 dark:text-amber-400 shrink-0" size={13} />
                        <span>Business / User Friction:</span>
                      </div>
                      <p className="text-ink-600 dark:text-ink-400 leading-relaxed">
                        {solution.problem}
                      </p>
                    </div>

                    {/* Implemented Solution */}
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-ink-800 dark:text-ink-200 block">
                        Implemented System Solution:
                      </span>
                      <p className="text-ink-600 dark:text-ink-400 leading-relaxed">
                        {solution.solution}
                      </p>
                    </div>

                    {/* Implemented Features List */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-ink-400 dark:text-ink-500 uppercase tracking-wider block">
                        Key Features & Capabilities:
                      </span>
                      <ul className="space-y-1.5">
                        {solution.features.map((feature, fIdx) => (
                          <li
                            key={fIdx}
                            className="flex items-start gap-2 text-xs text-ink-600 dark:text-ink-300 leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Footer: Role, Tech Stack & Verified Link */}
                  <div className="pt-4 border-t border-ink-100 dark:border-ink-800 space-y-3">
                    <div className="text-[11px] text-ink-500 dark:text-ink-400">
                      <strong className="text-ink-700 dark:text-ink-300 font-semibold">Role:</strong>{" "}
                      {solution.userRole}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {solution.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 text-[10px] font-mono font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {solution.verifiedRepo && (
                      <a
                        href={solution.verifiedRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors pt-1"
                      >
                        <FiCode size={13} />
                        <span>{solution.linkText}</span>
                        <FiExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
