import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getPublicSiteSettings, getCaseStudyBySlug } from "@/lib/public-data";
import { getArticleStructuredData } from "@/lib/seo-config";
import { PublicNav } from "@/components/public/public-nav";
import { PublicFooter } from "@/components/public/public-footer";
import { FinancialScheduleTable } from "@/components/public/financial-schedule-table";
import { DiscrepancyNotice } from "@/components/public/discrepancy-notice";
import { DraftPreviewBanner } from "@/components/public/draft-preview-banner";
import {
  FiChevronRight,
  FiHome,
  FiTarget,
  FiBookOpen,
  FiBarChart2,
  FiShield,
  FiDatabase,
  FiCheckCircle,
  FiArrowLeft,
} from "react-icons/fi";

interface CaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const study = await getCaseStudyBySlug(slug, { isDraftMode: isEnabled });

  if (!study) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: `${study.title} — Case Study`,
    description: study.description.slice(0, 160),
    alternates: {
      canonical: `/case-studies/${study.slug}`,
    },
    openGraph: {
      title: `${study.title} — Case Study | Md Ibna Siam`,
      description: study.description.slice(0, 160),
      url: `/case-studies/${study.slug}`,
      type: "article",
      publishedTime: study.updatedAt
        ? new Date(study.updatedAt).toISOString()
        : undefined,
      modifiedTime: study.updatedAt ? new Date(study.updatedAt).toISOString() : undefined,
      authors: ["Md Ibna Siam"],
      section: study.category,
    },
    twitter: {
      card: "summary_large_image",
      title: `${study.title} — Case Study | Md Ibna Siam`,
      description: study.description.slice(0, 160),
    },
  };
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();

  const [settings, study] = await Promise.all([
    getPublicSiteSettings(),
    getCaseStudyBySlug(slug, { isDraftMode: isEnabled }),
  ]);

  if (!study || !settings) {
    notFound();
  }

  const articleJsonLd = getArticleStructuredData(study);

  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-ink-100 transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {isEnabled && <DraftPreviewBanner currentPath={`/case-studies/${study.slug}`} />}

      <PublicNav />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-10">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-mono text-ink-600 dark:text-ink-300"
          >
            <Link
              href="/"
              prefetch={true}
              className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <FiHome size={13} aria-hidden="true" />
              <span>Home</span>
            </Link>
            <FiChevronRight
              size={12}
              className="text-ink-400 dark:text-ink-500"
              aria-hidden="true"
            />
            <Link
              href="/case-studies"
              prefetch={true}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Case Studies
            </Link>
            <FiChevronRight
              size={12}
              className="text-ink-400 dark:text-ink-500"
              aria-hidden="true"
            />
            <span className="text-ink-900 dark:text-ink-100 font-semibold truncate max-w-xs">
              {study.title}
            </span>
          </nav>

          {/* Header Hero */}
          <header className="space-y-4 border-b border-ink-200 dark:border-ink-800 pb-8">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono font-semibold px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                {study.category}
              </span>
              <span className="font-mono text-ink-600 dark:text-ink-400 px-2.5 py-0.5 rounded-md bg-ink-100 dark:bg-ink-900 border border-ink-200 dark:border-ink-800">
                {study.group}
              </span>
              <span className="font-mono text-ink-600 dark:text-ink-400 px-2.5 py-0.5 rounded-md bg-ink-100 dark:bg-ink-900 border border-ink-200 dark:border-ink-800">
                Currency: {study.currencyUnit}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 dark:text-ink-50 tracking-tight leading-tight">
              {study.title}
            </h1>

            <p className="text-base sm:text-lg text-ink-700 dark:text-ink-300 leading-relaxed font-body">
              {study.description}
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-ink-900 border border-ink-200/80 dark:border-ink-800/80">
                <span className="font-mono uppercase text-[10px] text-ink-600 dark:text-ink-400 block font-semibold">
                  Academic Framework
                </span>
                <span className="text-ink-900 dark:text-ink-100 font-medium text-xs">
                  {study.framework}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-ink-900 border border-ink-200/80 dark:border-ink-800/80">
                <span className="font-mono uppercase text-[10px] text-ink-600 dark:text-ink-400 block font-semibold">
                  Calculation Basis & Inputs
                </span>
                <span className="text-ink-900 dark:text-ink-100 font-medium text-xs">
                  {study.calculationBasis}
                </span>
              </div>
            </div>
          </header>

          {/* Academic Financial Discrepancy Disclosure (if bound) */}
          {study.discrepancy && <DiscrepancyNotice discrepancy={study.discrepancy} />}

          {/* Section 1: Overview & Objectives */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-ink-900 dark:text-ink-50 font-display font-bold text-xl sm:text-2xl">
              <FiBookOpen className="text-emerald-600 dark:text-emerald-400" />
              <h2>Overview & Objectives</h2>
            </div>
            <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 leading-relaxed">
              {study.overview}
            </p>

            {study.objectives && study.objectives.length > 0 && (
              <div className="p-5 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-xs space-y-2">
                <h3 className="font-mono text-xs uppercase font-semibold text-ink-600 dark:text-ink-400 tracking-wider">
                  Core Analytical Objectives
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-ink-700 dark:text-ink-300">
                  {study.objectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <FiCheckCircle
                        size={14}
                        className="text-emerald-500 shrink-0 mt-0.5"
                      />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Section 2: Tabular Financial Schedules */}
          {study.schedules && study.schedules.length > 0 && (
            <section className="space-y-4 pt-4 border-t border-ink-200 dark:border-ink-800">
              <div className="flex items-center gap-2 text-ink-900 dark:text-ink-50 font-display font-bold text-xl sm:text-2xl">
                <FiDatabase className="text-emerald-600 dark:text-emerald-400" />
                <h2>Financial Schedules & Calculations</h2>
              </div>
              <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400">
                Empirical schedules prepared according to relevant accounting standards
                with tabular numeral alignment.
              </p>

              <div className="space-y-6">
                {study.schedules.map((schedule) => (
                  <FinancialScheduleTable
                    key={schedule.id}
                    schedule={schedule}
                    currencyUnit={study.currencyUnit}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Section 3: Methodology & Analytical Framework */}
          {study.methodology && study.methodology.length > 0 && (
            <section className="space-y-4 pt-4 border-t border-ink-200 dark:border-ink-800">
              <div className="flex items-center gap-2 text-ink-900 dark:text-ink-50 font-display font-bold text-xl sm:text-2xl">
                <FiTarget className="text-emerald-600 dark:text-emerald-400" />
                <h2>Methodology & Analytical Framework</h2>
              </div>

              <div className="space-y-3">
                {study.methodology.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200/80 dark:border-ink-800/80 space-y-1.5"
                  >
                    <h3 className="font-display font-bold text-sm sm:text-base text-ink-900 dark:text-ink-50">
                      {m.heading}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
                      {m.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Formulations */}
              {study.formulas && study.formulas.length > 0 && (
                <div className="p-5 rounded-2xl bg-ink-100/50 dark:bg-ink-900/60 border border-ink-200 dark:border-ink-800 space-y-3 mt-4">
                  <h3 className="font-mono text-xs uppercase font-semibold text-ink-600 dark:text-ink-300 tracking-wider">
                    Explicit Calculation Formulas Applied
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {study.formulas.map((f, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white dark:bg-ink-950 border border-ink-200/80 dark:border-ink-800/80 text-xs font-mono"
                      >
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase block font-semibold">
                          {f.name}
                        </span>
                        <span className="text-ink-900 dark:text-ink-100">
                          {f.formula}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Section 4: Key Findings & Defensible Recommendations */}
          <section className="space-y-4 pt-4 border-t border-ink-200 dark:border-ink-800">
            <div className="flex items-center gap-2 text-ink-900 dark:text-ink-50 font-display font-bold text-xl sm:text-2xl">
              <FiBarChart2 className="text-emerald-600 dark:text-emerald-400" />
              <h2>Key Findings & Defensible Recommendations</h2>
            </div>

            {study.keyFindings && study.keyFindings.length > 0 && (
              <div className="p-5 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-xs space-y-2">
                <h3 className="font-mono text-xs uppercase font-semibold text-ink-600 dark:text-ink-400 tracking-wider">
                  Observed Findings
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-ink-700 dark:text-ink-300">
                  {study.keyFindings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {study.recommendations && study.recommendations.length > 0 && (
              <div className="p-5 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-xs space-y-2">
                <h3 className="font-mono text-xs uppercase font-semibold text-ink-600 dark:text-ink-400 tracking-wider">
                  Recommendations & Management Takeaways
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-ink-700 dark:text-ink-300">
                  {study.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {study.conclusion && (
              <div className="p-5 rounded-2xl bg-ink-100/50 dark:bg-ink-900/60 border border-ink-200 dark:border-ink-800 text-xs sm:text-sm text-ink-700 dark:text-ink-300 leading-relaxed italic">
                <strong>Academic Conclusion:</strong> {study.conclusion}
              </div>
            )}
          </section>

          {/* Section 5: Audit Notes Register */}
          {study.auditNotes && study.auditNotes.length > 0 && (
            <section className="space-y-4 pt-4 border-t border-ink-200 dark:border-ink-800">
              <div className="flex items-center gap-2 text-ink-900 dark:text-ink-50 font-display font-bold text-xl sm:text-2xl">
                <FiShield className="text-emerald-600 dark:text-emerald-400" />
                <h2>Integrity Register & Audit Notes</h2>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900">
                <table className="w-full text-left text-xs border-collapse font-body">
                  <thead>
                    <tr className="border-b border-ink-200 dark:border-ink-800 bg-ink-100/60 dark:bg-ink-950 font-mono text-[11px] uppercase text-ink-600 dark:text-ink-400">
                      <th className="px-4 py-3">Topic</th>
                      <th className="px-4 py-3">Finding & Assessment</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100 dark:divide-ink-800 text-ink-700 dark:text-ink-300">
                    {study.auditNotes.map((note, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 font-semibold text-ink-900 dark:text-ink-100 whitespace-nowrap">
                          {note.topic}
                        </td>
                        <td className="px-4 py-3 leading-relaxed">{note.finding}</td>
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border border-ink-200 dark:border-ink-700">
                            {note.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Back to Case Studies CTA */}
          <div className="pt-8 border-t border-ink-200 dark:border-ink-800 flex justify-between items-center">
            <Link
              href="/case-studies"
              prefetch={true}
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              <FiArrowLeft size={14} />
              <span>Back to All Case Studies</span>
            </Link>

            <span className="text-xs font-mono text-ink-600 dark:text-ink-400">
              Last Updated: {new Date(study.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </main>

      <PublicFooter
        email={settings.publicEmail}
        linkedinUrl={settings.socialLinks?.linkedin}
        githubUrl={settings.socialLinks?.github}
      />
    </div>
  );
}
