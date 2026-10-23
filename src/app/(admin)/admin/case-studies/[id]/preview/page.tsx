import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import {
  FiBookOpen,
  FiEdit3,
  FiCheckCircle,
  FiAlertTriangle,
  FiTable,
  FiLayers,
} from "react-icons/fi";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { togglePublishCaseStudyAction } from "../../actions";

interface PreviewCaseStudyPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Admin Draft Preview | Case Study",
  description: "Administrative preview of research paper draft data.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PreviewCaseStudyPage({
  params,
}: PreviewCaseStudyPageProps) {
  const session = await requireAdmin();
  const { id } = await params;
  const db = getDb();

  // Parallelize queries for fast rendering
  const [[study], schedules, [discrepancy]] = await Promise.all([
    db.select().from(schema.caseStudies).where(eq(schema.caseStudies.id, id)).limit(1),

    db
      .select()
      .from(schema.financialSchedules)
      .where(eq(schema.financialSchedules.caseStudyId, id))
      .orderBy(schema.financialSchedules.sortOrder),

    db
      .select()
      .from(schema.caseStudyDiscrepancies)
      .where(eq(schema.caseStudyDiscrepancies.caseStudyId, id))
      .limit(1),
  ]);

  if (!study) {
    notFound();
  }

  return (
    <AdminShell
      userEmail={session.user?.email}
      userName={session.user?.name}
      title="Case Study Draft Preview"
      description={`Administrative preview of ${study.title}`}
      breadcrumbs={[
        { label: "Overview", href: "/admin" },
        { label: "Case Studies", href: "/admin/case-studies" },
        { label: "Preview" },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/case-studies/${study.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-ink-700 dark:text-ink-100 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
          >
            <FiEdit3 className="w-3.5 h-3.5" />
            <span>Back to Editor</span>
          </Link>

          {study.status !== "published" && (
            <form
              action={async () => {
                "use server";
                await togglePublishCaseStudyAction(study.id, "published");
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-ink-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm cursor-pointer"
              >
                <FiCheckCircle className="w-3.5 h-3.5" />
                <span>Publish Study</span>
              </button>
            </form>
          )}
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
        {/* Paper Header Card */}
        <header className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-clay-card-dark space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {study.groupShort} · ID #{study.sourceId}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                study.status === "published"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              }`}
            >
              {study.status.toUpperCase()}
            </span>
            {study.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                FEATURED
              </span>
            )}
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-900 dark:text-ink-50 leading-tight">
            {study.title}
          </h1>

          <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed font-sans">
            {study.description}
          </p>

          {/* Academic Scope Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-ink-200 dark:border-ink-800 text-xs font-mono">
            <div className="bg-ink-50 dark:bg-ink-950/60 p-3 rounded-xl border border-ink-200 dark:border-ink-800/80">
              <span className="text-[10px] text-ink-500 block">FRAMEWORK</span>
              <span className="text-ink-800 dark:text-ink-200 font-semibold">
                {study.framework}
              </span>
            </div>
            <div className="bg-ink-50 dark:bg-ink-950/60 p-3 rounded-xl border border-ink-200 dark:border-ink-800/80">
              <span className="text-[10px] text-ink-500 block">CURRENCY</span>
              <span className="text-ink-800 dark:text-ink-200 font-semibold">
                {study.currencyUnit}
              </span>
            </div>
            <div className="bg-ink-50 dark:bg-ink-950/60 p-3 rounded-xl border border-ink-200 dark:border-ink-800/80">
              <span className="text-[10px] text-ink-500 block">EVIDENCE</span>
              <span className="text-ink-800 dark:text-ink-200 font-semibold">
                {study.evidenceType}
              </span>
            </div>
            <div className="bg-ink-50 dark:bg-ink-950/60 p-3 rounded-xl border border-ink-200 dark:border-ink-800/80">
              <span className="text-[10px] text-ink-500 block">BASIS</span>
              <span className="text-ink-800 dark:text-ink-200 font-semibold">
                {study.calculationBasis}
              </span>
            </div>
          </div>
        </header>

        {/* Mandatory Integrity Disclosure Warning Banner */}
        {discrepancy && (
          <section className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 shadow-sm dark:shadow-clay-card-dark space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <FiAlertTriangle className="w-5 h-5 shrink-0" />
              <span className="font-display font-bold text-sm tracking-wide">
                FORMAL DISCREPANCY DISCLOSURE (INTEGRITY REGISTER)
              </span>
            </div>
            <div className="bg-amber-500/5 dark:bg-ink-950/90 border border-amber-500/20 rounded-xl p-4 text-xs font-mono space-y-2">
              <div className="text-amber-700 dark:text-amber-300 font-bold">
                {discrepancy.headline}
              </div>
              <div className="text-ink-700 dark:text-ink-300">{discrepancy.summary}</div>
              <div className="text-ink-600 dark:text-ink-400 pt-2 border-t border-amber-500/20 dark:border-ink-800">
                <span className="text-ink-800 dark:text-ink-200 font-semibold">
                  Formula Tested:
                </span>{" "}
                {discrepancy.formulaTested}
              </div>
              <div className="text-ink-600 dark:text-ink-400">
                <span className="text-ink-800 dark:text-ink-200 font-semibold">
                  Preservation Policy:
                </span>{" "}
                {discrepancy.preservationPolicy}
              </div>
            </div>
          </section>
        )}

        {/* Abstract & Overview */}
        {study.overview && (
          <section className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl p-6 shadow-sm dark:shadow-clay-card-dark space-y-3">
            <h2 className="font-display font-bold text-lg text-ink-900 dark:text-ink-100 flex items-center gap-2">
              <FiBookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Academic Abstract & Methodology Scope</span>
            </h2>
            <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed font-sans whitespace-pre-line">
              {study.overview}
            </p>
          </section>
        )}

        {/* Methodology Sections */}
        {study.methodology &&
          Array.isArray(study.methodology) &&
          study.methodology.length > 0 && (
            <section className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl p-6 shadow-sm dark:shadow-clay-card-dark space-y-4">
              <h2 className="font-display font-bold text-lg text-ink-900 dark:text-ink-100 flex items-center gap-2">
                <FiLayers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Research Methodology & Empirical Models</span>
              </h2>
              <div className="space-y-4">
                {study.methodology.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-ink-50 dark:bg-ink-950/60 border border-ink-200 dark:border-ink-800 p-4 rounded-xl space-y-1"
                  >
                    <h3 className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                      {m.heading}
                    </h3>
                    <p className="text-xs text-ink-600 dark:text-ink-300 font-sans leading-relaxed">
                      {m.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* Tabular Financial Schedules */}
        {schedules.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <FiTable className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="font-display font-bold text-lg text-ink-900 dark:text-ink-100">
                Financial Tabular Schedules ({schedules.length})
              </h2>
            </div>

            {schedules.map((schedule, sIndex) => (
              <div
                key={schedule.id}
                className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl p-6 shadow-sm dark:shadow-clay-card-dark space-y-4 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-ink-900 dark:text-ink-50">
                    Schedule {sIndex + 1}: {schedule.title}
                  </h3>
                  <span className="text-[10px] font-mono text-ink-500 uppercase">
                    Tabular-Nums Enforced
                  </span>
                </div>

                <div className="overflow-x-auto border border-ink-200 dark:border-ink-800 rounded-xl bg-ink-50 dark:bg-ink-950">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-ink-100 dark:bg-ink-900/90 border-b border-ink-200 dark:border-ink-800">
                        {schedule.headers.map((h, hIdx) => (
                          <th
                            key={hIdx}
                            className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400 border-r border-ink-200 dark:border-ink-800/80 last:border-r-0 whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-200 dark:divide-ink-800/60 font-mono tabular-nums text-xs">
                      {schedule.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className="hover:bg-ink-100/60 dark:hover:bg-ink-900/40"
                        >
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className="p-3 border-r border-ink-200 dark:border-ink-800/40 last:border-r-0 text-ink-800 dark:text-ink-200 whitespace-nowrap"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {schedule.notes && (
                  <p className="text-xs text-ink-500 dark:text-ink-400 font-mono italic">
                    Footnote: {schedule.notes}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Key Findings & Audit Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Findings */}
          {study.keyFindings &&
            Array.isArray(study.keyFindings) &&
            study.keyFindings.length > 0 && (
              <section className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl p-6 shadow-sm dark:shadow-clay-card-dark space-y-3">
                <h3 className="font-display font-bold text-base text-ink-900 dark:text-ink-100">
                  Key Empirical Findings
                </h3>
                <ul className="space-y-2 text-xs text-ink-600 dark:text-ink-300 font-sans list-disc list-inside">
                  {study.keyFindings.map((finding, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {finding}
                    </li>
                  ))}
                </ul>
              </section>
            )}

          {/* Audit Notes */}
          {study.auditNotes &&
            Array.isArray(study.auditNotes) &&
            study.auditNotes.length > 0 && (
              <section className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl p-6 shadow-sm dark:shadow-clay-card-dark space-y-3">
                <h3 className="font-display font-bold text-base text-ink-900 dark:text-ink-100">
                  Audit & Control Notes
                </h3>
                <div className="space-y-2">
                  {study.auditNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-ink-50 dark:bg-ink-950/80 border border-ink-200 dark:border-ink-800 text-xs font-mono space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          {note.topic}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-ink-100 dark:bg-ink-900 text-ink-600 dark:text-ink-400 border border-ink-200 dark:border-ink-800">
                          {note.status}
                        </span>
                      </div>
                      <p className="text-ink-600 dark:text-ink-300 font-sans">
                        {note.finding}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
        </div>
      </div>
    </AdminShell>
  );
}
