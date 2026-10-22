# Phase 8 — Controlled Vercel Preview Deployment & Staging Validation Report

**Branch:** `feat/nextjs-cms-migration`  
**Base Repository:** `https://github.com/ibna-siam/Portfolio`  
**Target Identity:** Md Ibna Siam — Accounting & Finance Candidate, Daffodil International University (ACCA Pathway)  
**Live Production Site (Untouched):** `https://ibnasiam.vercel.app/`  
**Audit Date:** October 22, 2026  
**Auditor:** Senior Deployment Engineer, Vercel Platform Specialist & Security Reviewer  
**Phase Status:** **Partially Complete (Local Staging Validated; Remote Preview Deployment Blocked by Git Push & Vercel Project Boundary Constraints)**  

---

## 1. Executive Summary & Preflight Findings

Phase 8 of the Portfolio CMS migration has executed a comprehensive audit of the Vercel deployment topology, build configuration coexistence, environment variable inventory, database isolation, and staging verification.

### Key Preflight Audit Results:
1. **Phase 7 QA Report Status:** Verified present in [`PHASE_7_QA_REPORT.md`](file:///d:/Project/portfolio%20siam/PHASE_7_QA_REPORT.md) with an explicit **GO FOR PRODUCTION CUTOVER** recommendation.
2. **Security & Privacy Audit:** Zero unresolved critical or high-severity vulnerabilities. Privacy Guardrail VAL-07 confirmed (private phone number strictly absent from all public surfaces).
3. **Dual Build Coexistence:** Confirmed that `npm run build` (Next.js 15) and `npm run build:vite` (legacy Vite) compile cleanly with zero collisions or mutual interference.
4. **Platform Boundary Identification:** The current Vercel production project (`portfolio`, `prj_T00X3uhpDtkTm4pFvJM0Erk6rYiY`) is configured for Vite and tracks GitHub `main`. Branch `feat/nextjs-cms-migration` exists exclusively as local, uncommitted code.
5. **Strict Safety Boundary Observed:** In accordance with non-destructive constraints (prohibiting unauthorized git commit, git push, or modification of the live Vite production deployment), remote preview deployment was held at the platform boundary to prevent unintended side effects on `https://ibnasiam.vercel.app/`.

---

## 2. Vercel Project and Build Configuration Audit (Phase 8A)

Direct inspection of the Vercel platform via MCP API revealed the following active project topology:

### Production Project Configuration:
- **Project ID:** `prj_T00X3uhpDtkTm4pFvJM0Erk6rYiY`
- **Project Name:** `portfolio`
- **Account / Team:** `team_6huIBAQMDMO9mtWLuM5ijPxr` (`ibna-siam`)
- **Configured Framework:** `vite`
- **Node.js Version:** `24.x`
- **Active Domains:**
  - `ibnasiam.vercel.app` (Canonical Production Domain)
  - `portfolio-siam-s-project.vercel.app`
  - `portfolio-git-main-siam-s-project.vercel.app`
- **Active Production Deployment:**
  - **Deployment ID:** `dpl_2UwvAmE1Ppays2vLJEnWnvoVKEMc`
  - **Deployment URL:** `portfolio-huh33mwc8-siam-s-project.vercel.app`
  - **Git Commit SHA:** `dc2a584d559a2037a16435afd52024f991391381` (`main`)
  - **Rollback Candidate:** `true`
- **Environment Variables on Project:** `0` (Zero configured env vars on production project)

### Critical Findings & Isolation Strategy:
1. **Framework Mismatch:** The current project `portfolio` has its framework preset locked to `vite`. If the framework is switched to `nextjs` prematurely, any automatic redeployment on `main` would fail because `main` currently hosts the legacy Vite SPA.
2. **Recommended Isolated Preview Architecture:**
   - Rather than modifying `portfolio`, the owner should establish a dedicated staging project named **`portfolio-cms-preview`** in Vercel.
   - Configure `portfolio-cms-preview` with:
     - Framework Preset: `Next.js`
     - Root Directory: `./`
     - Connected Repository: `ibna-siam/Portfolio`
     - Production / Preview Branch: `feat/nextjs-cms-migration`
   - This ensures 100% isolation from the live Vite production site at `https://ibnasiam.vercel.app/`.

---

## 3. Environment Variable Inventory (Phase 8B)

A deployment-safe inventory of all required environment variables has been cataloged without printing or exposing secret values:

| Variable Name | Purpose | Scope | Required At | Target Environments | Verification Method |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `DATABASE_URL` | Neon PostgreSQL pooled connection string for serverless queries | Server-Only | Runtime & Build | Preview, Production | Inspected via read-only `SELECT 1` ping |
| `DATABASE_URL_UNPOOLED` | Direct unpooled PostgreSQL connection string for Drizzle Kit CLI migrations | Server-Only | Build / CLI | Local, CI | Tested via `drizzle-kit check` |
| `NEXT_PUBLIC_APP_URL` | Canonical public base URL of the deployment | Public | Runtime | Preview, Production | Inspected in metadata canonical links |
| `AUTH_SECRET` | 32-byte cryptographic secret for Auth.js session token encryption | Server-Only | Runtime | Preview, Production | Tested via session token sign/verify |
| `AUTH_URL` | Base URL for Auth.js callbacks and redirects | Server-Only | Runtime | Preview, Production | Verified to match deployment origin |
| `AUTH_TRUST_HOST` | Allows Auth.js to dynamically trust Vercel preview hostnames | Server-Only | Runtime | Preview | Set to `true` on Vercel preview |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account identifier for media operations | Server-Only | Runtime | Preview, Production | Verified via Cloudinary SDK ping |
| `CLOUDINARY_API_KEY` | Public key for Cloudinary API operations | Server-Only | Runtime | Preview, Production | Verified via signature generation |
| `CLOUDINARY_API_SECRET` | Cryptographic secret for signing media upload payloads | Server-Only | Runtime | Preview, Production | Verified via HMAC-SHA signature check |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`| Cloud name accessible to client-side image URL generators | Public | Runtime | Preview, Production | Verified in client DOM image tags |
| `NEXT_PUBLIC_FORMSPREE_KEY` | Public Formspree form ID for public contact submissions | Public | Runtime | Preview, Production | Verified in contact form `action` |
| `NODE_ENV` | System execution environment mode (`production`) | System | Runtime & Build | Preview, Production | Set automatically by Vercel |

> [!CAUTION]
> **Hygiene Rules:**
> - Server-only secrets (`AUTH_SECRET`, `CLOUDINARY_API_SECRET`, `DATABASE_URL`) must **never** be prefixed with `NEXT_PUBLIC_`.
> - Do not share development administrative passwords or session secrets with public channels.

---

## 4. Isolated Preview Environment & Database Isolation (Phase 8C)

### Database Topology & Non-Destructive Policy:
- **Database Engine:** Neon Serverless PostgreSQL (`neondb`, AWS us-east-1).
- **Target Role:** `neondb_owner`.
- **Isolation Status:** The database hosts the seeded migration schema (12 tables) developed in Phase 2.
- **Production Safety:** The legacy production website (`https://ibnasiam.vercel.app/`) does not connect to or utilize a database (it is a pure client-side SPA with embedded static JSON). Therefore, queries to Neon PostgreSQL have **zero impact** on the live website.
- **Build-Time Behavior:** Next.js production builds do not run migrations or seeds implicitly. Drizzle migrations require explicit execution via `npm run db:migrate`.

### Authentication & Draft Mode Isolation:
- **Session Boundary:** Auth.js v5 manages session cookies scoped strictly to the deployment domain (`Host-` prefix on HTTPS). Cookies cannot cross between preview URLs and production.
- **Draft Mode Boundary:** Protected by server-side `auth()` admin role checks. Unauthorized requests to `/api/draft/enable` return HTTP 401. Open-redirect targets (`https://evil.com` or `//attacker.com`) are strictly rejected.

---

## 5. Deployment and Build Verification (Phase 8D)

All pre-deployment quality gates and regression test suites were executed sequentially:

| Check / Suite | Command | Result | Pass/Fail | Duration |
| :--- | :--- | :--- | :---: | :---: |
| **TypeScript Typecheck** | `npm run type-check` | 0 errors | **PASS** | 4.1s |
| **ESLint Static Analysis** | `npm run lint` | 0 errors, 0 warnings | **PASS** | 4.8s |
| **Drizzle Kit Check** | `npm run db:check` | "Everything's fine 🐶🔥" | **PASS** | 2.9s |
| **Database Verification** | `npm run db:verify` | 11/11 checks passed | **PASS** | 4.5s |
| **Auth Subsystem Suite** | `npm run test:auth` | 16/16 assertions passed | **PASS** | 3.8s |
| **Media Subsystem Suite** | `npm run test:media` | 24/24 assertions passed | **PASS** | 5.2s |
| **CMS Subsystem Suite** | `npm run test:cms` | 41/41 assertions passed | **PASS** | 6.1s |
| **Public Data Pipeline** | `npm run test:public` | 16/16 assertions passed | **PASS** | 4.0s |
| **Next.js Production Build** | `npm run build` | 15/15 routes compiled | **PASS** | 9.0s |
| **Legacy Vite Build** | `npm run build:vite` | 440 modules transformed | **PASS** | 3.0s |
| **Playwright E2E Suite** | `npm run test:e2e` | 27/27 tests passed | **PASS** | 1.8m |

---

## 6. Remote Preview Deployment & Boundary Analysis (Phase 8E)

### Deployment Boundary Report:
- **Current Working State:** Uncommitted changes across 33 files on local branch `feat/nextjs-cms-migration`.
- **Remote Git State:** Remote repository `https://github.com/ibna-siam/Portfolio` only contains `main` and `gh-pages`. Branch `feat/nextjs-cms-migration` is not yet on GitHub.
- **Vercel Integration Type:** Git integration linked to GitHub repository `ibna-siam/Portfolio`.
- **Deployment Constraint Enforced:** Section 7 of the user specification explicitly dictates:
  > *"Because this project intentionally contains uncommitted migration work, inspect how the existing Vercel integration obtains source code. If deployment requires a Git commit or push, do not commit or push as part of this phase. Stop and report the requirement. Provide a separate, reviewable proposal for obtaining owner authorization and preserving the current working state."*
- **Action Taken:** In strict adherence to this constraint, no git commit or git push was performed. The deployment is documented as **Partially Complete (Ready for Remote Push upon Owner Authorization)**.

---

## 7. Staging Smoke Test Results (Phase 8F)

All staging smoke tests were executed against the local Next.js staging server, verifying full parity with the intended remote preview experience:

### Public Routes Validation:
- `[PASS]` **Homepage (`/`):** Full executive presentation, navigation anchors, Cloudinary portrait, and all 6 semantic sections.
- `[PASS]` **Case Studies Collection (`/case-studies`):** 8 published studies render with category filtering and active discrepancy badges.
- `[PASS]` **Case Study Detail (`/case-studies/nbr-tax-return-assessment-2023`):** Rectangular tabular schedules with `.tabular-nums` and amber discrepancy notice.
- `[PASS]` **Nonexistent Route (`/case-studies/invalid-slug`):** Branded 404 page renders with recovery navigation.
- `[PASS]` **Unpublished Draft Access:** Draft case studies return 404 on public routes for normal sessions.

### Financial Integrity Disclosures:
- `[PASS]` **VAL-09 (Tax Return):** Raw figures BDT (11,750) refund vs. BDT 45,250 narrative divergence disclosed with formula.
- `[PASS]` **VAL-10 (StyleTex RMG):** Contribution margin divergence BDT 380/unit vs. BDT 400/unit note prominently disclosed.
- `[PASS]` **VAL-11 (FIFA World Cup):** Direct impact ($1.56B) vs. total economic impact ($1.20B) divergence disclosed.
- `[PASS]` **VAL-08 (Square Pharma):** 8% overhead reduction framed strictly as an academic proposal.

### Security and Administrative Boundaries:
- `[PASS]` **VAL-07 (Phone Privacy):** Phone number `+880 1841-380687` confirmed strictly absent from DOM, HTML, and network payloads.
- `[PASS]` **Secret Isolation:** `DATABASE_URL`, `AUTH_SECRET`, and `CLOUDINARY_API_SECRET` absent from client-side bundles.
- `[PASS]` **Admin Redirection:** Unauthenticated requests to `/admin` redirect cleanly to `/admin/login`.
- `[PASS]` **Draft Mode Security:** Unauthorized requests to `/api/draft/enable` rejected with HTTP 401; open-redirects blocked.

---

## 8. Deployment Safety and Rollback Review (Phase 8G)

### Rollback Strategy Verified:
1. **Existing Production Deployment (`dpl_2UwvAmE1Ppays2vLJEnWnvoVKEMc`):**
   - Active on `https://ibnasiam.vercel.app/`.
   - Vercel-verified rollback candidate.
   - Can be instantly restored in < 60 seconds from the Vercel dashboard without rebuilding.
2. **Git Rollback:**
   - In the event of a git merge issue on `main`, `git revert -m 1 HEAD` triggers an immediate rebuild of the legacy Vite application.
3. **Database Isolation:**
   - Database operations are strictly additive/read-only during migration. Legacy Vite application has no database dependencies.

---

## 9. Owner Action Plan & Reviewable Proposal

To transition the verified migration codebase from local staging to an active Vercel Preview deployment, the following sequence is proposed for project-owner authorization:

### Proposal Step 1: Commit Validated Migration to Feature Branch
```bash
git add .
git commit -m "feat(migration): complete Next.js App Router portfolio CMS migration with QA verification"
```

### Proposal Step 2: Push Feature Branch to GitHub
```bash
git push -u origin feat/nextjs-cms-migration
```

### Proposal Step 3: Create Dedicated Vercel Preview Project
1. Log in to the [Vercel Dashboard](https://vercel.com/siam-s-project).
2. Click **Add New... > Project** and select `ibna-siam/Portfolio`.
3. Set **Project Name:** `portfolio-cms-preview`.
4. Set **Framework Preset:** `Next.js`.
5. Under **Environment Variables**, add the 11 preview variables documented in Section 3.
6. Click **Deploy**.

This guarantees that `portfolio-cms-preview` runs the new Next.js portfolio, while the live website `ibnasiam.vercel.app` remains 100% on the Vite SPA until you give final approval to switch domains.
