import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { personal, about } from "../data/portfolioData";

function SectionHeading({ label, title, subtitle }) {
  return (
    <div className="mb-12 text-center">
      <span className="text-sm font-mono font-medium text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-3 block">
        {label}
      </span>
      <h2 className="font-display text-4xl sm:text-5xl font-bold text-ink-900 dark:text-ink-50 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-ink-500 dark:text-ink-400 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export { SectionHeading };

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <SectionHeading
            label="About me"
            title="Who I Am"
            subtitle="An accounting student who loves numbers, financial thinking, and continuous learning."
          />

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left: text */}
            <div>
              <p className="text-ink-600 dark:text-ink-400 text-lg leading-relaxed mb-6">
                {about.summary}
              </p>
              <p className="text-ink-600 dark:text-ink-400 leading-relaxed mb-8">
                I'm actively working on building a strong academic foundation while developing
                practical skills in accounting software, financial analysis, and business
                communication. My goal is to become a Certified Public Accountant (CPA) and
                contribute to transparent, responsible financial management in business.
              </p>

              {/* Info list */}
              <div className="space-y-3">
                {[
                  { label: "Name", value: personal.name },
                  { label: "University", value: "Daffodil International University" },
                  { label: "Department", value: "Accounting (BBA)" },
                  { label: "Location", value: personal.location },
                  { label: "Email", value: personal.email },
                  { label: "Status", value: "Currently Studying" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-3">
                    <span className="text-sm font-medium text-ink-400 dark:text-ink-500 w-28 shrink-0">
                      {label}
                    </span>
                    <span className="text-sm text-ink-700 dark:text-ink-300">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: stat cards */}
            <div className="grid grid-cols-2 gap-4">
              {about.highlights.map(({ label, value }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="group relative bg-white dark:bg-ink-900 rounded-2xl p-6 border border-ink-100 dark:border-ink-800 hover:border-teal-400/50 dark:hover:border-teal-500/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-teal-400/5 dark:bg-teal-500/5 rounded-full translate-x-6 -translate-y-6 group-hover:scale-150 transition-transform duration-500" />
                  <div className="font-display text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                    {value}
                  </div>
                  <div className="text-xs text-ink-500 dark:text-ink-400">{label}</div>
                </motion.div>
              ))}

              {/* Extra card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="col-span-2 bg-gradient-to-br from-teal-500 to-teal-700 dark:from-teal-600 dark:to-teal-800 rounded-2xl p-6 text-white"
              >
                <p className="text-sm opacity-80 mb-1">Studying at</p>
                <p className="font-display text-xl font-semibold">Daffodil International University</p>
                <p className="text-sm opacity-70 mt-1">Department of Accounting — BBA Program</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
