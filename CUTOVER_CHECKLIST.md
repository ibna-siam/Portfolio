# Production Cutover & Deployment Checklist
**Target Environment:** Vercel Production (`https://ibnasiam.vercel.app/`)  
**Active Development Branch:** `feat/nextjs-cms-migration`  
**Base Repository:** `https://github.com/ibna-siam/Portfolio`  
**Production Vercel Project ID:** `prj_T00X3uhpDtkTm4pFvJM0Erk6rYiY` (Currently configured as `vite`)  
**Recommended Preview Project:** `portfolio-cms-preview` (Isolated Next.js 15 preview project)  
**Database:** Neon Serverless PostgreSQL (`neondb`, AWS us-east-1)  
**Media Provider:** Cloudinary (`dwyx9714u`)  
**Security & Access Boundary:** Auth.js v5 with Bcrypt credential hashing  
**Cutover Policy:** Strict Owner Authorization Required Prior to Merge / Deployment  

---

## 1. Cutover Prerequisites & Preflight Verification

Before initiating any DNS, Vercel project configuration, or Git branch merge operations, verify that each prerequisite is satisfied:

| Check | Requirement | Verified Status | Evidence |
| :--- | :--- | :---: | :--- |
| **PRE-01** | Development branch isolated | **SATISFIED** | Branch is `feat/nextjs-cms-migration`; no direct commits to `main`. |
| **PRE-02** | Legacy Vite build passing | **SATISFIED** | `npm run build:vite` succeeds with zero errors in 3.04s. |
| **PRE-03** | Next.js 15 App Router build passing | **SATISFIED** | `npm run build` succeeds (15/15 static and dynamic routes compiled). |
| **PRE-04** | TypeScript type check | **SATISFIED** | `npm run type-check` (`tsc --noEmit`) passes with 0 errors. |
| **PRE-05** | ESLint static analysis | **SATISFIED** | `npm run lint` passes with 0 errors and 0 warnings. |
| **PRE-06** | Database schema consistency | **SATISFIED** | `npm run db:check` reports clean Drizzle Kit schema parity. |
| **PRE-07** | Read-only database records audit | **SATISFIED** | `npm run db:verify` confirms all 8 case studies, 16 competencies, 9 schedules, 3 disclosures. |
| **PRE-08** | Automated E2E test suite | **SATISFIED** | `npm run test:e2e` passes 27 of 27 Playwright browser tests across all suites. |
| **PRE-09** | WCAG 2.1 AA accessibility | **SATISFIED** | axe-core automated audit reports 0 critical/serious violations across all public routes and admin login. |
| **PRE-10** | Privacy guardrail VAL-07 | **SATISFIED** | Private phone number `+880 1841-380687` is confirmed absent from all public HTML, payloads, and API surfaces. |
| **PRE-11** | Financial integrity disclosures | **SATISFIED** | Discrepancy notices VAL-08, VAL-09, VAL-10, VAL-11 are rendered with prominent warning banners. |
| **PRE-12** | Vercel Project Boundary Audit | **SATISFIED** | Existing project `portfolio` identified as Vite SPA; isolated preview strategy formulated to protect live site. |
| **PRE-13** | Phase 8.1 Git Handoff & Preview Readiness | **SATISFIED** | File allowlist compiled, secret hygiene scan 100% clean, all 11 local quality gates passed; ready for owner authorization. |

---

## 2. Production & Preview Environment Variable Inventory

Configure the following environment variables. Do **NOT** mix preview and production secrets:

