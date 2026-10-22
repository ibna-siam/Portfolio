import { eq, and, desc } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";

interface RecordRevisionParams {
  entityType: string;
  entityId: string;
  snapshot: Record<string, unknown>;
  authorId?: string | null;
  changeSummary?: string;
}

interface RecordActivityParams {
  action: "create" | "update" | "publish" | "unpublish" | "delete";
  entityType: string;
  entityId?: string;
  userId?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Record an append-only snapshot of a CMS entity in content_revisions.
 * Calculates next revisionNumber sequentially for the given entity.
 */
export async function recordContentRevision({
  entityType,
  entityId,
  snapshot,
  authorId,
  changeSummary,
}: RecordRevisionParams) {
  try {
    const db = getDb();
    // Query highest current revision number
    const latest = await db
      .select({ revisionNumber: schema.contentRevisions.revisionNumber })
      .from(schema.contentRevisions)
      .where(
        and(
          eq(schema.contentRevisions.entityType, entityType),
          eq(schema.contentRevisions.entityId, entityId)
        )
      )
      .orderBy(desc(schema.contentRevisions.revisionNumber))
      .limit(1);

    const nextRevision = (latest[0]?.revisionNumber || 0) + 1;

    await db.insert(schema.contentRevisions).values({
      entityType,
      entityId,
      revisionNumber: nextRevision,
      snapshot,
      authorId: authorId || null,
      changeSummary: changeSummary || `Revision ${nextRevision}`,
    });

    return nextRevision;
  } catch (error) {
    // Non-fatal logging failure fallback: do not crash the primary mutation if logging encounters a minor non-fatal issue,
    // but log error to stderr.
    console.error("[CMS-Audit] Failed to record content revision:", error);
    return null;
  }
}

/**
 * Record an administrative activity in activity_logs with server-derived user attribution.
 */
export async function recordActivityLog({
  action,
  entityType,
  entityId,
  userId,
  metadata,
}: RecordActivityParams) {
  try {
    const db = getDb();
    await db.insert(schema.activityLogs).values({
      action,
      entityType,
      entityId: entityId || null,
      userId: userId || null,
      metadata: metadata || null,
    });
  } catch (error) {
    console.error("[CMS-Audit] Failed to record activity log:", error);
  }
}
