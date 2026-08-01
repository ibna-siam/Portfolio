import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { skills } from "../data/portfolioData";
import { SectionHeading } from "./About";

const CATEGORIES = ["All", "Accounting", "Software", "Soft Skills"];

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="py-24 bg-ink-100/50 dark:bg-ink-900/50">
      <div ref={ref} className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <SectionHeading
            label="What I know"
            title="Skills & Knowledge"
            subtitle="Core accounting competencies, software tools, and professional skills I've developed through study and practice."
          />

          {/* Category filter */}
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-teal-600 dark:bg-teal-500 text-white shadow-md shadow-teal-500/25"
                    : "bg-white dark:bg-ink-800 text-ink-600 dark:text-ink-400 hover:bg-ink-200 dark:hover:bg-ink-700 border border-ink-200 dark:border-ink-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Skill cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((skill, i) => (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-white dark:bg-ink-900 rounded-2xl p-5 border border-ink-100 dark:border-ink-800 hover:border-teal-400/50 dark:hover:border-teal-500/40 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-ink-800 dark:text-ink-200 text-sm">
                    {skill.name}
                  </span>
                  <span className="text-xs text-teal-600 dark:text-teal-400 font-mono font-semibold">
                    {skill.level}%
                  </span>
                </div>

                <div className="h-1.5 bg-ink-100 dark:bg-ink-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${skill.level}%` } : {}}
                    transition={{ duration: 0.9, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400 dark:from-teal-400 dark:to-teal-300 group-hover:from-teal-400 group-hover:to-accent-400 transition-all duration-300"
                  />
                </div>

                <span className="mt-2 inline-block text-xs text-ink-400 dark:text-ink-600">
                  {skill.category}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Certifications / extra badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="mt-12 flex flex-wrap justify-center gap-3"
          >
            {[
              "IFRS Standards",
              "Bangladesh Accounting Standards",
              "Corporate Finance",
              "Business Law",
              "Financial Modeling",
              "Spreadsheet Accounting",
              "VAT & Tax",
              "Payroll Management",
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium bg-ink-200/60 dark:bg-ink-800/60 text-ink-600 dark:text-ink-400 border border-ink-200 dark:border-ink-700"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
