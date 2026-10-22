import { FiAward, FiBookOpen, FiCompass, FiTarget, FiShield } from "react-icons/fi";

interface AcademicMilestoneItem {
  id: string;
  institution: string;
  campus: string;
  degree: string;
  major: string;
  status: string;
  period: string;
  overview: string;
  disciplines: string[];
  connectedStudies: Array<{ id: number; title: string; discipline: string }>;
  sortOrder: number;
}

interface PublicAcademicJourneyProps {
  milestones: AcademicMilestoneItem[];
  accaTrajectory: {
    qualification: string;
    credentialBody: string;
    trajectoryType: string;
    statusLabel: string;
    integrityNotice: string;
    strategicFocus: string[];
  };
}

export function PublicAcademicJourney({
  milestones,
  accaTrajectory,
}: PublicAcademicJourneyProps) {
  return (
    <section
      id="academic-journey"
      className="py-20 sm:py-24 bg-ink-50/50 dark:bg-ink-950/50 border-t border-ink-200/60 dark:border-ink-800/60"
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block">
            Academic Progression
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 dark:text-ink-50 tracking-tight">
            Academic Journey & Professional Development
          </h2>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-300 leading-relaxed">
            Undergraduate accounting education at Daffodil International University, foundational business studies, and future professional qualification trajectory.
          </p>
        </div>

        {/* Timeline Spine */}
        <div className="relative mb-16">
          <div
            className="absolute left-4 sm:left-7 top-4 bottom-4 w-px bg-ink-200 dark:bg-ink-800"
            aria-hidden="true"
          />

          <div className="space-y-10 sm:space-y-12">
            {milestones.map((milestone, idx) => {
              const isCurrent = idx === 0;

              return (
                <div key={milestone.id} className="relative pl-11 sm:pl-16">
                  {/* Timeline Node Icon */}
                  <div
                    className={`absolute left-0 sm:left-3 top-1.5 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shadow-sm ${
                      isCurrent
                        ? "bg-emerald-600 text-white ring-4 ring-emerald-500/20"
                        : "bg-ink-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 ring-4 ring-ink-100 dark:ring-ink-900"
                    }`}
                    aria-hidden="true"
                  >
                    {isCurrent ? <FiAward size={15} /> : <FiBookOpen size={14} />}
                  </div>

                  {/* Milestone Card */}
                  <article className="bg-white dark:bg-ink-900 rounded-2xl p-5 sm:p-7 border border-ink-200 dark:border-ink-800 shadow-sm hover:border-emerald-500/30 transition-all">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ${
                              isCurrent
                                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
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

                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                          {milestone.institution}{" "}
                          <span className="text-xs font-normal text-ink-600 dark:text-ink-400 font-mono">
                            ({milestone.campus})
                          </span>
                        </p>
                      </div>

                      <span className="text-xs font-mono px-2.5 py-1 rounded bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300">
                        Major: {milestone.major}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-300 leading-relaxed mb-4">
                      {milestone.overview}
                    </p>

                    {/* Disciplines Pills */}
                    {milestone.disciplines && milestone.disciplines.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-ink-100 dark:border-ink-800/80">
                        {milestone.disciplines.map((item) => (
                          <span
                            key={item}
                            className="text-[11px] font-mono px-2 py-0.5 rounded bg-ink-50 dark:bg-ink-950 text-ink-600 dark:text-ink-400 border border-ink-200 dark:border-ink-800"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACCA Future Trajectory Card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-ink-900 border-2 border-emerald-500/20 shadow-clay-card dark:shadow-clay-card-dark space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <FiCompass size={20} aria-hidden="true" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold block">
                  {accaTrajectory.trajectoryType}
                </span>
                <h3 className="font-display font-bold text-xl text-ink-900 dark:text-ink-50">
                  {accaTrajectory.qualification}
                </h3>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              {accaTrajectory.statusLabel}
            </span>
          </div>

          <div className="text-xs font-mono text-ink-600 dark:text-ink-400">
            Credential Body: <strong>{accaTrajectory.credentialBody}</strong>
          </div>

          {/* Strategic Focus Papers */}
          <div>
            <span className="text-xs font-mono font-semibold uppercase text-ink-600 dark:text-ink-400 block mb-2">
              Strategic Exam & Applied Learning Focus:
            </span>
            <div className="grid sm:grid-cols-2 gap-2 text-xs">
              {accaTrajectory.strategicFocus?.map((paper) => (
                <div
                  key={paper}
                  className="p-2.5 rounded-xl bg-ink-50 dark:bg-ink-950/70 border border-ink-200 dark:border-ink-800 text-ink-700 dark:text-ink-300 flex items-center gap-2 font-mono text-[11px]"
                >
                  <FiTarget size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{paper}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Integrity Guardrail Notice */}
          <div className="p-3.5 rounded-xl bg-ink-50 dark:bg-ink-950/90 border border-ink-200 dark:border-ink-800/80 flex items-start gap-2.5 text-xs text-ink-600 dark:text-ink-400">
            <FiShield size={14} className="text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px] font-mono">
              <strong>Academic Integrity Policy:</strong> {accaTrajectory.integrityNotice}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
