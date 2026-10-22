"use server";

import { revalidatePath } from "next/cache";
import { eq, desc, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { recordContentRevision, recordActivityLog } from "@/lib/cms-audit";

export interface ScheduleInput {
  id?: string;
  title: string;
  headers: string[];
  rows: string[][];
  notes?: string | null;
  sortOrder: number;
}

export interface CaseStudyFormData {
  id?: string;
  slug: string;
  title: string;
  category: string;
  group: string;
  groupId: string;
  groupShort: string;
  academicScope: string;
  framework: string;
  evidenceType: string;
  currencyUnit: string;
  inputsClassification: string;
  calculationBasis: string;
  integrityStatusKey: string;
  secondaryStatusKey?: string | null;
  description: string;
  details: string[];
  tools: string[];
  imageUrl?: string | null;
  outcome: string;
  type?: string;
  featured?: boolean;
  overview: string;
  objectives: string[];
  methodology: Array<{ heading: string; body: string }>;
  keyFindings: string[];
  conclusion: string;
  recommendations: string[];
  auditNotes: Array<{ topic: string; finding: string; status: string }>;
  formulas: Array<{ name: string; formula: string }>;
  status: "draft" | "preview" | "published" | "archived";
  financialSchedules?: ScheduleInput[];
}

/**
 * Fetch registered media assets for the Media Picker modal dialog.
 */
export async function getMediaAssetsAction() {
  await requireAdmin();
  const db = getDb();
  const assets = await db
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

  return assets;
}

/**
 * Server Action: Create or Update an Academic Case Study with full relational schedules,
 * revision snapshotting, and activity logging.
 */
export async function upsertCaseStudyAction(data: CaseStudyFormData) {
  const session = await requireAdmin();
  const authorId = session.user?.id;
  const db = getDb();

  // 1. Validation
  if (!data.title?.trim()) {
    return { success: false, error: "Title is required." };
  }
  if (!data.slug?.trim()) {
    return { success: false, error: "Slug is required." };
  }

  // Format slug cleanly
  const normalizedSlug = data.slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");

  // 2. Check slug uniqueness
  if (data.id) {
    const existingSlug = await db
      .select({ id: schema.caseStudies.id })
      .from(schema.caseStudies)
      .where(
        sql`${schema.caseStudies.slug} = ${normalizedSlug} AND ${schema.caseStudies.id} != ${data.id}`
      )
      .limit(1);

    if (existingSlug.length > 0) {
      return { success: false, error: `Slug "${normalizedSlug}" is already in use by another study.` };
    }
  } else {
    const existingSlug = await db
      .select({ id: schema.caseStudies.id })
      .from(schema.caseStudies)
      .where(eq(schema.caseStudies.slug, normalizedSlug))
      .limit(1);

    if (existingSlug.length > 0) {
      return { success: false, error: `Slug "${normalizedSlug}" is already in use.` };
    }
  }

  try {
    let caseStudyId = data.id;
    let isCreate = false;

    if (!caseStudyId) {
      // Creation flow: determine next sourceId
      isCreate = true;
      const maxSource = await db
        .select({ maxId: sql<number>`COALESCE(MAX(${schema.caseStudies.sourceId}), 0)` })
        .from(schema.caseStudies);

      const nextSourceId = (maxSource[0]?.maxId || 0) + 1;

      const [inserted] = await db
        .insert(schema.caseStudies)
        .values({
          sourceId: nextSourceId,
          slug: normalizedSlug,
          title: data.title.trim(),
          category: data.category?.trim() || "Accounting & Financial Management",
          group: data.group?.trim() || "Applied Accounting Case Study",
          groupId: data.groupId?.trim() || "accounting",
          groupShort: data.groupShort?.trim() || "Accounting",
          academicScope: data.academicScope?.trim() || "Financial & Managerial Analysis",
          framework: data.framework?.trim() || "IFRS / Bangladesh Income Tax Act",
          evidenceType: data.evidenceType?.trim() || "Coursework & Empirical Case Data",
          currencyUnit: data.currencyUnit?.trim() || "BDT (Bangladeshi Taka)",
          inputsClassification: data.inputsClassification?.trim() || "Verified Academic Coursework",
          calculationBasis: data.calculationBasis?.trim() || "Standard CVP & Financial Statement Ratios",
          integrityStatusKey: data.integrityStatusKey?.trim() || "STANDARD",
          secondaryStatusKey: data.secondaryStatusKey?.trim() || null,
          description: data.description?.trim() || "",
          details: data.details || [],
          tools: data.tools || ["Microsoft Excel", "Financial Ratio Modeling"],
          imageUrl: data.imageUrl || null,
          outcome: data.outcome?.trim() || "",
          type: data.type?.trim() || "Academic Project",
          featured: Boolean(data.featured),
          overview: data.overview?.trim() || "",
          objectives: data.objectives || [],
          methodology: data.methodology || [],
          keyFindings: data.keyFindings || [],
          conclusion: data.conclusion?.trim() || "",
          recommendations: data.recommendations || [],
          auditNotes: data.auditNotes || [],
          formulas: data.formulas || [],
          status: data.status || "draft",
          publishedAt: data.status === "published" ? new Date() : null,
          updatedAt: new Date(),
        })
        .returning({ id: schema.caseStudies.id });

      caseStudyId = inserted.id;
    } else {
      // Update flow
      await db
        .update(schema.caseStudies)
        .set({
          slug: normalizedSlug,
          title: data.title.trim(),
          category: data.category?.trim() || "Accounting & Financial Management",
          group: data.group?.trim() || "Applied Accounting Case Study",
          groupId: data.groupId?.trim() || "accounting",
          groupShort: data.groupShort?.trim() || "Accounting",
          academicScope: data.academicScope?.trim() || "Financial & Managerial Analysis",
          framework: data.framework?.trim() || "IFRS / Bangladesh Income Tax Act",
          evidenceType: data.evidenceType?.trim() || "Coursework & Empirical Case Data",
          currencyUnit: data.currencyUnit?.trim() || "BDT (Bangladeshi Taka)",
          inputsClassification: data.inputsClassification?.trim() || "Verified Academic Coursework",
          calculationBasis: data.calculationBasis?.trim() || "Standard CVP & Financial Statement Ratios",
          integrityStatusKey: data.integrityStatusKey?.trim() || "STANDARD",
          secondaryStatusKey: data.secondaryStatusKey?.trim() || null,
          description: data.description?.trim() || "",
          details: data.details || [],
          tools: data.tools || ["Microsoft Excel", "Financial Ratio Modeling"],
          imageUrl: data.imageUrl || null,
          outcome: data.outcome?.trim() || "",
          type: data.type?.trim() || "Academic Project",
          featured: Boolean(data.featured),
          overview: data.overview?.trim() || "",
          objectives: data.objectives || [],
          methodology: data.methodology || [],
          keyFindings: data.keyFindings || [],
          conclusion: data.conclusion?.trim() || "",
          recommendations: data.recommendations || [],
          auditNotes: data.auditNotes || [],
          formulas: data.formulas || [],
          status: data.status || "draft",
          publishedAt: data.status === "published" ? new Date() : undefined,
          updatedAt: new Date(),
        })
        .where(eq(schema.caseStudies.id, caseStudyId));
    }

    // 3. Update Financial Schedules if provided
    if (data.financialSchedules && Array.isArray(data.financialSchedules)) {
      // Remove previous schedules and re-insert updated array
      await db
        .delete(schema.financialSchedules)
        .where(eq(schema.financialSchedules.caseStudyId, caseStudyId));

      for (const [index, schedule] of data.financialSchedules.entries()) {
        if (schedule.title?.trim()) {
          await db.insert(schema.financialSchedules).values({
            caseStudyId,
            title: schedule.title.trim(),
            headers: schedule.headers || [],
            rows: schedule.rows || [],
            notes: schedule.notes || null,
            sortOrder: schedule.sortOrder ?? index,
            updatedAt: new Date(),
          });
        }
      }
    }

    // 4. Record Append-Only Revision Snapshot
    const snapshotPayload = {
      ...data,
      id: caseStudyId,
      slug: normalizedSlug,
      savedAt: new Date().toISOString(),
    };

    await recordContentRevision({
      entityType: "case_study",
      entityId: caseStudyId,
      snapshot: snapshotPayload,
      authorId,
      changeSummary: isCreate
        ? `Created case study: "${data.title}"`
        : `Updated case study: "${data.title}" (${data.status})`,
    });

    // 5. Record Activity Log
    await recordActivityLog({
      action: isCreate ? "create" : "update",
      entityType: "case_study",
      entityId: caseStudyId,
      userId: authorId,
      metadata: {
        title: data.title,
        status: data.status,
        slug: normalizedSlug,
      },
    });

    revalidatePath("/admin/case-studies");
    revalidatePath(`/admin/case-studies/${caseStudyId}/edit`);
    revalidatePath(`/admin/case-studies/${caseStudyId}/preview`);

    return {
      success: true,
      caseStudyId,
      slug: normalizedSlug,
      message: isCreate
        ? "Case study created successfully."
        : "Case study updated successfully.",
    };
  } catch (error) {
    console.error("[CaseStudyAction] upsert error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save case study.",
    };
  }
}

/**
 * Server Action: Quick Toggle Publish / Unpublish Status.
 */
export async function togglePublishCaseStudyAction(id: string, newStatus: "published" | "draft") {
  const session = await requireAdmin();
  const authorId = session.user?.id;
  const db = getDb();

  try {
    const [existing] = await db
      .select({ id: schema.caseStudies.id, title: schema.caseStudies.title, status: schema.caseStudies.status })
      .from(schema.caseStudies)
      .where(eq(schema.caseStudies.id, id))
      .limit(1);

    if (!existing) {
      return { success: false, error: "Case study not found." };
    }

    await db
      .update(schema.caseStudies)
      .set({
        status: newStatus,
        publishedAt: newStatus === "published" ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(schema.caseStudies.id, id));

    await recordActivityLog({
      action: newStatus === "published" ? "publish" : "unpublish",
      entityType: "case_study",
      entityId: id,
      userId: authorId,
      metadata: { title: existing.title, previousStatus: existing.status, newStatus },
    });

    revalidatePath("/admin/case-studies");
    revalidatePath(`/admin/case-studies/${id}/edit`);
    revalidatePath(`/admin/case-studies/${id}/preview`);

    return {
      success: true,
      message: `Case study "${existing.title}" is now ${newStatus}.`,
    };
  } catch (error) {
    console.error("[CaseStudyAction] publish toggle error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle publish status.",
    };
  }
}

/**
 * Server Action: Safe Deletion of a Case Study with Discrepancy Integrity Guardrail.
 */
export async function deleteCaseStudyAction(id: string) {
  const session = await requireAdmin();
  const authorId = session.user?.id;
  const db = getDb();

  try {
    // Check if the study exists
    const [study] = await db
      .select({ id: schema.caseStudies.id, title: schema.caseStudies.title, slug: schema.caseStudies.slug })
      .from(schema.caseStudies)
      .where(eq(schema.caseStudies.id, id))
      .limit(1);

    if (!study) {
      return { success: false, error: "Case study not found." };
    }

    // MANDATORY FINANCIAL INTEGRITY GUARDRAIL:
    // Check if this case study has an active discrepancy disclosure record
    const discrepancies = await db
      .select({ id: schema.caseStudyDiscrepancies.id, headline: schema.caseStudyDiscrepancies.headline })
      .from(schema.caseStudyDiscrepancies)
      .where(eq(schema.caseStudyDiscrepancies.caseStudyId, id))
      .limit(1);

    if (discrepancies.length > 0) {
      return {
        success: false,
        error: `Cannot delete "${study.title}". This case study is bound to mandatory academic financial disclosure ("${discrepancies[0].headline}"). Historical financial discrepancy records must remain intact.`,
      };
    }

    // Delete schedules first (or cascade)
    await db
      .delete(schema.financialSchedules)
      .where(eq(schema.financialSchedules.caseStudyId, id));

    // Delete case study
    await db
      .delete(schema.caseStudies)
      .where(eq(schema.caseStudies.id, id));

    // Record activity log
    await recordActivityLog({
      action: "delete",
      entityType: "case_study",
      entityId: id,
      userId: authorId,
      metadata: { title: study.title, slug: study.slug },
    });

    revalidatePath("/admin/case-studies");

    return {
      success: true,
      message: `Case study "${study.title}" was deleted successfully.`,
    };
  } catch (error) {
    console.error("[CaseStudyAction] delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete case study.",
    };
  }
}
