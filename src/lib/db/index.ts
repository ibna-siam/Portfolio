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

let _cachedDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

/**
 * Database client singleton.
 * Evaluates connection lazily and reuses the cached Drizzle client instance
 * across warm serverless executions to benefit from HTTP keep-alive.
 */
export function getDb() {
  const conn = process.env.DATABASE_URL || connectionString;
  if (!conn) {
    throw new Error(
      "DATABASE_URL is not set. Please configure DATABASE_URL in your server environment."
    );
  }
  if (!_cachedDb) {
    const sql = neon(conn);
    _cachedDb = drizzle(sql, { schema });
  }
  return _cachedDb;
}

// Export pre-initialized client when connectionString is present
export const db = connectionString ? drizzle(neon(connectionString), { schema }) : null;

export { schema };
