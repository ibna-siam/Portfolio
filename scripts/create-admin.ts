import * as dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

import * as schema from "../src/lib/db/schema";

dotenv.config({ path: ".env.local" });
dotenv.config();

/**
 * Secure Initial Administrator Provisioning & Credential Rotation Tool
 *
 * Usage:
 *   npx tsx scripts/create-admin.ts --email admin@example.com --password "SecurePassphrase123!" [--name "Admin Name"] [--update] [--dry-run]
 *
 * Or via environment variables:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD="SecurePassphrase123!" npx tsx scripts/create-admin.ts [--update]
 *
 * Security Policies:
 * - Passwords are never logged, displayed, or persisted in plaintext.
 * - Minimum password length: 10 characters.
 * - Hashed with bcrypt (cost factor 12).
 * - Existing administrator accounts cannot be overwritten without explicit '--update' flag.
 * - Exits with status 1 on validation failure.
 */

function parseArgs() {
  const args = process.argv.slice(2);
  const options: {
    email?: string;
    password?: string;
    name?: string;
    update?: boolean;
    dryRun?: boolean;
  } = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--email" && i + 1 < args.length) {
      options.email = args[++i];
    } else if (arg === "--password" && i + 1 < args.length) {
      options.password = args[++i];
    } else if (arg === "--name" && i + 1 < args.length) {
      options.name = args[++i];
    } else if (arg === "--update") {
      options.update = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    }
  }

  return options;
}

async function main() {
  console.log("\n=======================================================");
  console.log("  ADMINISTRATOR PROVISIONING & ROTATION TOOL");
  console.log("=======================================================\n");

  const args = parseArgs();
  const rawEmail = args.email || process.env.ADMIN_EMAIL;
  const rawPassword = args.password || process.env.ADMIN_PASSWORD;
  const rawName = args.name || process.env.ADMIN_NAME || "Administrator";
  const shouldUpdate = !!args.update;
  const isDryRun = !!args.dryRun;

  if (!rawEmail || !rawPassword) {
    console.error("ERROR: Administrator email and password are required.");
    console.error("\nUsage options:");
    console.error("  1. CLI Flags:     --email <email> --password <password> [--update]");
    console.error("  2. Env Variables: ADMIN_EMAIL=<email> ADMIN_PASSWORD=<password> npx tsx scripts/create-admin.ts\n");
    process.exit(1);
  }

  const email = rawEmail.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error("ERROR: Provided email is not a valid email address format.");
    process.exit(1);
  }

  if (rawPassword.length < 10) {
    console.error("ERROR: Password must be at least 10 characters in length.");
    process.exit(1);
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("ERROR: DATABASE_URL is not set in environment.");
    process.exit(1);
  }

  const sql = neon(connectionString);
  const db = drizzle(sql, { schema });

  // Verify database connection and identity
  const [dbInfo] = await sql`SELECT current_database() as db_name, current_user as db_user;`;
  console.log(`Target Database: ${dbInfo.db_name} (User: ${dbInfo.db_user})`);
  console.log(`Target Email:    ${email}`);
  console.log(`Action Mode:     ${shouldUpdate ? "CREATE OR ROTATE" : "SAFE IDEMPOTENT CREATE"}`);
  if (isDryRun) {
    console.log("Dry Run Mode:    ACTIVE (No database mutations will be applied)\n");
  }

  // Check if admin user already exists
  const existingUsers = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      role: schema.users.role,
      createdAt: schema.users.createdAt,
    })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  const existing = existingUsers[0];

  if (existing) {
    if (!shouldUpdate) {
      console.log(`\n[IDEMPOTENT] Administrator account '${email}' already exists.`);
      console.log(`- User ID: ${existing.id}`);
      console.log(`- Role:    ${existing.role}`);
      console.log(`- Created: ${existing.createdAt.toISOString()}`);
      console.log("\nTo rotate this administrator's password, re-run with the '--update' flag.");
      console.log("No changes have been made.");
      return;
    }

    console.log(`\nRotating credentials for existing administrator '${email}'...`);
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(rawPassword, saltRounds);

    if (isDryRun) {
      console.log("[DRY-RUN] Verified hash generation (bcrypt-12). Skipped database UPDATE.");
      return;
    }

    await db
      .update(schema.users)
      .set({
        passwordHash,
        name: rawName,
        role: "admin",
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, existing.id));

    console.log(`\n[SUCCESS] Administrator credentials updated successfully.`);
    console.log(`- User ID: ${existing.id}`);
    console.log(`- Email:   ${email}`);
    console.log(`- Role:    admin`);
    console.log(`- Action:  Password hash rotated with bcrypt cost factor 12.`);
    return;
  }

  // Create new administrator account
  console.log(`\nCreating new administrator account for '${email}'...`);
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(rawPassword, saltRounds);

  if (isDryRun) {
    console.log("[DRY-RUN] Verified hash generation (bcrypt-12). Skipped database INSERT.");
    return;
  }

  const [created] = await db
    .insert(schema.users)
    .values({
      email,
      name: rawName,
      role: "admin",
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({
      id: schema.users.id,
      email: schema.users.email,
      role: schema.users.role,
    });

  console.log(`\n[SUCCESS] Initial administrator created successfully.`);
  console.log(`- User ID: ${created.id}`);
  console.log(`- Email:   ${created.email}`);
  console.log(`- Role:    ${created.role}`);
  console.log(`- Action:  Hashed password stored securely with bcrypt cost factor 12.`);
  console.log("=======================================================\n");
}

main().catch((err) => {
  console.error("FATAL: Administrator provisioning failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
