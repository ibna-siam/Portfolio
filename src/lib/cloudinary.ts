import { v2 as cloudinary } from "cloudinary";

/**
 * Server-Side Cloudinary Media Management Module
 *
 * Security & Isolation Rules:
 * 1. This module must NEVER be imported or executed in client components.
 * 2. CLOUDINARY_API_SECRET is strictly confidential and must never be exposed.
 * 3. Graceful fallback ensures pages and builds compile cleanly even when credentials are unconfigured.
 */

// Runtime safety check to prevent inclusion in client bundles
if (typeof window !== "undefined") {
  throw new Error(
    "CRITICAL: Cloudinary server module cannot be imported in client-side runtime."
  );
}

export interface CloudinaryConfigStatus {
  isConfigured: boolean;
  cloudName?: string;
  apiKey?: string;
  error?: string;
}

/**
 * Validates whether all required Cloudinary environment variables are present.
 * Never throws, allowing UI components to render safe diagnostic alerts.
 */
export function getCloudinaryStatus(): CloudinaryConfigStatus {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    const missing: string[] = [];
    if (!cloudName) missing.push("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
    if (!apiKey) missing.push("CLOUDINARY_API_KEY");
    if (!apiSecret) missing.push("CLOUDINARY_API_SECRET");

    return {
      isConfigured: false,
      error: `Cloudinary credentials incomplete. Missing: ${missing.join(", ")}`,
    };
  }

  return {
    isConfigured: true,
    cloudName,
    apiKey,
  };
}

/**
 * Initializes and returns the configured Cloudinary SDK instance.
 * Throws a clean error if credentials are not configured.
 */
export function getCloudinaryClient() {
  const status = getCloudinaryStatus();
  if (!status.isConfigured || !status.cloudName || !status.apiKey) {
    throw new Error(
      status.error ||
        "Cloudinary configuration is incomplete. Please set credentials in .env."
    );
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  cloudinary.config({
    cloud_name: status.cloudName,
    api_key: status.apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

export const ALLOWED_IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp"] as const;
export type AllowedImageFormat = (typeof ALLOWED_IMAGE_FORMATS)[number];
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
export const DEFAULT_MEDIA_FOLDER = "portfolio/media";

/**
 * Generates a signed upload ticket for direct, authenticated browser-to-Cloudinary upload.
 * Strictly restricts the upload target to the designated portfolio media folder.
 */
export function generateSignedUploadParams(targetFolder: string = DEFAULT_MEDIA_FOLDER) {
  const status = getCloudinaryStatus();
  if (!status.isConfigured || !status.cloudName || !status.apiKey) {
    throw new Error(status.error || "Cloudinary is not configured.");
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const timestamp = Math.round(Date.now() / 1000);

  // Strictly enforce folder namespace (prevents directory traversal or arbitrary folder uploads)
  const safeFolder =
    targetFolder === DEFAULT_MEDIA_FOLDER ? DEFAULT_MEDIA_FOLDER : DEFAULT_MEDIA_FOLDER;

  const paramsToSign = {
    folder: safeFolder,
    timestamp,
  };

  const client = getCloudinaryClient();
  const signature = client.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    signature,
    timestamp,
    folder: safeFolder,
    apiKey: status.apiKey,
    cloudName: status.cloudName,
  };
}

/**
 * Verifies the authenticity of Cloudinary's returned upload response.
 * Uses official Cloudinary signature comparison to prevent forged metadata registration.
 */
export function verifyCloudinaryResponseSignature(
  publicId: string,
  version: number | string,
  returnedSignature: string
): boolean {
  try {
    const status = getCloudinaryStatus();
    if (!status.isConfigured) return false;

    const client = getCloudinaryClient();
    const utils = client.utils as unknown as {
      verify_api_response_signature?: (
        public_id: string,
        version: string,
        signature: string
      ) => boolean;
      api_sign_request: (
        params: Record<string, string | number>,
        secret: string
      ) => string;
    };

    if (typeof utils.verify_api_response_signature === "function") {
      return utils.verify_api_response_signature(
        publicId,
        version.toString(),
        returnedSignature
      );
    }

    const apiSecret = process.env.CLOUDINARY_API_SECRET!;
    const expected = utils.api_sign_request(
      { public_id: publicId, version: version.toString() },
      apiSecret
    );
    return returnedSignature === expected;
  } catch (err) {
    console.error(
      "[CLOUDINARY] Signature verification failed:",
      err instanceof Error ? err.message : err
    );
    return false;
  }
}

/**
 * Deletes an asset from Cloudinary by its public ID.
 */
export async function destroyCloudinaryAsset(publicId: string) {
  const client = getCloudinaryClient();
  const result = await client.uploader.destroy(publicId, {
    invalidate: true,
    resource_type: "image",
  });
  return result;
}
