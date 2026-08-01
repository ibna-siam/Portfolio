import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiBookOpen, FiAward } from "react-icons/fi";
import { experience } from "../data/portfolioData";
import { SectionHeading } from "./About";

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" className="py-24 bg-ink-100/50 dark:bg-ink-900/50">
      <div ref={ref} className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <SectionHeading
            label="My journey"
            title="Education"
            subtitle="The academic path that shaped my understanding of accounting and finance."
          />

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-ink-200 dark:bg-ink-700 hidden sm:block" />

            <div className="space-y-8">
              {experience.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.14 }}
                  className="relative sm:pl-16 group"
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-0 top-5 w-10 h-10 rounded-full border-2 items-center justify-center z-10 transition-all duration-300 hidden sm:flex ${
                      i === 0
                        ? "bg-teal-500 border-teal-400 text-white group-hover:scale-110"
                        : "bg-accent-500 border-accent-400 text-white group-hover:scale-110"
                    }`}
                  >
                    {i === 0 ? <FiAward size={16} /> : <FiBookOpen size={16} />}
                  </div>

                  {/* Card */}
                  <div className="bg-white dark:bg-ink-900 rounded-2xl p-6 border border-ink-100 dark:border-ink-800 hover:border-teal-400/50 dark:hover:border-teal-500/40 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-display font-semibold text-lg text-ink-900 dark:text-ink-100">
                          {item.title}
                        </h3>
                        <p className="text-teal-600 dark:text-teal-400 font-medium text-sm">
                          {item.organization}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono text-ink-500 dark:text-ink-400 bg-ink-100 dark:bg-ink-800 px-3 py-1 rounded-full">
                          {item.period}
                        </span>
                        <p className="text-xs text-ink-400 dark:text-ink-600 mt-1">
                          {item.location}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {item.skills.map((skill) => (
                        <span
                          key={skill}
                          className={`px-2.5 py-1 text-xs rounded-lg font-medium ${
                            i === 0
                              ? "bg-teal-500/10 text-teal-700 dark:text-teal-400"
                              : "bg-accent-500/10 text-accent-700 dark:text-accent-400"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
