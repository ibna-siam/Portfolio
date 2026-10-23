"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import {
  ALLOWED_IMAGE_FORMATS,
  type AllowedImageFormat,
  DEFAULT_MEDIA_FOLDER,
  MAX_UPLOAD_BYTES,
  destroyCloudinaryAsset,
  generateSignedUploadParams,
  getCloudinaryStatus,
  verifyCloudinaryResponseSignature,
} from "@/lib/cloudinary";

export interface ServerActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 1. Generates a signed Cloudinary upload ticket for direct browser upload.
 * Strictly verifies admin role and scopes the ticket to the authorized media folder.
 */
export async function getUploadSignatureAction(): Promise<
  ServerActionResult<{
    signature: string;
    timestamp: number;
    folder: string;
    apiKey: string;
    cloudName: string;
  }>
> {
  try {
    await requireAdmin();

    const status = getCloudinaryStatus();
    if (!status.isConfigured) {
      return {
        success: false,
        error:
          status.error ||
          "Cloudinary credentials are not configured in server environment.",
      };
    }

    const ticket = generateSignedUploadParams(DEFAULT_MEDIA_FOLDER);
    return { success: true, data: ticket };
  } catch (err) {
    console.error("[MEDIA_ACTION] Failed to generate upload signature:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to generate upload signature.",
    };
  }
}

export interface RegisterMediaPayload {
  public_id: string;
  version: number | string;
  signature: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  secure_url: string;
  alt_text?: string;
}

/**
 * 2. Validates and registers an uploaded Cloudinary asset into the PostgreSQL database.
 * Strictly verifies the Cloudinary cryptographic response signature before trusting metadata.
 */
export async function registerMediaAssetAction(
  payload: RegisterMediaPayload
): Promise<ServerActionResult<typeof schema.mediaAssets.$inferSelect>> {
  try {
    await requireAdmin();

    // 1. Structural validation
    if (
      !payload.public_id ||
      !payload.version ||
      !payload.signature ||
      !payload.secure_url
    ) {
      return { success: false, error: "Incomplete upload response payload." };
    }

    // 2. Format validation
    const normalizedFormat = payload.format.toLowerCase();
    if (!ALLOWED_IMAGE_FORMATS.includes(normalizedFormat as AllowedImageFormat)) {
      return {
        success: false,
        error: `Invalid file format '${normalizedFormat}'. Allowed formats: ${ALLOWED_IMAGE_FORMATS.join(", ")}.`,
      };
    }

    // 3. File size validation
    if (!payload.bytes || payload.bytes <= 0 || payload.bytes > MAX_UPLOAD_BYTES) {
      return {
        success: false,
        error: `File size exceeds the 5 MB limit (received ${(payload.bytes / 1024 / 1024).toFixed(2)} MB).`,
      };
    }

    // 4. URL scheme & domain validation
    if (!payload.secure_url.startsWith("https://res.cloudinary.com/")) {
      return {
        success: false,
        error: "Untrusted secure URL. Must originate from Cloudinary secure domain.",
      };
    }

    // 5. Cryptographic signature verification
    const isValidSignature = verifyCloudinaryResponseSignature(
      payload.public_id,
      payload.version,
      payload.signature
    );

    if (!isValidSignature) {
      console.error(
        "[MEDIA_SECURITY] Rejected unverified or tampered Cloudinary payload:",
        payload.public_id
      );
      return {
        success: false,
        error:
          "Security verification failed: Returned Cloudinary upload signature is invalid.",
      };
    }

    // 6. Database persistence with conflict-aware upsert
    const db = getDb();
    const sanitizedAlt = payload.alt_text ? payload.alt_text.trim().slice(0, 500) : null;

    const [persisted] = await db
      .insert(schema.mediaAssets)
      .values({
        publicId: payload.public_id,
        secureUrl: payload.secure_url,
        format: normalizedFormat,
        width: payload.width || null,
        height: payload.height || null,
        bytes: payload.bytes,
        altText: sanitizedAlt,
        folder: DEFAULT_MEDIA_FOLDER,
      })
      .onConflictDoUpdate({
        target: schema.mediaAssets.publicId,
        set: {
          secureUrl: payload.secure_url,
          format: normalizedFormat,
          width: payload.width || null,
          height: payload.height || null,
          bytes: payload.bytes,
          altText: sanitizedAlt,
          updatedAt: new Date(),
        },
      })
      .returning();

    revalidatePath("/admin/media");
    return { success: true, data: persisted };
  } catch (err) {
    console.error("[MEDIA_ACTION] Failed to register media asset:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Database registration failed.",
    };
  }
}

/**
 * 3. Updates alternative text (altText) for accessibility compliance.
 */
export async function updateMediaAssetAltTextAction(
  id: string,
  altText: string
): Promise<ServerActionResult> {
  try {
    await requireAdmin();

    const sanitizedAlt = altText.trim().slice(0, 500);
    const db = getDb();

    const [updated] = await db
      .update(schema.mediaAssets)
      .set({
        altText: sanitizedAlt || null,
        updatedAt: new Date(),
      })
      .where(eq(schema.mediaAssets.id, id))
      .returning({ id: schema.mediaAssets.id });

    if (!updated) {
      return { success: false, error: "Asset not found in database." };
    }

    revalidatePath("/admin/media");
    return { success: true };
  } catch (err) {
    console.error("[MEDIA_ACTION] Failed to update alt text:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update alt text.",
    };
  }
}

/**
 * 4. Deletes a media asset safely from Cloudinary and PostgreSQL.
 * Validates reference usage to prevent breaking published portfolio content.
 */
export async function deleteMediaAssetAction(id: string): Promise<ServerActionResult> {
  try {
    await requireAdmin();

    const db = getDb();

    // 1. Retrieve the existing asset record
    const [asset] = await db
      .select()
      .from(schema.mediaAssets)
      .where(eq(schema.mediaAssets.id, id))
      .limit(1);

    if (!asset) {
      return { success: false, error: "Asset not found in database." };
    }

    // 2. Reference Integrity Guard: Check if asset is used in published site settings
    const [settings] = await db.select().from(schema.siteSettings).limit(1);
    if (settings) {
      if (
        (settings.avatarUrl && settings.avatarUrl.includes(asset.publicId)) ||
        (settings.resumeUrl && settings.resumeUrl.includes(asset.publicId))
      ) {
        return {
          success: false,
          error:
            "Deletion blocked: This asset is currently referenced by published Site Profile settings.",
        };
      }
    }

    // 3. Remove from Cloudinary provider
    try {
      const cloudResult = await destroyCloudinaryAsset(asset.publicId);
      if (cloudResult.result !== "ok" && cloudResult.result !== "not found") {
        console.warn("[CLOUDINARY] Destroy returned non-ok result:", cloudResult);
      }
    } catch (cloudErr) {
      console.error("[CLOUDINARY] Failed to destroy asset in Cloudinary:", cloudErr);
      return {
        success: false,
        error: "Cloudinary provider deletion failed. Database record preserved.",
      };
    }

    // 4. Remove database record only after Cloudinary confirmation
    await db.delete(schema.mediaAssets).where(eq(schema.mediaAssets.id, id));

    revalidatePath("/admin/media");
    return { success: true };
  } catch (err) {
    console.error("[MEDIA_ACTION] Failed to delete media asset:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete asset.",
    };
  }
}
