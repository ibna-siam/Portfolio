import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { FiExternalLink, FiFileText } from "react-icons/fi";
import { projects } from "../data/portfolioData";
import { SectionHeading } from "./About";

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? projects : projects.slice(0, 4);

  return (
    <section id="projects" className="py-24">
      <div ref={ref} className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <SectionHeading
            label="Academic work"
            title="Projects & Case Studies"
            subtitle="Academic projects, case studies, and assignments that reflect my accounting knowledge in practice."
          />

          <div className="grid sm:grid-cols-2 gap-6">
            <AnimatePresence>
              {displayed.map((project, i) => (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group bg-white dark:bg-ink-900 rounded-2xl overflow-hidden border border-ink-100 dark:border-ink-800 hover:border-teal-400/40 dark:hover:border-teal-500/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Hover action buttons */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <a
                        href={project.demo}
                        className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-ink-900 rounded-xl text-xs font-semibold shadow-md transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiExternalLink size={14} /> View Project
                      </a>
                      <a
                        href={project.repo}
                        className="flex items-center gap-2 px-4 py-2 bg-ink-900/90 hover:bg-ink-900 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiFileText size={14} /> Report
                      </a>
                    </div>

                    {project.featured && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-teal-500 text-white text-xs font-medium rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-lg text-ink-900 dark:text-ink-100 mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed mb-4">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 text-xs rounded-lg font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {projects.length > 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="text-center mt-10"
            >
              <button
                onClick={() => setShowAll((v) => !v)}
                className="px-8 py-3 rounded-xl border-2 border-teal-500/40 dark:border-teal-400/30 text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 dark:hover:bg-teal-400/10 font-medium text-sm transition-all duration-200"
              >
                {showAll ? "Show Less" : `View All ${projects.length} Projects`}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
