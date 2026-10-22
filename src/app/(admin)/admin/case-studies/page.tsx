import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { AdminNav } from "@/components/admin/admin-nav";
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

  // Retrieve all case studies ordered by sourceId asc
  const rawStudies = await db
    .select()
    .from(schema.caseStudies)
    .orderBy(schema.caseStudies.sourceId);

  // Retrieve financial schedule counts per case study
  const rawSchedules = await db
    .select({
      caseStudyId: schema.financialSchedules.caseStudyId,
    })
    .from(schema.financialSchedules);

  const scheduleCountMap = new Map<string, number>();
  for (const s of rawSchedules) {
    scheduleCountMap.set(s.caseStudyId, (scheduleCountMap.get(s.caseStudyId) || 0) + 1);
  }

  // Retrieve discrepancy records to display disclosure warnings
  const rawDiscrepancies = await db
    .select({
      caseStudyId: schema.caseStudyDiscrepancies.caseStudyId,
      headline: schema.caseStudyDiscrepancies.headline,
    })
    .from(schema.caseStudyDiscrepancies);

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
    <div className="min-h-screen bg-ink-950 text-ink-100 font-body">
      <AdminNav userEmail={session.user?.email} userName={session.user?.name} />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-up">
        <CaseStudiesClient initialStudies={studies} />
      </main>
    </div>
  );
}
