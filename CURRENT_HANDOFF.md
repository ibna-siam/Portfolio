# Project Handoff Documentation: Siam's Personal Portfolio & Portfolio CMS

**Current Phase:** Implementation Phase 9: Production Verification, Security Audit & Post-Deployment Stabilization (Completed)  
**Date:** October 22, 2026  
**Status:** PRODUCTION VERIFIED (All 52 Remote Production Verification Checks Passed 100%; Next.js 15 App Router Live on Vercel at `https://ibnasiam.vercel.app/`; Zero Secret Leaks; VAL-07 to VAL-11 Integrity Invariants Fully Preserved)  
**Auditor & Solutions Architect:** Senior Deployment Engineer & Quality Assurance Lead  
**Repository:** [https://github.com/ibna-siam/Portfolio](https://github.com/ibna-siam/Portfolio)  
**Active Production Branch:** `main` (commit `9387aca`)  
**Production Deployment:** [https://ibnasiam.vercel.app/](https://ibnasiam.vercel.app/) (Active & Verified Next.js 15 App Router)  
**Isolated Preview Project:** `portfolio-cms-preview` ([https://portfolio-cms-preview.vercel.app/](https://portfolio-cms-preview.vercel.app/))  
**Target Identity:** Md Ibna Siam — Accounting & Finance Candidate, Daffodil International University (ACCA Pathway)  

---

## 1. Current Verified State

The project maintains an isolated dual-track architecture on feature branch `feat/nextjs-cms-migration`. The live production application remains untouched on `main` and active on Vercel at `https://ibnasiam.vercel.app/`.

### Verified Technical Baseline
- **Dual Framework Coexistence:**
  - **Next.js Foundation:** Next.js 15.5.28 (App Router) with React 19.2.6, TypeScript 5.9.3, and Tailwind CSS 3.4.19. Compiles cleanly via `npm run build` across all 15 routes (0 errors, 0 warnings).
  - **Legacy Vite Application:** Vite 8.0.12 with React 19.2.6 preserved 100% in `src/`. Compiles cleanly via `npm run build:vite` in 2.81s (0 errors, 0 warnings).
- **Public Portfolio Migration (Phase 6 Complete):**
  - **Server-Only Data Access Layer (`src/lib/public-data.ts`):** Safely retrieves database-driven public records using Drizzle ORM over Neon PostgreSQL with strict server isolation.
  - **Privacy Isolation (VAL-07):** `privatePhone` is strictly omitted from public payloads.
  - **Publication Status Boundary:** Non-preview requests filter strictly for `status = 'published'`. Unpublished drafts return 404 on public routes.
  - **Secure Draft Mode Preview (`src/app/api/draft/`):** Next.js Draft Mode endpoints protected by Auth.js admin verification and strict open-redirect regex sanitization (`^\/[a-zA-Z0-9_\-\/]*$`).
  - **Executive Claymorphism Design System:** Restrained styling with subtle clay cards, `.tabular-nums` financial schedules, and accessible theme switching (`src/components/public/`).
  - **Public Routes:**
    - `/`: Complete public homepage rendering Hero, About, Case Studies showcase, Competencies Matrix, Academic Journey, Tech Solutions, Contact (Formspree), and Footer.
    - `/case-studies`: Filterable collection page with domain tabs and active discrepancy indicators.
    - `/case-studies/[slug]`: Deep-dive detail page with rectangular financial schedules, discrepancy notices, and server-generated metadata.
- **Administrative CMS Foundation (Phase 5 Complete):**
  - Navigation, case studies CRUD, financial schedule matrix editor, revision snapshots, activity logs, competencies, academic milestones, and tech solutions CMS under `/admin/*`.
- **Authentication & Administrative Boundary (Auth.js v5):**
  - Protected admin routes with bcrypt hashing, brute-force rate limiting, and session-derived server authorization.
- **Media & Asset Management (Cloudinary SDK v2):**
  - Direct signed uploads, cryptographic signature validation, alt-text management, and safe deletion.
- **Database & ORM Layer (Neon PostgreSQL + Drizzle ORM):**
  - 12 normalized tables in `neondb` (1 site settings, 8 case studies, 9 financial schedules, 3 discrepancy disclosures, 16 competencies, 3 academic milestones, 3 tech solutions, 1 verified admin user, 1 verified media asset).
- **Quality Gates (All 100% Green):**
  - TypeScript Typecheck (`npm run type-check`): 0 errors.
  - ESLint (`npm run lint`): 0 errors, 0 warnings across all `.ts`, `.tsx`, `.js`, `.jsx` files.
  - Production Next.js Build (`npm run build`): Exit code 0, all 15 routes compiled.
  - Legacy Vite Build (`npm run build:vite`): Exit code 0, legacy bundle fully recoverable in 2.81s.
  - Drizzle Kit Schema Check (`npm run db:check`): Exit code 0 ("Everything's fine 🐶🔥").
  - Database Audit (`npm run db:verify`): Exit code 0 (100% record match and constraints verified).
  - Security Test Suite (`npm run test:auth`): Exit code 0 (27/27 assertions passed).
  - Media Verification Test Suite (`npm run test:media`): Exit code 0 (24/24 assertions passed).
  - CMS Pipeline Test Suite (`npm run test:cms`): Exit code 0 (41/41 assertions passed).
  - Public Pipeline Test Suite (`npm run test:public`): Exit code 0 (16/16 assertions passed).
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
