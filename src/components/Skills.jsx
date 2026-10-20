import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { competencies, COMPETENCY_CATEGORIES } from "../data/competenciesData";
import { SectionHeading } from "./SectionHeading";
import { FiCheckCircle, FiFileText } from "react-icons/fi";

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? competencies
      : competencies.filter((item) => item.category === activeCategory);

  return (
    <section id="skills" className="py-20 sm:py-24 bg-ink-100/50 dark:bg-ink-950/60 border-t border-ink-200/60 dark:border-ink-800/60">
      <div ref={ref} className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            label="Domain Capabilities"
            title="Accounting & Analytical Competencies"
            subtitle="A structured matrix of financial accounting, managerial costing, regulatory compliance, and spreadsheet-based financial modeling grounded in academic coursework and empirical case studies."
          />

          {/* Accessible Category Filters */}
          <div
            role="tablist"
            aria-label="Filter competencies by discipline"
            className="flex justify-center gap-2 mb-10 flex-wrap"
          >
            {COMPETENCY_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              const count =
                cat.id === "All"
                  ? competencies.length
                  : competencies.filter((c) => c.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  role="tab"
                  id={`tab-${cat.id}`}
                  aria-selected={isSelected}
                  aria-controls="competency-grid"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer ${
                    isSelected
                      ? "bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm"
                      : "bg-white dark:bg-ink-900 text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 border border-ink-200/80 dark:border-ink-800/80"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[11px] font-mono px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Competency Cards Grid */}
          <div
            id="competency-grid"
            role="tabpanel"
            aria-labelledby={`tab-${activeCategory}`}
            className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => (
                <motion.div
                  key={item.name}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-ink-900 rounded-2xl p-5 sm:p-6 border border-ink-200/80 dark:border-ink-800/80 hover:border-emerald-500/40 dark:hover:border-emerald-500/30 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Card Meta Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-mono text-ink-500 dark:text-ink-400 uppercase font-semibold">
                        {item.domain}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 font-medium">
                        <FiCheckCircle size={11} className="text-emerald-600 dark:text-emerald-400" />
                        {item.evidenceLabel}
                      </span>
                    </div>

                    {/* Competency Title */}
                    <h3 className="font-display text-base sm:text-lg font-bold text-ink-900 dark:text-ink-50 mb-2 leading-snug">
                      {item.name}
                    </h3>

                    {/* Substantive Description */}
                    <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-300 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div>
                    {/* Method & Framework Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3.5">
                      {item.frameworkTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-ink-100 dark:bg-ink-800/80 text-ink-700 dark:text-ink-300 border border-ink-200/60 dark:border-ink-700/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Related Academic Project Linkage */}
                    {item.relatedProject && (
                      <div className="pt-3 border-t border-ink-100 dark:border-ink-800/60 flex items-center justify-between text-[11px] font-mono text-ink-500 dark:text-ink-400">
                        <span className="inline-flex items-center gap-1">
                          <FiFileText size={11} className="text-ink-400" />
                          Academic Reference:
                        </span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold truncate ml-2">
                          {item.relatedProject}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Academic Grounding Notice */}
          <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-ink-900/60 border border-ink-200/70 dark:border-ink-800/70 text-center max-w-3xl mx-auto">
            <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed font-mono">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 uppercase">
                Curriculum & Empirical Study Grounding:
              </span>{" "}
              Competencies reflect academic coursework, case studies, and empirical research completed during undergraduate BBA studies at Daffodil International University. Framework tags represent analytical methods explored rather than formal professional certifications or memberships.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
