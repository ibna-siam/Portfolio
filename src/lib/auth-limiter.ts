/**
 * Server-Side Authentication Attempt Limiter & Brute-Force Protection
 *
 * Implements a time-windowed attempt tracker to protect administrative sign-in
 * against credential-stuffing and repeated password guessing attacks.
 *
 * Policy:
 * - Maximum 5 failed attempts per identifier within a 15-minute sliding window.
 * - When 5 attempts are exceeded, the identifier is locked for 15 minutes.
 * - Successful authentication clears the failed attempt count.
 */

interface AttemptRecord {
  count: number;
  firstAttemptAt: number;
  lockedUntil: number | null;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const SWEEP_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

const attemptsMap = new Map<string, AttemptRecord>();

// Periodic cleanup of stale entries to prevent memory leaks
let lastSweep = Date.now();
function sweepStaleRecords() {
  const now = Date.now();
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;

  for (const [key, record] of attemptsMap.entries()) {
    const isExpiredLock = record.lockedUntil !== null && now > record.lockedUntil;
    const isExpiredWindow = now - record.firstAttemptAt > LOCKOUT_WINDOW_MS;
    if (isExpiredLock || (record.lockedUntil === null && isExpiredWindow)) {
      attemptsMap.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
}

/**
 * Checks whether an identifier (e.g. normalized email or IP) is allowed to attempt login.
 */
export function checkLoginRateLimit(identifier: string): RateLimitResult {
  sweepStaleRecords();
  const key = identifier.toLowerCase().trim();
  const record = attemptsMap.get(key);
  const now = Date.now();

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  // Check active lockout
  if (record.lockedUntil !== null) {
    if (now < record.lockedUntil) {
      const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
    }
    // Lockout has elapsed, reset record
    attemptsMap.delete(key);
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  // Check if window expired without lockout
  if (now - record.firstAttemptAt > LOCKOUT_WINDOW_MS) {
    attemptsMap.delete(key);
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - record.count);
  return { allowed: remaining > 0, remainingAttempts: remaining };
}

/**
 * Records a failed login attempt for the given identifier.
 * Locks the identifier if failed attempts exceed MAX_FAILED_ATTEMPTS.
 */
export function recordFailedLoginAttempt(identifier: string): {
  isLocked: boolean;
  retryAfterSeconds?: number;
  currentAttempts: number;
} {
  sweepStaleRecords();
  const key = identifier.toLowerCase().trim();
  const now = Date.now();
  let record = attemptsMap.get(key);

  if (!record || now - record.firstAttemptAt > LOCKOUT_WINDOW_MS) {
    record = {
      count: 1,
      firstAttemptAt: now,
      lockedUntil: null,
    };
    attemptsMap.set(key, record);
    return { isLocked: false, currentAttempts: 1 };
  }

  record.count += 1;

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_WINDOW_MS;
    const retryAfterSeconds = Math.ceil(LOCKOUT_WINDOW_MS / 1000);
    return {
      isLocked: true,
      retryAfterSeconds,
      currentAttempts: record.count,
    };
  }

  return {
    isLocked: false,
    currentAttempts: record.count,
  };
}

/**
 * Resets failed attempts upon successful authentication.
 */
export function resetLoginAttempts(identifier: string): void {
  const key = identifier.toLowerCase().trim();
  attemptsMap.delete(key);
}

/**
 * Test helper for verification suite.
 */
export function _resetAllAttemptsForTesting(): void {
  attemptsMap.clear();
}
