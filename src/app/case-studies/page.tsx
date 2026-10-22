import { draftMode } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { getPublicSiteSettings, getPublicCaseStudies } from "@/lib/public-data";
import { PublicNav } from "@/components/public/public-nav";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicCaseStudies } from "@/components/public/public-case-studies";
import { DraftPreviewBanner } from "@/components/public/draft-preview-banner";
import { FiChevronRight, FiHome } from "react-icons/fi";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Academic Financial Case Studies — Md Ibna Siam",
  description:
    "Empirical case studies in financial reporting, corporate ratio analysis, Bangladesh Income Tax Act 2023 calculations, CVP cost accounting, and master budgeting.",
};

export default async function CaseStudiesCollectionPage() {
  const { isEnabled } = await draftMode();

  const [settings, caseStudies] = await Promise.all([
    getPublicSiteSettings(),
    getPublicCaseStudies({ isDraftMode: isEnabled }),
  ]);

  if (!settings) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-ink-100 transition-colors duration-300">
      {isEnabled && <DraftPreviewBanner currentPath="/case-studies" />}

      <PublicNav />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-mono text-ink-600 dark:text-ink-300 mb-8"
          >
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <FiHome size={13} />
              <span>Home</span>
            </Link>
            <FiChevronRight size={12} className="text-ink-400 dark:text-ink-500" />
            <span className="text-ink-900 dark:text-ink-100 font-semibold">
              Case Studies
            </span>
          </nav>

          {/* Collection Header */}
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block">
              Accounting & Macroeconomic Dossier
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 dark:text-ink-50 tracking-tight">
              Academic Case Studies & Research
            </h1>
            <p className="text-sm sm:text-base text-ink-600 dark:text-ink-300 leading-relaxed">
              Eight comprehensive academic studies covering Dhaka Stock Exchange (DSE) ratio analysis, Bangladesh Income Tax Act 2023 individual assessments, garment factory CVP models, SME master budgeting, retail internal control audits, and macroeconomic impact evaluations.
            </p>
          </div>
        </div>

        {/* Reusable PublicCaseStudies Grid with Filtering */}
        <PublicCaseStudies caseStudies={caseStudies} />
      </main>

      <PublicFooter
        email={settings.publicEmail}
        linkedinUrl={settings.socialLinks?.linkedin}
        githubUrl={settings.socialLinks?.github}
      />
    </div>
  );
}
