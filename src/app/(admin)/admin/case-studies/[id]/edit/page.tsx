import { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq, desc, and } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { AdminNav } from "@/components/admin/admin-nav";
import { CaseStudyEditor } from "@/components/admin/case-study-editor";

interface EditCaseStudyPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Case Study | Portfolio CMS Admin",
  description: "Edit research paper, financial schedules, and metadata.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function EditCaseStudyPage({ params }: EditCaseStudyPageProps) {
  const session = await requireAdmin();
  const { id } = await params;
  const db = getDb();

  // Retrieve case study
  const [study] = await db
    .select()
    .from(schema.caseStudies)
    .where(eq(schema.caseStudies.id, id))
    .limit(1);

  if (!study) {
    notFound();
  }

  // Retrieve financial schedules
  const rawSchedules = await db
    .select()
    .from(schema.financialSchedules)
    .where(eq(schema.financialSchedules.caseStudyId, id))
    .orderBy(schema.financialSchedules.sortOrder);

  // Retrieve discrepancy disclosure if one is attached
  const [discrepancy] = await db
    .select()
    .from(schema.caseStudyDiscrepancies)
    .where(eq(schema.caseStudyDiscrepancies.caseStudyId, id))
    .limit(1);

  // Retrieve revision history
  const rawRevisions = await db
    .select({
      revisionNumber: schema.contentRevisions.revisionNumber,
      changeSummary: schema.contentRevisions.changeSummary,
      createdAt: schema.contentRevisions.createdAt,
    })
    .from(schema.contentRevisions)
    .where(
      and(
        eq(schema.contentRevisions.entityType, "case_study"),
        eq(schema.contentRevisions.entityId, id)
      )
    )
    .orderBy(desc(schema.contentRevisions.revisionNumber))
    .limit(10);

  // Retrieve available media assets for picker
  const rawMedia = await db
    .select({
      id: schema.mediaAssets.id,
      publicId: schema.mediaAssets.publicId,
      secureUrl: schema.mediaAssets.secureUrl,
      format: schema.mediaAssets.format,
      width: schema.mediaAssets.width,
      height: schema.mediaAssets.height,
      bytes: schema.mediaAssets.bytes,
      altText: schema.mediaAssets.altText,
    })
    .from(schema.mediaAssets)
    .orderBy(desc(schema.mediaAssets.createdAt));

  const schedules = rawSchedules.map((s) => ({
    id: s.id,
    title: s.title,
    headers: s.headers,
    rows: s.rows,
    notes: s.notes,
    sortOrder: s.sortOrder,
  }));

  const studyData = {
    id: study.id,
    slug: study.slug,
    title: study.title,
    category: study.category,
    group: study.group,
    groupId: study.groupId,
    groupShort: study.groupShort,
    academicScope: study.academicScope,
    framework: study.framework,
    evidenceType: study.evidenceType,
    currencyUnit: study.currencyUnit,
    inputsClassification: study.inputsClassification,
    calculationBasis: study.calculationBasis,
    integrityStatusKey: study.integrityStatusKey,
    secondaryStatusKey: study.secondaryStatusKey,
    description: study.description,
    details: study.details,
    tools: study.tools,
    imageUrl: study.imageUrl,
    outcome: study.outcome,
    type: study.type,
    featured: study.featured,
    overview: study.overview,
    objectives: study.objectives,
    methodology: study.methodology,
    keyFindings: study.keyFindings,
    conclusion: study.conclusion,
    recommendations: study.recommendations,
    auditNotes: study.auditNotes,
    formulas: study.formulas,
    status: study.status as "draft" | "published",
  };

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100 font-body">
      <AdminNav userEmail={session.user?.email} userName={session.user?.name} />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-up">
        <CaseStudyEditor
          initialData={studyData}
          initialSchedules={schedules}
          discrepancy={discrepancy || null}
          revisions={rawRevisions}
          availableMediaAssets={rawMedia}
        />
      </main>
    </div>
  );
}
