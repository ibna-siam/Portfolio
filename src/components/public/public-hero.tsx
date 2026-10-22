import Link from "next/link";
import Image from "next/image";
import {
  FiDownload,
  FiArrowRight,
  FiLinkedin,
  FiGithub,
  FiMail,
} from "react-icons/fi";
import { PublicSiteSettings } from "@/lib/public-data";

interface PublicHeroProps {
  settings: PublicSiteSettings;
}

const DOMAIN_TOPICS = [
  {
    topic: "DSE Ratio Analysis",
    description: "Financial Performance & Liquidity",
  },
  {
    topic: "NBR Tax Act 2023",
    description: "Individual Assessment & Rebates",
  },
  {
    topic: "Master Budgeting",
    description: "Operating Plans & Variance Modeling",
  },
  {
    topic: "Cost Accounting",
    description: "CVP & Contribution Analysis",
  },
  {
    topic: "Internal Audit",
    description: "Control Systems & Loss Mitigation",
  },
];

export function PublicHero({ settings }: PublicHeroProps) {
  // Use Cloudinary avatar or local fallback (normalizing legacy /src/assets paths to /assets)
  const rawAvatar = settings.avatarUrl?.trim() || "";
  const portraitUrl =
    rawAvatar.startsWith("http://") || rawAvatar.startsWith("https://")
      ? rawAvatar
      : rawAvatar.startsWith("/src/assets/")
      ? rawAvatar.replace("/src/assets/", "/assets/")
      : rawAvatar || "/assets/siam.jpeg";

  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex flex-col justify-center pt-10 sm:pt-14 pb-16 overflow-hidden"
    >
      {/* Restrained subtle background gradient */}
      <div className="absolute inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-1/4 -right-24 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-24 w-96 h-96 rounded-full bg-slate-500/5 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Main Editorial Text Content */}
          <div className="lg:col-span-7">
            {/* Identity Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-mono font-medium border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                BBA Accounting Candidate · Daffodil International University
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-900 dark:text-ink-50 tracking-tight leading-[1.15] mb-5">
              {settings.headline || "Accounting & Finance Professional in Development"}
            </h1>

            {/* Subheadline & Bio */}
            <p className="text-base sm:text-lg text-ink-600 dark:text-ink-300 leading-relaxed mb-8 max-w-xl">
              {settings.bio ||
                "Specializing in financial reporting, managerial cost accounting, taxation compliance, and analytical modeling. Combining core accounting principles with financial software and structured problem-solving to deliver transparent business insight."}
            </p>

            {/* Strategic CTAs */}
            <div className="flex flex-wrap gap-3.5 mb-8">
              {settings.resumeUrl && (
                <a
                  href={settings.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-md shadow-emerald-700/20 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
                  aria-label="View Verified CV (opens in new tab)"
                >
                  <FiDownload size={16} aria-hidden="true" />
                  <span>View Verified CV</span>
                </a>
              )}

              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-ink-900 hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-800 dark:text-ink-100 rounded-xl font-medium text-sm transition-all duration-200 border border-ink-200 dark:border-ink-800 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 shadow-xs"
              >
                <span>Inspect Case Studies</span>
                <FiArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            {/* Social Channels */}
            <div className="flex items-center gap-4 text-ink-600 dark:text-ink-300 text-sm">
              <span className="text-xs font-mono uppercase tracking-wider text-ink-600 dark:text-ink-300 font-semibold">
                Direct Channels:
              </span>
              {settings.socialLinks?.linkedin && (
                <a
                  href={settings.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <FiLinkedin size={18} />
                </a>
              )}
              {settings.socialLinks?.github && (
                <a
                  href={settings.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  aria-label="GitHub Profile"
                >
                  <FiGithub size={18} />
                </a>
              )}
              <a
                href={`mailto:${settings.publicEmail}`}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                aria-label={`Email ${settings.publicEmail}`}
              >
                <FiMail size={18} />
              </a>
            </div>
          </div>

          {/* Profile Portrait Card (Executive Claymorphism Framing) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-3xl p-3 sm:p-4 bg-white dark:bg-ink-900 border border-ink-200/80 dark:border-ink-800/80 shadow-clay-card dark:shadow-clay-card-dark">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-ink-100 dark:bg-ink-950">
                <Image
                  src={portraitUrl}
                  alt="Md Ibna Siam — Accounting and Finance Professional"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover object-top filter contrast-[1.02]"
                />
              </div>

              {/* Bottom Card Identity Footer */}
              <div className="pt-3.5 px-2 pb-1 flex items-center justify-between text-xs">
                <div>
                  <span className="font-display font-bold text-ink-900 dark:text-ink-100 block">
                    {settings.ownerName || "Md Ibna Siam"}
                  </span>
                  <span className="text-[11px] font-mono text-ink-600 dark:text-ink-400">
                    DIU Accounting Candidate
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  ACCA Pathway
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Five Accounting Domain Topics Ribbon */}
        <div className="mt-16 pt-8 border-t border-ink-200/70 dark:border-ink-800/70">
          <p className="text-xs font-mono uppercase tracking-widest text-ink-600 dark:text-ink-300 mb-4 font-semibold">
            Core Analytical & Applied Domains
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {DOMAIN_TOPICS.map(({ topic, description }) => (
              <div
                key={topic}
                className="p-3.5 rounded-xl bg-white dark:bg-ink-900/60 border border-ink-200/80 dark:border-ink-800/80 shadow-xs hover:border-emerald-500/30 transition-colors"
              >
                <span className="text-xs font-bold text-ink-900 dark:text-ink-100 block font-display">
                  {topic}
                </span>
                <span className="text-[11px] text-ink-600 dark:text-ink-400 leading-tight block mt-0.5">
                  {description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
