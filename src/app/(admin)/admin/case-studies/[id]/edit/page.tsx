import { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq, desc, and } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
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

  // Parallelize database queries for optimum response time
  const [
    [study],
    rawSchedules,
    [discrepancy],
    rawRevisions,
    rawMedia,
  ] = await Promise.all([
    // Retrieve case study
    db
      .select()
      .from(schema.caseStudies)
      .where(eq(schema.caseStudies.id, id))
      .limit(1),

    // Retrieve financial schedules
    db
      .select()
      .from(schema.financialSchedules)
      .where(eq(schema.financialSchedules.caseStudyId, id))
      .orderBy(schema.financialSchedules.sortOrder),

    // Retrieve discrepancy disclosure if one is attached
    db
      .select()
      .from(schema.caseStudyDiscrepancies)
      .where(eq(schema.caseStudyDiscrepancies.caseStudyId, id))
      .limit(1),

    // Retrieve revision history
    db
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
      .limit(10),

    // Retrieve available media assets for picker
    db
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
      .orderBy(desc(schema.mediaAssets.createdAt)),
  ]);

  if (!study) {
    notFound();
  }

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
    <AdminShell
      userEmail={session.user?.email}
      userName={session.user?.name}
      title="Edit Case Study"
      description={`Editing ${study.title} (Slug: /${study.slug})`}
      breadcrumbs={[
        { label: "Overview", href: "/admin" },
        { label: "Case Studies", href: "/admin/case-studies" },
        { label: "Edit" },
      ]}
    >
      <CaseStudyEditor
        initialData={studyData}
        initialSchedules={schedules}
        discrepancy={discrepancy || null}
        revisions={rawRevisions}
        availableMediaAssets={rawMedia}
      />
    </AdminShell>
  );
}
