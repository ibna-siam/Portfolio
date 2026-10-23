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
      className="py-20 sm:py-24 bg-ink-100/40 dark:bg-ink-950/40 border-t border-ink-200/60 dark:border-ink-800/60"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block">
            Background & Focus
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
          {/* Narrative Summary */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-ink-600 dark:text-ink-300 leading-relaxed space-y-4 text-sm sm:text-base">
              <p className="text-base sm:text-lg text-ink-800 dark:text-ink-100 font-medium leading-relaxed">
                I am an undergraduate accounting student at Daffodil International
                University, focused on mastering corporate financial reporting, cost
                accounting, and tax compliance.
              </p>
              <p className="leading-relaxed">
                My academic coursework and case studies emphasize practical accounting
                frameworks—including International Financial Reporting Standards (IFRS),
                Bangladesh Accounting Standards (BAS), and the Bangladesh Income Tax Act
                2023. Through structured financial modeling, I examine audited statements,
                evaluate cost-volume-profit relationships, and build operational master
                budgets.
              </p>
              <p className="leading-relaxed">
                I view technology and automation as essential multipliers for accounting
                precision. By integrating spreadsheet automation, financial software, and
                structured dashboard workflows, I focus on turning complex transactions
                into reliable, reproducible managerial intelligence.
              </p>
            </div>

            {/* Factual Academic Identity Details */}
            <div className="pt-4 border-t border-ink-200 dark:border-ink-800/80">
              <h3 className="text-xs font-mono uppercase tracking-widest text-ink-600 dark:text-ink-400 mb-3 font-semibold">
                Key Academic Attributes
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {profileDetails.map(({ label, value, isEmail }) => (
                  <div
                    key={label}
                    className="p-3.5 rounded-xl bg-white dark:bg-ink-900 border border-ink-200/70 dark:border-ink-800/70 shadow-xs"
                  >
                    <span className="text-[11px] font-mono text-ink-600 dark:text-ink-300 uppercase block font-medium">
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

          {/* Highlights 4-Card Grid */}
          <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {settings.aboutHighlights?.map((item) => (
              <div
                key={item.label}
                className="p-5 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200/80 dark:border-ink-800/80 shadow-clay-card dark:shadow-clay-card-dark space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">
                    Academic Highlight
                  </span>
                  <span className="text-ink-600 dark:text-ink-300 font-medium">
                    Verified
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-ink-900 dark:text-ink-50">
                  {item.label}
                </h4>
                <p className="text-xs text-ink-600 dark:text-ink-300 leading-relaxed">
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
