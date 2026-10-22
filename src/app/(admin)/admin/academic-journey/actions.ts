"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { recordContentRevision, recordActivityLog } from "@/lib/cms-audit";

export interface MilestoneFormData {
  id: string;
  degree: string;
  institution: string;
  campus: string;
  major: string;
  status: string;
  period: string;
  overview: string;
  disciplines: string[];
  sortOrder?: number;
}

export interface AccaTrajectoryFormData {
  qualification: string;
  credentialBody: string;
  trajectoryType: string;
  statusLabel: string;
  integrityNotice: string;
  strategicFocus: string[];
}

/**
 * Server Action: Update an Academic Milestone Record.
 */
export async function updateMilestoneAction(data: MilestoneFormData) {
  const session = await requireAdmin();
  const authorId = session.user?.id;
  const db = getDb();

  if (!data.id) {
    return { success: false, error: "Milestone identifier is required." };
  }

  try {
    const [existing] = await db
      .select()
      .from(schema.academicMilestones)
      .where(eq(schema.academicMilestones.id, data.id))
      .limit(1);

    if (!existing) {
      return { success: false, error: "Milestone not found." };
    }

    await db
      .update(schema.academicMilestones)
      .set({
        degree: data.degree.trim(),
        institution: data.institution.trim(),
        campus: data.campus.trim(),
        major: data.major.trim(),
        status: data.status.trim(),
        period: data.period.trim(),
        overview: data.overview.trim(),
        disciplines: data.disciplines || [],
        sortOrder: data.sortOrder ?? existing.sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(schema.academicMilestones.id, data.id));

    // Record revision snapshot
    await recordContentRevision({
      entityType: "academic_milestone",
      entityId: data.id,
      snapshot: { ...data },
      authorId,
      changeSummary: `Updated milestone: "${data.degree}"`,
    });

    // Record activity log
    await recordActivityLog({
      action: "update",
      entityType: "academic_milestone",
      entityId: data.id,
      userId: authorId,
      metadata: { id: data.id, degree: data.degree, institution: data.institution },
    });

    revalidatePath("/admin/academic-journey");

    return {
      success: true,
      message: `Milestone "${data.degree}" updated successfully.`,
    };
  } catch (error) {
    console.error("[AcademicJourneyAction] updateMilestone error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update milestone.",
    };
  }
}

/**
 * Server Action: Update ACCA Career Trajectory Information in site_settings.
 */
export async function updateAccaTrajectoryAction(data: AccaTrajectoryFormData) {
  const session = await requireAdmin();
  const authorId = session.user?.id;
  const db = getDb();

  try {
    // GUARDRAIL CHECK: Ensure ACCA is not claimed as a completed qualification
    const lowerStatus = (data.statusLabel + " " + data.trajectoryType).toLowerCase();
    if (lowerStatus.includes("completed member") || lowerStatus.includes("fellow member")) {
      return {
        success: false,
        error: "ACCA must remain designated as a career trajectory / planned credential. Completed membership cannot be claimed without verified certificate.",
      };
    }

    await db
      .update(schema.siteSettings)
      .set({
        accaTrajectory: data,
        updatedAt: new Date(),
      })
      .where(eq(schema.siteSettings.id, "default"));

    // Record revision
    await recordContentRevision({
      entityType: "acca_trajectory",
      entityId: "default",
      snapshot: data as unknown as Record<string, unknown>,
      authorId,
      changeSummary: "Updated ACCA career trajectory strategy",
    });

    // Record activity log
    await recordActivityLog({
      action: "update",
      entityType: "acca_trajectory",
      entityId: "default",
      userId: authorId,
      metadata: { qualification: data.qualification, statusLabel: data.statusLabel },
    });

    revalidatePath("/admin/academic-journey");

    return {
      success: true,
      message: "ACCA Career Trajectory updated successfully.",
    };
  } catch (error) {
    console.error("[AcademicJourneyAction] updateAccaTrajectory error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update ACCA trajectory.",
    };
  }
}
