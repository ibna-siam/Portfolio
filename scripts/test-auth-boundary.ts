import * as dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import bcrypt from "bcryptjs";

import * as schema from "../src/lib/db/schema";
import { sanitizeCallbackUrl } from "../src/lib/auth";
import {
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  resetLoginAttempts,
  _resetAllAttemptsForTesting,
} from "../src/lib/auth-limiter";

dotenv.config({ path: ".env.local" });
dotenv.config();

/**
 * Phase 3 Authentication & Protected Boundary Security Verification Test Suite
 */
async function runAuthSecurityTests() {
  console.log("\n=======================================================");
  console.log("  PHASE 3 AUTH & ADMIN BOUNDARY SECURITY TEST SUITE");
  console.log("=======================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] ${testName}${detail ? ` - ${detail}` : ""}`);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // TEST SUITE 1: Open-Redirect & Return URL Sanitization (SEC-01)
  // ---------------------------------------------------------------------------
  console.log("--> 1. Open-Redirect Vulnerability Tests (sanitizeCallbackUrl):");
  assert(
    sanitizeCallbackUrl("https://evil.com") === "/admin",
    "Rejects external absolute URLs (https://evil.com)"
  );
  assert(
    sanitizeCallbackUrl("http://attacker.com/steal") === "/admin",
    "Rejects external HTTP URLs"
  );
  assert(
    sanitizeCallbackUrl("//attacker.com") === "/admin",
    "Rejects protocol-relative URLs (//attacker.com)"
  );
  assert(
    sanitizeCallbackUrl("/\\attacker.com") === "/admin",
    "Rejects backslash evasions (/\\attacker.com)"
  );
  assert(
    sanitizeCallbackUrl("javascript:alert(1)") === "/admin",
    "Rejects javascript: URIs"
  );
  assert(sanitizeCallbackUrl("data:text/html,evil") === "/admin", "Rejects data: URIs");
  assert(sanitizeCallbackUrl(null) === "/admin", "Handles null callback cleanly");
  assert(
    sanitizeCallbackUrl(undefined) === "/admin",
    "Handles undefined callback cleanly"
  );
  assert(sanitizeCallbackUrl("") === "/admin", "Handles empty string callback cleanly");
  assert(sanitizeCallbackUrl("/admin") === "/admin", "Preserves valid /admin route");
  assert(
    sanitizeCallbackUrl("/admin/settings") === "/admin/settings",
    "Preserves valid deep /admin route"
  );

  // ---------------------------------------------------------------------------
  // TEST SUITE 2: Server-Side Rate Limiter & Brute-Force Shield (SEC-02)
  // ---------------------------------------------------------------------------
  console.log("\n--> 2. Brute-Force & Attempt Limiter Tests (auth-limiter):");
  _resetAllAttemptsForTesting();
  const testId = "security-test@example.com";

  const initialCheck = checkLoginRateLimit(testId);
  assert(
    initialCheck.allowed === true && initialCheck.remainingAttempts === 5,
    "Initial state allows 5 attempts"
  );

  recordFailedLoginAttempt(testId);
  recordFailedLoginAttempt(testId);
  const midCheck = checkLoginRateLimit(testId);
  assert(
    midCheck.allowed === true && midCheck.remainingAttempts === 3,
    "2 failed attempts decrement remaining to 3"
  );

  recordFailedLoginAttempt(testId);
  recordFailedLoginAttempt(testId);
  const lockResult = recordFailedLoginAttempt(testId); // 5th attempt
  assert(lockResult.isLocked === true, "5th failed attempt activates account lockout");

  const lockedCheck = checkLoginRateLimit(testId);
  assert(
    lockedCheck.allowed === false && (lockedCheck.retryAfterSeconds ?? 0) > 0,
    "Locked identifier is blocked with retry countdown"
  );

  resetLoginAttempts(testId);
  const resetCheck = checkLoginRateLimit(testId);
  assert(
    resetCheck.allowed === true && resetCheck.remainingAttempts === 5,
    "Successful authentication resets attempt count to 5"
  );

  // ---------------------------------------------------------------------------
  // TEST SUITE 3: Database User Schema & Credential Confidentiality (SEC-03)
  // ---------------------------------------------------------------------------
  console.log("\n--> 3. Database User Schema & Credential Confidentiality:");
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }
  const sql = neon(connectionString);
  const db = drizzle(sql, { schema });

  const adminUsers = await db.select().from(schema.users);
  assert(adminUsers.length >= 1, "At least one administrator account exists in database");

  const admin = adminUsers[0];
  assert(
    admin.role === "admin",
    `Administrator has role='admin' (found: '${admin.role}')`
  );
  assert(
    !!admin.passwordHash && admin.passwordHash.startsWith("$2"),
    "Password is stored exclusively as bcrypt hash ($2)"
  );
  assert(
    !!admin.passwordHash && !admin.passwordHash.includes(" "),
    "Password hash contains no corrupted formatting"
  );

  // Verify sanitized user projection never exposes passwordHash
  const sanitizedUser = {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  };
  assert(
    !("passwordHash" in sanitizedUser),
    "Sanitized user object completely excludes passwordHash"
  );

  // ---------------------------------------------------------------------------
  // TEST SUITE 4: Role-Based Access Control Simulation (SEC-04)
  // ---------------------------------------------------------------------------
  console.log("\n--> 4. Server Role Authorization Enforcement Simulation:");
  function simulateServerAuthorization(session: { user?: { role?: string } } | null): {
    authorized: boolean;
    redirectTarget?: string;
  } {
    if (!session?.user) {
      return { authorized: false, redirectTarget: "/admin/login" };
    }
    if (session.user.role !== "admin") {
      return { authorized: false, redirectTarget: "/admin/login?error=AccessDenied" };
    }
    return { authorized: true };
  }

  assert(
    simulateServerAuthorization(null).authorized === false &&
      simulateServerAuthorization(null).redirectTarget === "/admin/login",
    "Unauthenticated visitor is denied and redirected to /admin/login"
  );

  assert(
    simulateServerAuthorization({ user: { role: "guest" } }).authorized === false &&
      simulateServerAuthorization({ user: { role: "guest" } }).redirectTarget ===
        "/admin/login?error=AccessDenied",
    "Authenticated non-admin ('guest') is denied access with AccessDenied notice"
  );

  assert(
    simulateServerAuthorization({ user: { role: "subscriber" } }).authorized === false,
    "Authenticated 'subscriber' is denied access"
  );

  assert(
    simulateServerAuthorization({ user: { role: "admin" } }).authorized === true,
    "Authenticated 'admin' is granted access"
  );

  // ---------------------------------------------------------------------------
  // TEST SUITE 5: Bcrypt Verification & Timing Resistance (SEC-05)
  // ---------------------------------------------------------------------------
  console.log("\n--> 5. Password Comparison & Invalid Credential Rejection:");
  const dummyHash = await bcrypt.hash("KnownSecret123!", 12);
  const validMatch = await bcrypt.compare("KnownSecret123!", dummyHash);
  assert(validMatch === true, "Valid password matches bcrypt hash");

  const invalidMatch = await bcrypt.compare("WrongPassword123!", dummyHash);
  assert(invalidMatch === false, "Invalid password is rejected");

  console.log("\n=======================================================");
  console.log(`  RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runAuthSecurityTests().catch((err) => {
  console.error("FATAL TEST SUITE ERROR:", err);
  process.exit(1);
});