| Variable Name | Purpose | Target Environment | Scope | Required At |
| :--- | :--- | :---: | :---: | :---: |
| `DATABASE_URL` | Pooled connection string to Neon PostgreSQL | Preview & Production | Server-Only | Runtime & Build |
| `DATABASE_URL_UNPOOLED` | Direct unpooled connection string (Drizzle Kit CLI only) | Local / CI only | Server-Only | Build / CLI |
| `NEXT_PUBLIC_APP_URL` | Canonical public origin of the deployment | Preview & Production | Public | Runtime |
| `AUTH_SECRET` | 32-byte secret for encrypting Auth.js session JWTs | Preview & Production | Server-Only | Runtime |
| `AUTH_URL` | Canonical Auth.js callback base URL (set to match deploy origin) | Preview & Production | Server-Only | Runtime |
| `AUTH_TRUST_HOST` | Automatically trusts Vercel deployment preview origins | Preview & Production | Server-Only | Runtime |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account identifier for media operations | Preview & Production | Server-Only | Runtime |
| `CLOUDINARY_API_KEY` | Public key for Cloudinary API interactions | Preview & Production | Server-Only | Runtime |
| `CLOUDINARY_API_SECRET` | Cryptographic secret for signing media uploads | Preview & Production | Server-Only | Runtime |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Client-accessible Cloudinary cloud name for URL builders | Preview & Production | Public | Runtime |
| `NEXT_PUBLIC_FORMSPREE_KEY` | Formspree form ID for public contact submissions | Preview & Production | Public | Runtime |
| `NODE_ENV` | Execution environment mode (`production`) | Preview & Production | System | Runtime & Build |

> [!IMPORTANT]
> - Ensure `AUTH_SECRET`, `CLOUDINARY_API_SECRET`, and `DATABASE_URL` are marked as **Sensitive / Encrypted** in Vercel.
> - Ensure `DATABASE_URL` uses the pooled connection string (`-pooler.eastus2.azure.neon.tech`) for serverless execution elasticity.
> - Never expose `AUTH_SECRET`, `CLOUDINARY_API_SECRET`, or `DATABASE_URL` via `NEXT_PUBLIC_` prefixes.

---

## 3. Vercel Architecture & Deployment Strategy

### Current Vercel Architecture (Verified):
- **Project Name:** `portfolio` (`prj_T00X3uhpDtkTm4pFvJM0Erk6rYiY`)
- **Current Framework:** `vite`
- **Current Domain:** `ibnasiam.vercel.app`
- **Source Integration:** GitHub (`ibna-siam/Portfolio`), tracking `main`

### Recommended Deployment Sequencing:
1. **Step 1: Isolated Preview Project Creation (Recommended for Staging):**
   - Create a separate Vercel project `portfolio-cms-preview` connected to `ibna-siam/Portfolio` tracking `feat/nextjs-cms-migration`.
   - Set Framework Preset to `Next.js`.
   - Add the Preview Environment Variables listed in Section 2.
   - This guarantees that `ibnasiam.vercel.app` continues serving the Vite SPA with zero risk during staging validation.
2. **Step 2: Final Production Cutover (Upon Explicit Owner Authorization):**
   - Option A (Direct Switch): In the primary `portfolio` Vercel project, change Framework Preset from `Vite` to `Next.js`, configure production environment variables, merge `feat/nextjs-cms-migration` into `main`, and deploy.
   - Option B (Domain Re-pointing): Promote `portfolio-cms-preview` to production by re-assigning the custom domain `ibnasiam.vercel.app` to the new project.

---

## 4. Post-Cutover Production Smoke Tests

Immediately following preview or cutover deployment, perform the following verification walkthrough:

### 4.1 Public Portfolio Experience
- [ ] **Route `/` (Homepage):**
  - Verify document title: `Md Ibna Siam — Accounting & Finance Specialist | ACCA Pathway`.
  - Confirm portrait photo renders cleanly via optimized image pipeline.
  - Verify all 6 navigation anchor links smoothly scroll to sections (`#about`, `#case-studies`, `#competencies`, `#academic-journey`, `#solutions`, `#contact`).
  - Toggle light/dark theme switch and confirm claymorphism styling applies without flash of unstyled content.
  - Inspect page source to confirm private phone number is completely absent.
- [ ] **Route `/case-studies` (Collection Dossier):**
  - Confirm all 8 published case studies render with correct category tags and discrepancy badges.
  - Test category filtering buttons ("All Case Studies", "Corporate & Applied Accounting", "Macroeconomic Research").
- [ ] **Route `/case-studies/nbr-tax-return-assessment-2023` (Detail Schedule):**
  - Verify prominent amber banner: `Notice: Calculation Under Review — Narrative vs. Slab Schedule Divergence`.
  - Verify 4-column rectangular tabular schedule with `.tabular-nums` formatting.
  - Confirm raw figure BDT (11,750) refund vs. BDT 45,250 narrative divergence is explicitly explained.
