import { PublicSiteSettings } from "@/lib/public-data";

interface PublicAboutProps {
  settings: PublicSiteSettings;
}

export function PublicAbout({ settings }: PublicAboutProps) {
  const profileDetails = [
    { label: "Full Name", value: settings.ownerName || "Md Ibna Siam" },
    { label: "University", value: "Daffodil International University" },
    { label: "Department", value: "Department of Accounting (BBA)" },
    { label: "Location", value: settings.location || "Dhaka, Bangladesh" },
    { label: "Public Email", value: settings.publicEmail, isEmail: true },
    { label: "Career Target", value: "ACCA Qualification (Trajectory)" },
  ];

  return (
    <section
      id="about"
      className="py-20 sm:py-24 bg-slate-50/80 dark:bg-ink-900/40 border-t border-ink-200/80 dark:border-ink-800/80"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 dark:text-emerald-300 font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block">
            Background & Academic Scope
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 dark:text-ink-50 tracking-tight">
            Professional Profile
          </h2>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-300 leading-relaxed">
            An accounting undergraduate developing practical analytical capabilities
            across financial reporting, managerial costing, taxation compliance, and
            business decision support.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Narrative Summary (Concise, Recruiter-Focused ~45 words) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-sm space-y-3.5">
              <p className="text-base sm:text-lg text-ink-900 dark:text-ink-50 font-medium leading-relaxed">
                Undergraduate accounting candidate at Daffodil International University
                specializing in corporate financial reporting, managerial costing, and
                Bangladesh Income Tax Act 2023 compliance. Combining IFRS/BAS frameworks
                with structured spreadsheet modeling and analytical tools to deliver
                transparent, audit-ready financial insights.
              </p>
              <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-300 leading-relaxed pt-2 border-t border-ink-100 dark:border-ink-800/80">
                Integrating spreadsheet automation, financial software, and structured
                dashboard workflows to convert complex transactions into reliable decision
                intelligence.
              </p>
            </div>

            {/* Factual Academic Identity Details */}
            <div className="pt-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-ink-700 dark:text-ink-300 mb-3 font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                Key Academic Attributes
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {profileDetails.map(({ label, value, isEmail }) => (
                  <div
                    key={label}
                    className="p-3.5 rounded-xl bg-white dark:bg-ink-900 border border-ink-200/80 dark:border-ink-800 shadow-xs hover:border-emerald-500/30 transition-colors"
                  >
                    <span className="text-[11px] font-mono text-ink-600 dark:text-ink-400 uppercase block font-semibold">
                      {label}
                    </span>
                    {isEmail ? (
                      <a
                        href={`mailto:${value}`}
                        className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline break-all"
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

          {/* Highlights 4-Card Grid (Refined surfaces, no redundant pills) */}
          <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            {settings.aboutHighlights?.map((item) => (
              <div
                key={item.label}
                className="p-5 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <h4 className="font-display font-bold text-base text-ink-900 dark:text-ink-50">
                    {item.label}
                  </h4>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                    Verified
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-300 leading-relaxed font-normal">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
