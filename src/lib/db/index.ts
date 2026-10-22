import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Server-Side Database Connection Module (Neon PostgreSQL + Drizzle ORM)
 *
 * Security & Isolation Rules:
 * 1. This module must NEVER be imported or executed in client components.
 * 2. DATABASE_URL must remain strictly server-side (never prefixed with NEXT_PUBLIC_).
 * 3. Graceful fallback ensures build-time pages compile cleanly even before credentials are set.
 */

// Explicit runtime safety check to prevent accidental inclusion in client bundles
if (typeof window !== "undefined") {
  throw new Error("CRITICAL: Database module cannot be imported in client-side runtime.");
}

const connectionString = process.env.DATABASE_URL;

/**
 * Database client singleton.
 * Evaluates connection lazily to ensure build steps and offline checks do not fail when
 * DATABASE_URL has not yet been provisioned.
 */
export function getDb() {
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Please configure DATABASE_URL in your server environment."
    );
  }
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

// Export pre-initialized client when connectionString is present
export const db = connectionString ? drizzle(neon(connectionString), { schema }) : null;

export { schema };