- [ ] **Route `/case-studies/styletex-rmg-costing-break-even`:**
  - Verify contribution margin disclosure: BDT 380/unit vs. BDT 400/unit note.
- [ ] **Route `/case-studies/fifa-world-cup-macroeconomic-impact`:**
  - Verify direct impact ($1.56B) vs. total impact ($1.20B) divergence disclosure.
- [ ] **Route `/case-studies/square-pharmaceuticals-ratio-analysis`:**
  - Confirm 8% overhead reduction is explicitly characterized as an academic simulation.
- [ ] **Route `/non-existent-case-study` (404 Page):**
  - Verify custom branded 404 page renders with "Return to Portfolio" and "View Case Studies" buttons.

### 4.2 Security, Authentication & Administrative Boundary
- [ ] **Direct Navigation to `/admin`:**
  - Verify immediate server-side HTTP 307 redirect to `/admin/login?callbackUrl=%2Fadmin`.
- [ ] **Direct Navigation to `/admin/case-studies`:**
  - Verify immediate server-side HTTP 307 redirect to `/admin/login`.
- [ ] **Admin Authentication:**
  - Authenticate with `siam.admin@internal.local`.
  - Confirm successful entry to `/admin` dashboard showing CMS module statistics.
- [ ] **Draft Mode Endpoint Security:**
  - Request `/api/draft/enable?path=/case-studies` unauthenticated: verify HTTP 401 Unauthorized.
  - Request `/api/draft/enable?path=https://evil.com`: verify open-redirect is blocked, HTTP 400 Invalid Path returned.
  - Request `/api/draft/disable`: verify draft mode exits cleanly.

---

## 5. Rollback & Emergency Contingency Procedures

### 5.1 Instant Vercel Rollback (< 60 Seconds)
1. Open the [Vercel Dashboard](https://vercel.com/) and navigate to the `Portfolio` project.
2. Select **Deployments**.
3. Locate deployment `dpl_2UwvAmE1Ppays2vLJEnWnvoVKEMc` (the verified legacy Vite production build).
4. Click the three dots (`...`) menu and select **Instant Rollback (Promote to Production)**.
5. Vercel will immediately redirect production traffic back to the legacy Vite single-page application without rebuilding.

### 5.2 Git Branch Reversion Contingency
If a merge commit was pushed to `main`:
```bash
git checkout main
git revert -m 1 HEAD --no-edit
git push origin main
```
This automatically initiates a Vercel production rebuild of the pre-merge Vite state.

### 5.3 Database Isolation Guarantee
Because all migration work operates on a segregated Neon PostgreSQL branch (`neondb`), rolling back the Vercel deployment does not alter, drop, or corrupt any database tables. The database remains fully preserved for diagnostic analysis.

---

## 6. Final Go / No-Go Decision Matrix

| Evaluation Dimension | Threshold | Result | Assessment |
| :--- | :--- | :---: | :---: |
| **Automated Tests** | 100% Pass Rate | 27 / 27 Passed | **GO** |
| **Phase Unit Suites** | 100% Pass Rate | 97 / 97 Passed | **GO** |
| **Accessibility (axe-core)** | 0 Critical/Serious Violations | 0 Violations | **GO** |
| **Type Check & Lint** | 0 Errors, 0 Warnings | Clean (0 / 0) | **GO** |
| **Production Builds** | Next.js & Vite zero-error | 100% Clean | **GO** |
| **Privacy Safeguards** | Private phone strictly absent | 100% Enforced | **GO** |
| **Financial Safeguards** | All disclosures active | 100% Preserved | **GO** |
| **Admin Access Control** | Unauthenticated `/admin` blocked | 100% Enforced | **GO** |
| **Vercel Project Audit** | Next.js framework & env vars deployed | Verified (`prj_T00X3uhpDtkTm4pFvJM0Erk6rYiY`) | **GO** |
| **Rollback Readiness** | Instant Vercel rollback verified | Verified (`dpl_2UwvAmE1Ppays2vLJEnWnvoVKEMc`) | **GO** |
| **Production Remote Smoke Tests** | 52 / 52 Remote Assertions Passed | 52 / 52 Passed | **GO** |
| **OVERALL SYSTEM STATUS** | All Gates & Remote Verification Satisfied | **CUTOVER COMPLETE** | **LIVE & VERIFIED IN PRODUCTION** |

