"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { recordContentRevision, recordActivityLog } from "@/lib/cms-audit";

export interface CompetencyFormData {
  id?: string;
  name: string;
  domain: string;
  category: string;
  evidenceLabel: string;
  description: string;
  frameworkTags: string[];
  relatedProject: string;
  sortOrder?: number;
  status?: string;
}

/**
 * Server Action: Create or Update a Competency Record.
 */
export async function upsertCompetencyAction(data: CompetencyFormData) {
  const session = await requireAdmin();
  const authorId = session.user?.id;
  const db = getDb();

  if (!data.name?.trim()) {
    return { success: false, error: "Competency name is required." };
  }
  if (!data.domain?.trim()) {
    return { success: false, error: "Domain is required." };
  }

  try {
    let competencyId = data.id;
    let isCreate = false;

    if (!competencyId) {
      isCreate = true;
      const [inserted] = await db
        .insert(schema.competencies)
        .values({
          name: data.name.trim(),
          domain: data.domain.trim(),
          category: data.category?.trim() || data.domain.trim(),
          evidenceLabel: data.evidenceLabel?.trim() || "Coursework & Case Study",
          description: data.description?.trim() || "",
          frameworkTags: data.frameworkTags || [],
          relatedProject: data.relatedProject?.trim() || "",
          sortOrder: data.sortOrder ?? 0,
          status: data.status || "published",
          updatedAt: new Date(),
        })
        .returning({ id: schema.competencies.id });

      competencyId = inserted.id;
    } else {
      await db
        .update(schema.competencies)
        .set({
          name: data.name.trim(),
          domain: data.domain.trim(),
          category: data.category?.trim() || data.domain.trim(),
          evidenceLabel: data.evidenceLabel?.trim() || "Coursework & Case Study",
          description: data.description?.trim() || "",
          frameworkTags: data.frameworkTags || [],
          relatedProject: data.relatedProject?.trim() || "",
          sortOrder: data.sortOrder ?? 0,
          status: data.status || "published",
          updatedAt: new Date(),
        })
        .where(eq(schema.competencies.id, competencyId));
    }

    // Record revision snapshot
    await recordContentRevision({
      entityType: "competency",
      entityId: competencyId,
      snapshot: { ...data, id: competencyId },
      authorId,
      changeSummary: isCreate
        ? `Created competency: "${data.name}"`
        : `Updated competency: "${data.name}"`,
    });

    // Record activity log
    await recordActivityLog({
      action: isCreate ? "create" : "update",
      entityType: "competency",
      entityId: competencyId,
      userId: authorId,
      metadata: { name: data.name, domain: data.domain },
    });

    revalidatePath("/admin/competencies");

    return {
      success: true,
      competencyId,
      message: isCreate
        ? "Competency created successfully."
        : "Competency updated successfully.",
    };
  } catch (error) {
    console.error("[CompetenciesAction] upsert error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save competency.",
    };
  }
}

/**
 * Server Action: Delete a Competency Record.
 */
export async function deleteCompetencyAction(id: string) {
  const session = await requireAdmin();
  const authorId = session.user?.id;
  const db = getDb();

  try {
    const [existing] = await db
      .select({ id: schema.competencies.id, name: schema.competencies.name })
      .from(schema.competencies)
      .where(eq(schema.competencies.id, id))
      .limit(1);

    if (!existing) {
      return { success: false, error: "Competency not found." };
    }

    await db.delete(schema.competencies).where(eq(schema.competencies.id, id));

    await recordActivityLog({
      action: "delete",
      entityType: "competency",
      entityId: id,
      userId: authorId,
      metadata: { name: existing.name },
    });

    revalidatePath("/admin/competencies");

    return {
      success: true,
      message: `Competency "${existing.name}" was deleted successfully.`,
    };
  } catch (error) {
    console.error("[CompetenciesAction] delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete competency.",
    };
  }
}
