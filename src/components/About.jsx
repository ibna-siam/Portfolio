import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { personal } from "../data/portfolioData";
import { SectionHeading } from "./SectionHeading";

const PROFILE_HIGHLIGHTS = [
  {
    title: "BBA in Accounting",
    subtitle: "Degree Candidate",
    description: "Daffodil International University, Department of Accounting.",
    tag: "Academic Foundation",
  },
  {
    title: "5 Case Studies + 3 Papers",
    subtitle: "Research Portfolio",
    description: "Empirical studies covering DSE equities, taxation schedules, and CVP models.",
    tag: "Applied Analysis",
  },
  {
    title: "Reporting, Costing & Tax",
    subtitle: "Core Disciplines",
    description: "Structured compliance with IFRS/BAS frameworks and Income Tax Act 2023.",
    tag: "Technical Focus",
  },
  {
    title: "Target Qualification: ACCA",
    subtitle: "Career Trajectory",
    description: "Pursuing professional accounting standards, audit rigor, and financial governance.",
    tag: "Professional Target",
  },
];

const PROFILE_DETAILS = [
  { label: "Full Name", value: personal.name },
  { label: "University", value: "Daffodil International University" },
  { label: "Department", value: "Department of Accounting (BBA)" },
  { label: "Location", value: personal.location },
  { label: "Email", value: personal.email, isEmail: true },
  { label: "Career Target", value: "ACCA Qualification (Trajectory)" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-20 sm:py-24 relative overflow-hidden bg-ink-100/40 dark:bg-ink-950/40 border-t border-ink-200/60 dark:border-ink-800/60">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            label="Background & Focus"
            title="Professional Profile"
            subtitle="An accounting undergraduate developing practical analytical capabilities across financial reporting, managerial costing, taxation compliance, and business decision support."
          />

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Narrative Summary & Key Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="text-ink-600 dark:text-ink-300 leading-relaxed space-y-4">
                <p className="text-base sm:text-lg text-ink-800 dark:text-ink-100 font-medium leading-relaxed">
                  I am an undergraduate accounting student at Daffodil International University, focused on mastering corporate financial reporting, cost accounting, and tax compliance.
                </p>
                <p className="text-sm sm:text-base leading-relaxed">
                  My academic coursework and case studies emphasize practical accounting frameworks—including International Financial Reporting Standards (IFRS), Bangladesh Accounting Standards (BAS), and the Bangladesh Income Tax Act 2023. Through structured financial modeling, I examine audited statements, evaluate cost-volume-profit relationships, and build operational master budgets.
                </p>
                <p className="text-sm sm:text-base leading-relaxed">
                  I view technology and automation as essential multipliers for accounting precision. By integrating spreadsheet automation, financial software, and structured dashboard workflows, I focus on turning complex transactions into reliable, reproducible managerial intelligence.
                </p>
              </div>

              {/* Factual Academic Identity Details */}
              <div className="pt-4 border-t border-ink-200 dark:border-ink-800/80">
                <h3 className="text-xs font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400 mb-3 font-semibold">
                  Key Academic Attributes
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {PROFILE_DETAILS.map(({ label, value, isEmail }) => (
                    <div
                      key={label}
                      className="p-3 rounded-xl bg-white dark:bg-ink-900 border border-ink-200/70 dark:border-ink-800/70"
                    >
                      <span className="text-[11px] font-mono text-ink-400 dark:text-ink-500 uppercase block">
                        {label}
                      </span>
                      {isEmail ? (
                        <a
                          href={`mailto:${value}`}
                          className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline break-all"
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="text-xs sm:text-sm font-semibold text-ink-800 dark:text-ink-200">
                          {value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Factual Highlights Cards */}
            <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {PROFILE_HIGHLIGHTS.map(({ title, subtitle, description, tag }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="p-5 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200/80 dark:border-ink-800/80 shadow-xs hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      {tag}
                    </span>
                    <span className="text-xs text-ink-400 dark:text-ink-500 font-medium">
                      {subtitle}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-ink-900 dark:text-ink-100 mb-1">
                    {title}
                  </h4>
                  <p className="text-xs text-ink-600 dark:text-ink-400 leading-relaxed">
                    {description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
