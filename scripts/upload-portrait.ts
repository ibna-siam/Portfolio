import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "../src/lib/db/schema";
import {
  getCloudinaryStatus,
  getCloudinaryClient,
  DEFAULT_MEDIA_FOLDER,
} from "../src/lib/cloudinary";

dotenv.config({ path: ".env.local" });
dotenv.config();

/**
 * Script to safely upload Siam's local portrait asset to Cloudinary
 * and register it in the PostgreSQL media_assets registry.
 *
 * Guardrails:
 * 1. Preserves local src/assets/siam.jpeg untouched.
 * 2. Does NOT modify public-site references in Hero.jsx or portfolioData.js in Phase 4.
 * 3. Idempotent: If already registered, updates metadata without duplication.
 */
async function uploadPortrait() {
  console.log("\n=======================================================");
  console.log("  CLOUDINARY PORTRAIT ASSET UPLOAD & REGISTRATION");
  console.log("=======================================================\n");

  const portraitPath = path.resolve(process.cwd(), "src/assets/siam.jpeg");
  if (!fs.existsSync(portraitPath)) {
    console.error("ERROR: Local portrait file not found at:", portraitPath);
    process.exit(1);
  }

  const fileStats = fs.statSync(portraitPath);
  console.log(
    `Local Asset Found: src/assets/siam.jpeg (${(fileStats.size / 1024).toFixed(1)} KB)`
  );

  const status = getCloudinaryStatus();
  if (!status.isConfigured) {
    console.error("ERROR: Cloudinary credentials are not configured in .env.");
    process.exit(1);
  }

  const client = getCloudinaryClient();
  const ping = await client.api.ping();
  console.log(
    "Cloudinary Connection:",
    ping.status === "ok" ? "VERIFIED (HTTP 200 OK)" : "FAILED"
  );

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("ERROR: DATABASE_URL not set in environment.");
    process.exit(1);
  }

  const sql = neon(connectionString);
  const db = drizzle(sql, { schema });

  const targetPublicId = `${DEFAULT_MEDIA_FOLDER}/siam_portrait`;
  console.log(`Target Cloudinary Public ID: ${targetPublicId}`);

  // Upload to Cloudinary preserving full original quality
  console.log("Uploading asset to Cloudinary...");
  const uploadResult = await client.uploader.upload(portraitPath, {
    public_id: "siam_portrait",
    folder: DEFAULT_MEDIA_FOLDER,
    overwrite: true,
    resource_type: "image",
    format: "jpg",
  });

  console.log("Cloudinary Upload Successful:");
  console.log(`- Public ID:  ${uploadResult.public_id}`);
  console.log(`- Format:     ${uploadResult.format}`);
  console.log(`- Dimensions: ${uploadResult.width} x ${uploadResult.height}`);
  console.log(
    `- Bytes:      ${uploadResult.bytes} (${(uploadResult.bytes / 1024).toFixed(1)} KB)`
  );
  console.log(`- Secure URL: ${uploadResult.secure_url}`);

  // Register in PostgreSQL media_assets table
  console.log("\nRegistering asset in PostgreSQL media_assets table...");
  const [persisted] = await db
    .insert(schema.mediaAssets)
    .values({
      publicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
      bytes: uploadResult.bytes,
      altText: "Md Ibna Siam — Professional Portrait",
      folder: DEFAULT_MEDIA_FOLDER,
    })
    .onConflictDoUpdate({
      target: schema.mediaAssets.publicId,
      set: {
        secureUrl: uploadResult.secure_url,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes,
        altText: "Md Ibna Siam — Professional Portrait",
        updatedAt: new Date(),
      },
    })
    .returning();

  console.log("\n[SUCCESS] Portrait successfully registered in media_assets:");
  console.log(`- Database ID: ${persisted.id}`);
  console.log(`- Public ID:   ${persisted.publicId}`);
  console.log(`- Alt Text:    ${persisted.altText}`);
  console.log("=======================================================\n");
}

uploadPortrait().catch((err) => {
  console.error("FATAL ERROR uploading portrait:", err);
  process.exit(1);
});
