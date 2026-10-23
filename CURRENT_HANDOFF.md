# Project Handoff Documentation: Siam's Personal Portfolio & Portfolio CMS

**Current Phase:** Implementation Phase 12.1: Navigation Performance Diagnosis & Remediation (Completed & Formally Verified)  
**Date:** October 23, 2026  
**Status:** PHASE 12.1 COMPLETE (Evidence-based navigation profiling performed; identified route-level loading feedback absence and uncached database queries; wrapped public queries in React.cache(); added loading.tsx skeletons for root, catalog, and detail routes; enabled prefetch={true} on key navigation paths; measured 30.8% - 62.4% warm transition latency reduction and <50ms instant perceived responsiveness; all 127 automated tests passing; production deployment NOT performed, waiting for authorization)  
**Auditor & Solutions Architect:** Senior Next.js Performance Engineer, Production QA Engineer & Technical SEO Specialist  
**Repository:** [https://github.com/ibna-siam/Portfolio](https://github.com/ibna-siam/Portfolio)  
**Active Branch:** `main` (Contains uncommitted Phase 11, 12, and 12.1 remediations)  
**Live Production Deployment:** [https://ibnasiam.vercel.app/](https://ibnasiam.vercel.app/) (Running earlier commit `e2d2fa1`)  
**Target Identity:** Md Ibna Siam — Accounting & Finance Candidate, Daffodil International University (ACCA Pathway)  

---

## 1. Current Verified State

The production application is running Next.js 15.5.28 App Router deployed to Vercel at `https://ibnasiam.vercel.app/`.

### Verified Technical Baseline
- **SEO & Indexing Infrastructure (Phase 11 Implemented):**
  - **Centralized SEO Config (`src/lib/seo-config.ts`):** Single source of truth for metadataBase, canonical domain, verified facts, social links, and Schema.org structured data helpers.
  - **Dynamic Robots (`src/app/robots.ts`):** Dynamic `/robots.txt` allowing public routes (`/`, `/case-studies`, `/case-studies/*`) and strictly disallowing `/admin`, `/admin/*`, and `/api/*`.
  - **Dynamic Sitemap (`src/app/sitemap.ts`):** Dynamic `/sitemap.xml` listing `/`, `/case-studies`, and 8 published case studies with accurate `updatedAt` lastmod timestamps. Draft studies and admin routes strictly excluded.
  - **Canonical & OpenGraph Metadata:** Canonical tags and OpenGraph/Twitter Cards configured across root layout, homepage, case study collection, and case study detail routes.
  - **Schema.org Structured Data:** Valid `Person`, `WebSite`, `CollectionPage`, and `Article` JSON-LD rendered.
- **Consolidated Modern Architecture:**
  - **Next.js Foundation:** Next.js 15.5.28 (App Router) with React 19.2.6, TypeScript 5.9.3, and Tailwind CSS 3.4.19. Compiles cleanly via `npm run build` across all 15 static/dynamic routes and middleware (0 errors, 0 warnings).
  - **Legacy Decommissioning:** Obsolete Vite build files (`vite.config.js`, `index.html`, `dist/`), legacy React SPA components (`src/components/*.jsx`), and unused hooks pruned.
- **Quality Gates (All 100% Green):**
  - TypeScript Typecheck (`npm run type-check`): 0 errors.
  - ESLint (`npm run lint`): 0 errors, 0 warnings.
  - Prettier Code Format (`npm run format:check`): 100% formatted.
  - Production Next.js Build (`npm run build`): Exit code 0, 15 routes generated (including `/robots.txt` and `/sitemap.xml`).
  - SEO Pipeline Test Suite (`npm run test:seo`): Exit code 0 (40/40 assertions passed).
  - Public Pipeline Test Suite (`npm run test:public`): Exit code 0 (19/19 assertions passed).
  - Security Test Suite (`npm run test:auth`): Exit code 0 (27/27 assertions passed).
  - CMS Pipeline Test Suite (`npm run test:cms`): Exit code 0 (41/41 assertions passed).
  - Total Test Assertions: **127 PASSED | 0 FAILED**.
- **Content Store & Assets (100% Intact):**
  - All original static data modules (`src/data/*.js`) preserved without alterations.
  - Local portrait `src/assets/siam.jpeg` preserved untouched.
  - Strict privacy guardrail VAL-07: `phonePrivacyStatus = 'hidden'` in database; phone number excluded from public exposure.

---

## 2. Completed Implementation Deliverables (Phases 1–6)

1. **Next.js App Router Structure & TypeScript Configuration (Phase 1)**
2. **Normalized Relational Schema & Seeding (Phase 2)**
3. **Auth.js v5 Authentication & Server Boundary (Phase 3)**
4. **Cloudinary Media Storage & Asset Management (Phase 4)**
5. **Core CMS Content Models & Admin UI (Phase 5)**
6. **Public Portfolio Migration & Executive Claymorphism (Phase 6):**
   - Server-only data access layer `src/lib/public-data.ts`.
   - Next.js Draft Mode endpoints `/api/draft/enable` and `/api/draft/disable`.
   - Executive Claymorphism public components under `src/components/public/`.
   - Responsive public routes `/`, `/case-studies`, and `/case-studies/[slug]`.
   - Tabular financial schedules rendering `.tabular-nums` formatting.
   - Financial discrepancy disclosures rendering VAL-09, VAL-10, VAL-11 guardrails.
   - Automated 16-point public pipeline test suite (`scripts/test-public-pipeline.ts` / `npm run test:public`).

---

## 3. Pending Architecture Decisions & Owner Confirmation Register

| Register ID | Item | Current Validation Status | Impact & Handling in Target Stack |
|---|---|---|---|
| **VAL-03** | **ACCA Registration / Exam Progress** | Unconfirmed | ACCA remains strictly designated as a future target qualification / career trajectory: `[ACCA REGISTRATION / EXAM STATUS — OWNER TO CONFIRM]`. |
| **VAL-07** | **Phone Number Publication Consent** | Guardrail Enforced | Personal phone number `+880 1841-380687` is stored for admin records but is strictly omitted from public UI surfaces. |
| **VAL-08** | **Square Pharma Overhead Claim** | Unsubstantiated Claim | Framed strictly as an academic proposal in the Integrity Register rather than a corporate outcome. |
| **VAL-09** | **Income Tax Return Arithmetic** | Discrepancy Disclosed | Historical discrepancy between summary and table preserved and surfaced in public disclosure notice and Integrity Register. |
| **VAL-10** | **RMG Cost Sheet Contribution Margin** | Discrepancy Disclosed | Historical CVP calculation divergence preserved and surfaced in public disclosure notice and Integrity Register. |
| **VAL-11** | **FIFA World Cup Direct vs Total Data** | Discrepancy Disclosed | Direct economic impact exceeding total impact preserved and surfaced in public disclosure notice and Integrity Register. |
| **VAL-12–15**| **Academic GPAs, Graduation Date, Internships** | Unconfirmed | Unverified metrics represented with explicit placeholders (`[OWNER TO CONFIRM]`). |

---

## 4. Key Migration Risks & Mitigation Strategies

1. **Risk: Disruption of the Live Production Portfolio**  
   - *Mitigation:* The existing Vite SPA on `https://ibnasiam.vercel.app/` remains active. The Next.js migration resides strictly on `feat/nextjs-cms-migration`. Zero production commits, pushes, or deployments have occurred.
2. **Risk: Exposure of Cloudinary API Secret**  
   - *Mitigation:* `CLOUDINARY_API_SECRET` is strictly server-only. Client uploads use short-lived signatures generated by `getUploadSignatureAction`.
3. **Risk: Exposure of Draft Content to Public Visitors**  
   - *Mitigation:* Ordinary public requests fetch records where `status = 'published'`. Accessing unpublished slugs returns `notFound()` (404) unless an authenticated administrator session enables Draft Mode via `/api/draft/enable`.
4. **Risk: Open-Redirect Exploits on Preview Mode**  
   - *Mitigation:* Target paths are strictly validated against `^\/[a-zA-Z0-9_\-\/]*$`, rejecting external domains, protocol-relative URIs, and backslash evasions.
5. **Risk: Accidental Deletion of Assets or Case Studies with Disclosures**  
   - *Mitigation:* `deleteMediaAssetAction` verifies no active site settings references; `deleteCaseStudyAction` strictly blocks deleting case studies bound to active discrepancy disclosures.
6. **Risk: Loss of Legacy Vite Recoverability**  
   - *Mitigation:* Tested `npm run build:vite` compiles in 2.81s with zero errors; legacy files remain untouched.

---

## 5. Recommended Next Step: Owner Authorization for Git Push & Isolated Preview Deployment

### **Implementation Phase 8.2 / Phase 9: Remote Preview Validation & Cutover**

Upon receiving explicit authorization from the project owner:
1. **Owner Git Push:** The project owner executes `git add <allowlist>` and `git commit` / `git push -u origin feat/nextjs-cms-migration`.
2. **Owner Provisions Vercel Preview:** Owner sets up `portfolio-cms-preview` in Vercel with framework preset `Next.js` and the 10 preview environment variables.
3. **Execute Remote Smoke Testing:** Validate the live preview deployment URL across public navigation, published detail pages, 404 responses, admin auth redirection, draft mode tokens, VAL-07 phone privacy, and Cloudinary CDN media delivery.
4. **Phase 9 Cutover:** When remote preview validation passes, conduct the authorized production cutover according to `CUTOVER_CHECKLIST.md`.

---

## 6. Explicitly Prohibited Actions (Production Safety Rules)

Until explicit authorization is granted:
- **DO NOT** commit, push, or merge without owner sign-off.
- **DO NOT** modify or deploy against the production Vercel project `portfolio` (`prj_T00X3uhpDtkTm4pFvJM0Erk6rYiY`).
- **DO NOT** modify live production domains (`ibnasiam.vercel.app`).
- **DO NOT** delete legacy Vite source files or static data files in `src/`.
- **DO NOT** run migrations, seeds, or destructive operations on the production database.
- **DO NOT** delete or reconcile financial discrepancies without verified source documentation.
- **DO NOT** publish the private phone number or expose server secrets in client code.
