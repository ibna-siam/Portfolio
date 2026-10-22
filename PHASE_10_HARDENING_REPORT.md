# Phase 10 — Production Hardening, Monitoring & Recovery Readiness Report

**Document Version:** 1.0.0  
**Audit Date:** October 22, 2026  
**Auditor / Lead Engineer:** Senior Systems Architect & Security Engineering Lead  
**Repository:** `https://github.com/ibna-siam/Portfolio`  
**Target Environment:** Production (`https://ibnasiam.vercel.app/`)  
**Active Production Branch:** `main` (commit `9387aca` / `b2fe797`)  
**Audit Classification:** **HARDENING COMPLETE**  

---

## 1. Executive Summary

Phase 10 conducted an audit-first production hardening, monitoring establishment, and recovery readiness review for Siam's Personal Portfolio and CMS. The objective was to strengthen application resilience, eliminate latent privilege escalation vectors, define an operational recovery plan, and establish observability without disrupting live traffic or altering academic/financial portfolio content.

Key achievements during Phase 10:
1. **Authentication Privilege Hardening:** Neutralized a latent privilege escalation vector in `src/auth.config.ts` and `src/lib/db/schema.ts` where unassigned user roles defaulted to `"admin"`. The fallback is now strictly set to `"user"` adhering to the principle of least privilege.
2. **HTTP Security Headers & Content Security Policy:** Enhanced `next.config.ts` with strict security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, `HSTS`) and a robust Content Security Policy (CSP) compatible with Cloudinary, Formspree, and Next.js server rendering.
3. **Admin Cache-Control:** Configured `Cache-Control: no-store, no-cache, must-revalidate` across all `/admin/:path*` routes in `next.config.ts` to prevent administrative screens from being cached at edge routers or shared intermediate proxies.
4. **App Router Error Shielding:** Implemented `src/app/error.tsx` and `src/app/global-error.tsx` styled in Executive Claymorphism. These error boundaries trap unexpected runtime exceptions, hide database schemas and stack traces from visitors, and provide a user-friendly retry experience.
5. **Real-User Performance Telemetry:** Integrated Vercel `<SpeedInsights />` into `src/app/layout.tsx` for real-user Core Web Vitals monitoring (LCP, INP, CLS) with zero external script bloat.
6. **Operational Documentation Suite:** Authored [OPERATIONS_RUNBOOK.md](file:///d:/Project/portfolio%20siam/OPERATIONS_RUNBOOK.md), [INCIDENT_RESPONSE_PLAN.md](file:///d:/Project/portfolio%20siam/INCIDENT_RESPONSE_PLAN.md), and [BACKUP_AND_RECOVERY_PLAN.md](file:///d:/Project/portfolio%20siam/BACKUP_AND_RECOVERY_PLAN.md).

---

## 2. Authentication & Authorization Hardening Audit

Each of the five targeted security investigations was audited in the codebase:

### 1. Default Role on User Creation
- **Initial Finding:** In `src/lib/db/schema.ts` line 23, `users.role` was declared as `.default("admin")`. In `src/auth.config.ts` line 55 and 64, missing roles defaulted to `?? "admin"`. While the application has no public registration endpoint and only provisions admins via `scripts/create-admin.ts`, any accidental user insert without an explicit role would have inherited full administrator privileges.
- **Remediation Implemented:**
  - `src/auth.config.ts` updated to default to `"user"` (`token.role = user.role ?? "user"`).
  - `src/lib/db/schema.ts` updated to default to `"user"` (`role: varchar("role").default("user")`).
- **Owner Action Required for Production:** To align the production PostgreSQL database default constraint, an `ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';` schema update is recommended for owner approval.

### 2. Privileged Server Action Authorization Independence
- **Audit Result:** **VERIFIED SECURE.** Every single administrative server action in the codebase independently verifies authorization on the server:
  - `src/app/(admin)/admin/case-studies/actions.ts`: `await requireAdmin()`
  - `src/app/(admin)/admin/competencies/actions.ts`: `await requireAdmin()`
  - `src/app/(admin)/admin/academic-journey/actions.ts`: `await requireAdmin()`
  - `src/app/(admin)/admin/tech-solutions/actions.ts`: `await requireAdmin()`
  - `src/app/(admin)/admin/media/actions.ts`: `await requireAdmin()`
- **Assessment:** No server action relies solely on middleware or hidden UI buttons. Even if middleware were bypassed, all data mutations reject unauthorized callers with server redirects or permission errors.

### 3. Login Rate Limiting Across Serverless Instances
- **Audit Result:** **PROCESS-LOCAL IN-MEMORY.**
  - `src/lib/auth-limiter.ts` uses an in-memory `Map<string, AttemptRecord>()`.
  - In a multi-instance serverless environment (such as Vercel AWS Lambda / Edge instances), each compute container maintains its own memory space. An attacker rotating requests across instances could theoretically bypass the 5-attempt threshold before an individual instance locks out.
- **Risk Assessment:** Low in practice due to strong bcrypt-12 password hashing, minimum 10-character password complexity, and absence of public username enumeration.
- **Recommendation:** If global distributed rate limiting is desired, introduce Upstash Redis or Vercel KV with `@upstash/ratelimit`. This requires external service provisioning and is submitted for owner decision.

### 4. Login, Logout, Callback URLs, Session Expiry & Invalidation
- **Audit Result:** **VERIFIED SECURE.**
  - `sanitizeCallbackUrl()` strictly disallows protocol-relative URLs (`//`, `/\\`), external schemes (`https://`, `http://`), and script URIs (`javascript:`, `data:`).
  - Session strategy is JWT-based with a 30-day maxAge and secure HTTP-only cookies.
  - Sign-out invalidates cookies and redirects cleanly to `/admin/login`.

### 5. Administrator Provisioning Safeguards
- **Audit Result:** **VERIFIED SECURE.**
  - `scripts/create-admin.ts` requires explicit `--update` flag to rotate credentials on existing accounts.
  - Enforces minimum 10-character password requirement.
  - Hashes passwords using bcrypt with a high cost factor (12 salt rounds).
  - Never echoes plain-text passwords to stdout or logs.

---

## 3. Database Reliability & Recovery Readiness Audit

### 3.1 Connection Architecture
- Database client uses `@neondatabase/serverless` over HTTPS stateless fetch (`drizzle-orm/neon-http`).
- Vercel production environment variables include both pooled (`DATABASE_URL_POOLED`) and unpooled direct connection strings (`DATABASE_URL_UNPOOLED`).
- Serverless instances do not hold idle TCP sockets open, eliminating socket exhaustion under traffic bursts.

### 3.2 Transaction Boundaries & Multi-Step Content Operations
- **Audit Finding:** In `src/app/(admin)/admin/case-studies/actions.ts` (`upsertCaseStudyAction`), updating financial schedules is executed as:
  ```ts
  await db.delete(schema.financialSchedules).where(...);
  for (const schedule of data.financialSchedules) {
    await db.insert(schema.financialSchedules).values(...);
  }
  ```
  Because `drizzle-orm/neon-http` executes each statement via HTTP request, these queries are not executed inside a single interactive transaction (`BEGIN ... COMMIT`). If the insert loop fails mid-way, previous schedules would have been deleted.
- **Risk Assessment:** Low during normal single-user CMS editing, but constitutes an operational reliability risk.
- **Recommendation:** Switch to Neon WebSocket / Pooler interactive transactions or a PostgreSQL stored function for atomic schedule upserts.

### 3.3 Concurrent Revision Collision Risk
- **Audit Finding:** In `src/lib/cms-audit.ts` (`recordContentRevision`), the next revision number is computed via `SELECT MAX(revision_number) + 1` followed by `INSERT`. While `content_revisions` has an index on `(entity_type, entity_id)`, it does not have a unique constraint on `(entity_type, entity_id, revision_number)`.
- If two admin sessions edited the same study simultaneously, duplicate revision numbers could be created without throwing an error.
- **Risk Assessment:** Negligible for a single-author portfolio, but documented for architectural completeness.

### 3.4 Recovery Objectives & Procedure Summary
- **Proposed RPO:** `< 15 minutes` (technical RPO is ~0 seconds with Neon continuous WAL PITR).
- **Proposed RTO:** `< 30 minutes` (Neon branch spin-up takes < 10 seconds; data verification takes ~15 minutes).
- **Recovery Procedure:** Fully documented in [BACKUP_AND_RECOVERY_PLAN.md](file:///d:/Project/portfolio%20siam/BACKUP_AND_RECOVERY_PLAN.md).

---

## 4. Production Monitoring Matrix

| Signal / Event | Where Observed | Detection Method | Severity | Recommended Response |
| :--- | :--- | :--- | :---: | :--- |
| **HTTP 5xx Server Errors** | Vercel Runtime Logs / Alerts | Query `status:500..599` in Vercel Observability | **SEV-1** | Inspect error digest, verify Neon compute status, rollback if regression. |
| **Database Connection Failure** | Vercel Runtime Logs | `[AUTH]` or `DATABASE_URL` connection timeout | **SEV-1** | Check Neon Console compute health, verify connection string pooling. |
| **Brute-Force Login Attacks** | Vercel Runtime Logs / DB | `RateLimitExceeded` logs, rapid failed login entries | **SEV-2** | Check attacker IP, verify rate limiter is locking identifier, consider IP blocking. |
| **Cloudinary Signature Failure** | Vercel Stderr Logs | `[MEDIA_SECURITY]` rejected upload signature | **SEV-2** | Verify `CLOUDINARY_API_SECRET` in Vercel settings and system clock sync. |
| **Contact Form Submission Errors** | Formspree Dashboard | Formspree email bounce / spam quota alert | **SEV-3** | Verify Formspree endpoint ID in `.env` and verify monthly submission quota. |
| **Uncaught React Render Errors** | Client Browser Console / Sentry | `[APP_ERROR]` or `[GLOBAL_ERROR]` error boundary logs | **SEV-2** | Inspect reference digest, reproduce locally with specific data payload. |
| **Core Web Vitals Regression** | Vercel Speed Insights | LCP > 2.5s, INP > 200ms, or CLS > 0.1 | **SEV-3** | Audit image sizes, verify responsive srcset, check client bundle imports. |

---

## 5. Application Resilience & Error Handling Audit

### 5.1 Error Boundaries Implemented
- **Root Error Boundary (`src/app/error.tsx`):**
  - Catches runtime errors on public pages (homepage, case studies, catalog).
  - Shields stack traces, SQL syntax, table names, and environment variables from visitors.
  - Renders Executive Claymorphism interface with "Try Again" and "Return Home" actions.
  - Displays unique `error.digest` for developer tracing.
- **Global Error Boundary (`src/app/global-error.tsx`):**
  - Traps catastrophic failures within root layout (`<html>` and `<body>`).
  - Standalone CSS/HTML without external component dependencies to prevent cascading render crashes.

### 5.2 Content & Boundary Separation
- **Published vs. Draft Content:** Strictly enforced at query level in `src/lib/public-data.ts`. Unless `isDraftMode = true` with an active, authenticated preview session, only records where `status = 'published'` are queried.
- **Private Data Protection:**
  - `site_settings.private_phone` is explicitly excluded from public queries.
  - `users.password_hash` is stripped immediately in `src/auth.ts`.
  - Database connection strings and Cloudinary API secret are bounded to server execution context.

---

## 6. Security, Privacy & Compliance Review

### 6.1 Invariant Verification (VAL-07 to VAL-11)
- **VAL-07 (Phone Number Privacy):** VERIFIED. The author's personal phone number is strictly absent from all public HTML, scripts, metadata, and API endpoints.
- **VAL-08 (Square Pharma 8% Overhead Proposal):** VERIFIED. Explicit disclosure badge and methodology notes identify the 8% reduction as an academic coursework proposal.
- **VAL-09 (Individual Tax Return Discrepancy):** VERIFIED. Arithmetic divergence under Bangladesh Income Tax Act 2023 remains explicitly disclosed.
- **VAL-10 (StyleTex RMG Costing Margin Discrepancy):** VERIFIED. Unit contribution margin divergence is disclosed with warning badge.
- **VAL-11 (FIFA World Cup Macroeconomic Impact):** VERIFIED. Research framing distinguishing direct expenditure from catalytic impact is preserved.

### 6.2 HTTP Security Headers Audit (`next.config.ts`)
- `X-Content-Type-Options: nosniff` (Blocks MIME sniffing)
- `X-Frame-Options: DENY` (Clickjacking prevention)
- `Referrer-Policy: strict-origin-when-cross-origin` (Protects outbound referrer privacy)
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` (Disables unnecessary device APIs)
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (Enforces HTTPS)
- `Content-Security-Policy`: Restricts scripts, styles, fonts, and connects to verified domains (`'self'`, Cloudinary, Formspree, Vercel Insights, Google Fonts).
- `Cache-Control: no-store, no-cache, must-revalidate` (Applied to `/admin/:path*` to prevent edge caching of CMS screens).

---

## 7. Performance & Regression Readiness

1. **Vercel Speed Insights Enabled:** `<SpeedInsights />` added to `src/app/layout.tsx`. Real-user telemetry (FCP, LCP, INP, CLS) is now reported directly to the Vercel Speed Insights dashboard.
2. **Dynamic Server Rendering:** `export const dynamic = "force-dynamic"` on `/` and `/case-studies` ensures pages fetch live data on demand without build-time static pre-rendering database failures.
3. **Tabular Schedule Rendering:** Financial tables utilize `.tabular-nums` for proportional monospace alignment, preventing layout shifts (CLS) on data updates.
4. **Cloudinary Optimization:** Remote images load over secure HTTPS from `res.cloudinary.com` with Next.js image domain whitelist and automated format delivery (`f_auto, q_auto`).

---

## 8. Prioritized Findings & Remediation Summary

| ID | Priority | Finding Description | Status | Remediation Details |
| :--- | :---: | :--- | :---: | :--- |
| **SEC-10-01** | **P1 (High)** | Default role in schema and Auth.js configuration defaulted to `"admin"`. | **RESOLVED (Local Code)** | `src/auth.config.ts` fallback changed to `"user"`. `src/lib/db/schema.ts` default role changed to `"user"`. (DB ALTER TABLE proposed for owner approval). |
| **SEC-10-02** | **P2 (Med)** | Missing HTTP security headers and Content Security Policy in `next.config.ts`. | **RESOLVED** | Configured complete security headers suite and CSP in `next.config.ts`. |
| **REL-10-01** | **P2 (Med)** | Missing App Router error boundaries (`error.tsx`, `global-error.tsx`). | **RESOLVED** | Created branded, sanitized error boundaries with retry mechanisms. |
| **PERF-10-01** | **P3 (Low)** | `@vercel/speed-insights` installed but not rendered in root layout. | **RESOLVED** | Integrated `<SpeedInsights />` in `src/app/layout.tsx`. |
| **OPS-10-01** | **P2 (Med)** | Multi-step financial schedule updates lack atomic interactive transaction boundary. | **DOCUMENTED** | Documented in Section 3.2. Proposing migration to Neon WebSocket/Pooler transactions. |
| **OPS-10-02** | **P2 (Med)** | In-memory login rate limiter is process-local on serverless. | **DOCUMENTED** | Documented in Section 2.3. Proposing Upstash Redis/KV if global distributed limits are required. |

---

## 9. Local Code Changes & Files Affected

| File Path | Action | Description |
| :--- | :---: | :--- |
| `src/auth.config.ts` | **Modified** | Changed fallback role in `jwt` and `session` callbacks from `"admin"` to `"user"`. |
| `src/lib/db/schema.ts` | **Modified** | Changed `users.role` default constraint from `"admin"` to `"user"`. |
| `next.config.ts` | **Modified** | Added security headers, CSP, and admin `Cache-Control: no-store` headers. |
| `src/app/error.tsx` | **Created** | Root error boundary with Executive Claymorphism styling and error masking. |
| `src/app/global-error.tsx` | **Created** | Fallback error boundary for critical root layout failures. |
| `src/app/layout.tsx` | **Modified** | Rendered `<SpeedInsights />` for real-user Core Web Vitals monitoring. |
| `BACKUP_AND_RECOVERY_PLAN.md` | **Created** | Comprehensive Neon backup, recovery, and PITR branching plan. |
| `OPERATIONS_RUNBOOK.md` | **Created** | Operational runbook, health checks, monitoring, and fast rollback guide. |
| `INCIDENT_RESPONSE_PLAN.md` | **Created** | Incident classification, containment protocols, and communication templates. |
| `PHASE_10_HARDENING_REPORT.md` | **Created** | This comprehensive audit and hardening report. |

---

## 10. Production Actions Requiring Owner Authorization

The following non-blocking production enhancements require explicit owner authorization:

1. **Production Database Role Default Constraint:**
   - Execute SQL: `ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';`
   - *Rationale:* Ensures database-level enforcement of the least-privilege principle.
2. **Production Deployment of Phase 10 Hardening:**
   - Deploy commit containing security headers, error boundaries, and SpeedInsights to Vercel production.
3. **Optional Distributed Rate Limiting (Upstash Redis / Vercel KV):**
   - *Rationale:* Coordinates login rate-limiting across multi-region serverless instances.

---

## 11. Verification Test Results

- `npm run type-check`: **PASS (0 errors)**
- `npm run lint`: **PASS (0 errors)**
- `npm run build`: **PASS (Compiled successfully, static & dynamic routes validated)**
- Automated Database Verification (`scripts/verify-db.ts`): **PASS (All 12 tables and records verified)**
- Public Pipeline Tests (`scripts/test-public-pipeline.ts`): **PASS (All privacy and financial disclosures intact)**
- Auth Boundary Tests (`scripts/test-auth-boundary.ts`): **PASS (Open-redirect defense and rate limiting intact)**

---

## 12. Final Classification

**HARDENING COMPLETE:** All production hardening audits, local security fixes, resilience boundaries, and operational runbooks are complete and verified with zero unresolved critical findings. Live production remains untouched pending owner deployment authorization.
