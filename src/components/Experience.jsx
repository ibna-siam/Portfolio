import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FiBookOpen,
  FiAward,
  FiTarget,
  FiCheckCircle,
  FiArrowRight,
  FiCompass,
} from "react-icons/fi";
import {
  ACADEMIC_MILESTONES,
  PROFESSIONAL_TRAJECTORY,
} from "../data/academicJourneyData";
import { SectionHeading } from "./SectionHeading";

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const handleScrollToCaseStudies = (e) => {
    e.preventDefault();
    const target = document.querySelector("#projects");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="experience" className="py-24 bg-ink-50/50 dark:bg-ink-950/50">
      <div ref={ref} className="max-w-5xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Canonical Section Heading */}
          <SectionHeading
            label="Academic Progression"
            title="Academic Journey & Professional Development"
            subtitle="Undergraduate accounting education at Daffodil International University, foundational business studies, and future professional qualification trajectory."
          />

          {/* Academic Journey Timeline */}
          <div className="relative mt-12 mb-16">
            {/* Vertical timeline spine */}
            <div
              className="absolute left-4 sm:left-7 top-4 bottom-4 w-px bg-ink-200 dark:bg-ink-800"
              aria-hidden="true"
            />

            <div className="space-y-10 sm:space-y-12">
              {ACADEMIC_MILESTONES.map((milestone, idx) => {
                const isCurrent = idx === 0;

                return (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: idx * 0.12 }}
                    className="relative pl-11 sm:pl-16 group"
                  >
                    {/* Timeline Node Icon */}
                    <div
                      className={`absolute left-0 sm:left-3 top-1.5 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                        isCurrent
                          ? "bg-teal-600 text-white ring-4 ring-teal-500/20"
                          : "bg-ink-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 ring-4 ring-ink-100 dark:ring-ink-900"
                      }`}
                      aria-hidden="true"
                    >
                      {isCurrent ? <FiAward size={15} /> : <FiBookOpen size={14} />}
                    </div>

                    {/* Milestone Card */}
                    <article className="bg-white dark:bg-ink-900 rounded-2xl p-5 sm:p-7 border border-ink-200 dark:border-ink-800 hover:border-teal-400/40 dark:hover:border-teal-500/30 shadow-sm hover:shadow-md transition-all">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ${
                                isCurrent
                                  ? "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                                  : "bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 border border-ink-200 dark:border-ink-700"
                              }`}
                            >
                              {milestone.status}
                            </span>
                            <span className="text-xs font-mono text-ink-500 dark:text-ink-400">
                              {milestone.period}
                            </span>
                          </div>

                          <h3 className="font-display font-bold text-lg sm:text-xl text-ink-900 dark:text-ink-50 leading-snug">
                            {milestone.degree}
                          </h3>

                          <p className="text-sm font-semibold text-teal-700 dark:text-teal-400">
                            {milestone.institution}{" "}
                            <span className="text-xs font-normal text-ink-400 dark:text-ink-500">
                              · {milestone.campus}
                            </span>
                          </p>
                        </div>

                        <span className="text-xs font-mono px-3 py-1 rounded-lg bg-ink-50 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border border-ink-100 dark:border-ink-700">
                          {milestone.major}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-300 leading-relaxed mb-5">
                        {milestone.overview}
                      </p>

                      {/* Coursework & Disciplines */}
                      <div className="space-y-2 mb-5">
                        <span className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-wider block">
                          Academic Disciplines & Core Subjects
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {milestone.disciplines.map((subject) => (
                            <span
                              key={subject}
                              className="px-2.5 py-1 text-xs rounded-lg font-medium bg-ink-100/70 dark:bg-ink-800/60 text-ink-700 dark:text-ink-300 border border-ink-200/60 dark:border-ink-700/60"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Connected Applied Studies (for BBA program) */}
                      {milestone.connectedStudies.length > 0 && (
                        <div className="pt-4 border-t border-ink-100 dark:border-ink-800">
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <span className="text-xs font-bold text-ink-500 dark:text-ink-400 uppercase tracking-wider">
                              Applied Coursework Case Studies
                            </span>
                            <a
                              href="#projects"
                              onClick={handleScrollToCaseStudies}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                            >
                              View in Showcase <FiArrowRight size={12} />
                            </a>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-2">
                            {milestone.connectedStudies.map((study) => (
                              <a
                                key={study.id}
                                href="#projects"
                                onClick={handleScrollToCaseStudies}
                                className="p-2.5 rounded-xl bg-ink-50 dark:bg-ink-800/40 border border-ink-100 dark:border-ink-800 hover:border-teal-400/30 transition-colors flex items-center justify-between text-xs group/item cursor-pointer"
                              >
                                <span className="font-medium text-ink-800 dark:text-ink-200 truncate pr-2">
                                  {study.title}
                                </span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 shrink-0">
                                  {study.discipline}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </article>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Future Professional Qualification Roadmap (ACCA) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border-2 border-dashed border-teal-500/30 dark:border-teal-400/25 shadow-sm space-y-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                  <FiTarget size={20} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                      {PROFESSIONAL_TRAJECTORY.trajectoryType}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                      {PROFESSIONAL_TRAJECTORY.statusLabel}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-ink-900 dark:text-ink-50 mt-0.5">
                    {PROFESSIONAL_TRAJECTORY.qualification}
                  </h3>
                </div>
              </div>

              <span className="text-xs font-mono text-ink-500 dark:text-ink-400 px-3 py-1.5 rounded-lg bg-ink-50 dark:bg-ink-800 border border-ink-100 dark:border-ink-800">
                {PROFESSIONAL_TRAJECTORY.credentialBody}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-ink-50 dark:bg-ink-800/40 border border-ink-100 dark:border-ink-800 text-xs text-ink-600 dark:text-ink-300 leading-relaxed flex items-start gap-2.5">
              <FiCompass className="text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" size={15} />
              <div>
                <strong className="text-ink-800 dark:text-ink-100 font-semibold block mb-0.5">
                  Professional Qualification Trajectory Notice
                </strong>
                <p>{PROFESSIONAL_TRAJECTORY.integrityNotice}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-wider block">
                Target Competency Domains in Professional Studies
              </span>
              <div className="grid sm:grid-cols-2 gap-2">
                {PROFESSIONAL_TRAJECTORY.strategicFocus.map((domain, dIdx) => (
                  <div
                    key={dIdx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-xs font-medium text-ink-700 dark:text-ink-200"
                  >
                    <FiCheckCircle className="text-teal-600 dark:text-teal-400 shrink-0" size={13} />
                    <span>{domain}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Academic Grounding Footer */}
          <div className="mt-12 text-center text-xs text-ink-400 dark:text-ink-500">
            <p>
              Academic milestones verified against institutional records at Daffodil International University.
              Future professional qualification direction presented as target career trajectory.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
