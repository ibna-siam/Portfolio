import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { AdminShell } from "@/components/admin/admin-shell";
import { CaseStudiesClient, CaseStudyListItem } from "./case-studies-client";

export const metadata: Metadata = {
  title: "Case Studies CMS | Md Ibna Siam Admin",
  description: "Manage academic accounting and finance research papers and financial schedules.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminCaseStudiesPage() {
  const session = await requireAdmin();
  const db = getDb();

  // Retrieve case studies, schedules, and discrepancies in parallel
  const [rawStudies, rawSchedules, rawDiscrepancies] = await Promise.all([
    db
      .select()
      .from(schema.caseStudies)
      .orderBy(schema.caseStudies.sourceId),
    db
      .select({
        caseStudyId: schema.financialSchedules.caseStudyId,
      })
      .from(schema.financialSchedules),
    db
      .select({
        caseStudyId: schema.caseStudyDiscrepancies.caseStudyId,
        headline: schema.caseStudyDiscrepancies.headline,
      })
      .from(schema.caseStudyDiscrepancies),
  ]);

  const scheduleCountMap = new Map<string, number>();
  for (const s of rawSchedules) {
    scheduleCountMap.set(s.caseStudyId, (scheduleCountMap.get(s.caseStudyId) || 0) + 1);
  }

  const discrepancyMap = new Map<string, string>();
  for (const d of rawDiscrepancies) {
    discrepancyMap.set(d.caseStudyId, d.headline);
  }

  const studies: CaseStudyListItem[] = rawStudies.map((s) => ({
    id: s.id,
    sourceId: s.sourceId,
    slug: s.slug,
    title: s.title,
    category: s.category,
    groupShort: s.groupShort,
    status: s.status,
    hasDiscrepancy: discrepancyMap.has(s.id),
    discrepancyHeadline: discrepancyMap.get(s.id),
    scheduleCount: scheduleCountMap.get(s.id) || 0,
    updatedAt: s.updatedAt,
  }));

  return (
    <AdminShell
      userEmail={session.user?.email}
      userName={session.user?.name}
      title="Academic Case Studies"
      description="Manage research papers, financial schedules, CVP models, and mandatory integrity disclosures."
      breadcrumbs={[
        { label: "Overview", href: "/admin" },
        { label: "Case Studies" },
      ]}
      actions={
        <Link
          href="/admin/case-studies/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:text-ink-950 dark:bg-emerald-400 dark:hover:bg-emerald-300 shadow-sm active:translate-y-0.5 transition-all self-start sm:self-auto cursor-pointer"
        >
          <FiPlus className="w-4 h-4 stroke-[2.5]" />
          <span>New Case Study</span>
        </Link>
      }
    >
      <CaseStudiesClient initialStudies={studies} />
    </AdminShell>
  );
}
