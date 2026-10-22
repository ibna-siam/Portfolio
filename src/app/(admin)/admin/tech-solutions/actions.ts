"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { recordContentRevision, recordActivityLog } from "@/lib/cms-audit";

export interface TechSolutionFormData {
  id: string;
  title: string;
  category: string;
  status: string;
  statusTheme: string;
  problem: string;
  solution: string;
  userRole: string;
  techStack: string[];
  features: string[];
  verifiedRepo?: string | null;
  verifiedDemo?: string | null;
  linkText: string;
  sortOrder?: number;
  contentStatus?: string;
}

/**
 * Server Action: Create or Update a Tech Solution.
 */
export async function upsertTechSolutionAction(data: TechSolutionFormData) {
  const session = await requireAdmin();
  const authorId = session.user?.id;
  const db = getDb();

  if (!data.id?.trim()) {
    return { success: false, error: "System identifier is required." };
  }
  if (!data.title?.trim()) {
    return { success: false, error: "System title is required." };
  }

  // Sanitize ID
  const cleanId = data.id
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");

  // Safe URL validation
  const sanitizeUrl = (url?: string | null) => {
    if (!url || !url.trim()) return null;
    const trimmed = url.trim();
    if (!trimmed.startsWith("https://") && !trimmed.startsWith("http://")) {
      return null;
    }
    return trimmed;
  };

  try {
    const [existing] = await db
      .select({ id: schema.techSolutions.id })
      .from(schema.techSolutions)
      .where(eq(schema.techSolutions.id, cleanId))
      .limit(1);

    const isCreate = !existing;

    if (isCreate) {
      await db.insert(schema.techSolutions).values({
        id: cleanId,
        title: data.title.trim(),
        category: data.category?.trim() || "Financial Software",
        status: data.status?.trim() || "Verified",
        statusTheme: data.statusTheme?.trim() || "emerald",
        problem: data.problem?.trim() || "",
        solution: data.solution?.trim() || "",
        userRole: data.userRole?.trim() || "Lead Architect",
        techStack: data.techStack || [],
        features: data.features || [],
        verifiedRepo: sanitizeUrl(data.verifiedRepo),
        verifiedDemo: sanitizeUrl(data.verifiedDemo),
        linkText: data.linkText?.trim() || "View Repository",
        sortOrder: data.sortOrder ?? 0,
        contentStatus: data.contentStatus || "published",
        updatedAt: new Date(),
      });
    } else {
      await db
        .update(schema.techSolutions)
        .set({
          title: data.title.trim(),
          category: data.category?.trim() || "Financial Software",
          status: data.status?.trim() || "Verified",
          statusTheme: data.statusTheme?.trim() || "emerald",
          problem: data.problem?.trim() || "",
          solution: data.solution?.trim() || "",
          userRole: data.userRole?.trim() || "Lead Architect",
          techStack: data.techStack || [],
          features: data.features || [],
          verifiedRepo: sanitizeUrl(data.verifiedRepo),
          verifiedDemo: sanitizeUrl(data.verifiedDemo),
          linkText: data.linkText?.trim() || "View Repository",
          sortOrder: data.sortOrder ?? 0,
          contentStatus: data.contentStatus || "published",
          updatedAt: new Date(),
        })
        .where(eq(schema.techSolutions.id, cleanId));
    }

    // Record revision
    await recordContentRevision({
      entityType: "tech_solution",
      entityId: cleanId,
      snapshot: { ...data, id: cleanId },
      authorId,
      changeSummary: isCreate ? `Created solution: "${data.title}"` : `Updated solution: "${data.title}"`,
    });

    // Record activity log
    await recordActivityLog({
      action: isCreate ? "create" : "update",
      entityType: "tech_solution",
      entityId: cleanId,
      userId: authorId,
      metadata: { id: cleanId, title: data.title },
    });

    revalidatePath("/admin/tech-solutions");

    return {
      success: true,
      message: isCreate ? "Tech solution created successfully." : "Tech solution updated successfully.",
    };
  } catch (error) {
    console.error("[TechSolutionsAction] upsert error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save tech solution.",
    };
  }
}

/**
 * Server Action: Delete a Tech Solution.
 */
export async function deleteTechSolutionAction(id: string) {
  const session = await requireAdmin();
  const authorId = session.user?.id;
  const db = getDb();

  try {
    const [existing] = await db
      .select({ id: schema.techSolutions.id, title: schema.techSolutions.title })
      .from(schema.techSolutions)
      .where(eq(schema.techSolutions.id, id))
      .limit(1);

    if (!existing) {
      return { success: false, error: "Tech solution not found." };
    }

    await db.delete(schema.techSolutions).where(eq(schema.techSolutions.id, id));

    await recordActivityLog({
      action: "delete",
      entityType: "tech_solution",
      entityId: id,
      userId: authorId,
      metadata: { id, title: existing.title },
    });

    revalidatePath("/admin/tech-solutions");

    return {
      success: true,
      message: `Solution "${existing.title}" was deleted successfully.`,
    };
  } catch (error) {
    console.error("[TechSolutionsAction] delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete tech solution.",
    };
  }
}
