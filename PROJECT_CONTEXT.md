# Project Context: Siam's Personal Portfolio & Portfolio CMS

**Project:** Siam's Personal Portfolio & Portfolio CMS Evolution  
**Repository:** [https://github.com/ibna-siam/Portfolio](https://github.com/ibna-siam/Portfolio)  
**Production Site:** [https://ibnasiam.vercel.app/](https://ibnasiam.vercel.app/)  
**Target Identity:** Md Ibna Siam — Accounting & Finance Student, Daffodil International University (Academic ID: 252-58-083)  
**Career Target:** ACCA (Association of Chartered Certified Accountants) Pathway  
**Current Architecture Status:** Phase 8 Local Staging Validated (Production Vite SPA active on `main` at `https://ibnasiam.vercel.app/`; Next.js App Router Portfolio CMS on `feat/nextjs-cms-migration` passing 100% of quality gates; isolated Vercel preview ready upon owner push authorization)  
**Planned Target Architecture:** Full-Stack Portfolio CMS (Next.js App Router + Neon PostgreSQL + Drizzle ORM + Auth.js + Cloudinary)  
**Design Direction:** Executive Claymorphism  

---

## 1. Executive Summary & Professional Context

This repository houses the personal professional portfolio and future Portfolio CMS of **Md Ibna Siam**, an undergraduate BBA Accounting & Finance candidate at Daffodil International University (DIU), Dhaka, Bangladesh.

The platform is designed to present Siam's authentic profile to corporate audit firms, accounting practices, multinational corporations, and academic collaborators. It emphasizes:
- **Core Discipline (75% content weight):** Financial Accounting, Managerial & Cost Accounting, Auditing & Internal Controls, Taxation & VAT (Bangladesh Income Tax Act 2023), Financial Statement & Ratio Analysis, and ACCA career preparation.
- **Supporting Strengths (25% content weight):** Business Operations, Management, Financial Technology, Spreadsheet/ERP Modeling, Dashboards, and Software Problem-Solving.
- **Career Direction:** ACCA qualification in planning; no unverified completion or student status claimed.
- **Strict Privacy Enforcement:** Personal phone number (`+880 1841-380687`) is strictly excluded from all public UI displays; university email (`252-58-083@diu.edu.bd`) and verified LinkedIn profile are the canonical contact channels.

---

## 2. Verified Current Architecture (Baseline)

The current codebase is an active, production-ready client-side single-page application (SPA) deployed on Vercel at `https://ibnasiam.vercel.app/`.

### 2.1 Current Tech Stack & Dependencies
- **UI Framework:** React 19 (`react` 19.2.6, `react-dom` 19.2.6) — verified natively compatible with Next.js 15+
- **Build System & Bundler:** Vite 8.0.12 (with `@vitejs/plugin-react` 6.0.1)
  - Configured with `base: '/'` in `vite.config.js`
  - Output directory: `dist/`
  - Zero server-side runtime code (pure client-side static asset compilation)
  - Production build measurement: compiles in **2.54s** (JS: **487.95 kB** / **145.26 kB gzip**; CSS: **42.64 kB** / **7.74 kB gzip**)
- **Styling:** Tailwind CSS 3.4.19 & PostCSS 8.5.15
  - Color palette: `ink` (Slate/Navy foundation), `emerald` (financial growth primary), `amber` (variance/warning alerts)
  - Typography: Google Fonts loaded via preconnect in `index.html` (`Playfair Display`, `DM Sans`, `JetBrains Mono`)
  - Numerals: `.tabular-nums` (`font-variant-numeric: tabular-nums`)
- **Animation:** Framer Motion 12.40.0 (respecting `prefers-reduced-motion: reduce`)
- **Icons:** React Icons 5.6.0 (`react-icons/fi`)
- **Analytics:** `@vercel/speed-insights/react` 2.0.0
- **Quality Gates:** ESLint 10.3.0 (enforces 0 errors, 0 warnings; verified passed)
- **Forms & External Endpoints:** Formspree (`https://formspree.io/f/mjgzqeeg`) with client-side fetch, validation, and confirmation state.
- **Hosting & Infrastructure:** Deployed via Vercel (`.vercel/repo.json` linked to project `prj_T00X3uhpDtkTm4pFvJM0Erk6rYiY`, team `team_6huIBAQMDMO9mtWLuM5ijPxr`).
- **Audit Deliverables:** Detailed architecture audit in [`ARCHITECTURE_AUDIT.md`](file:///d:/Project/portfolio%20siam/ARCHITECTURE_AUDIT.md) and migration execution plan in [`MIGRATION_PLAN.md`](file:///d:/Project/portfolio%20siam/MIGRATION_PLAN.md).

### 2.2 Current Codebase Structure & Data Flow
```
src/
├── App.jsx                     # Root component mounting 7 sections & SpeedInsights
├── main.jsx                    # React 19 createRoot DOM entry
├── index.css                   # Tailwind directives, base layers, tabular-nums utility
├── hooks/
│   └── index.js                # Custom hooks: useTheme, useActiveSection, useTypingEffect
├── assets/
│   └── siam.jpeg               # Profile portrait (203.1 KB)
├── data/
│   ├── portfolioData.js        # Master dataset (personal info, about, 8 academic studies)
│   ├── caseStudyIntegrity.js   # Integrity audit register & discrepancy notes for all 8 studies
│   ├── competenciesData.js     # Evidence-based 16-competency matrix across 4 domains
│   ├── academicJourneyData.js  # Confirmed academic milestones & ACCA roadmap
│   └── techSolutionsData.js    # 3 business-technology problem solving systems
└── components/
    ├── Navbar.jsx              # Executive wordmark, credential pill, navigation drawer
    ├── Hero.jsx                # Accounting headline, verified CV CTA, portrait card, domain ribbon
    ├── About.jsx               # Academic narrative, 4 factual highlight cards
    ├── Skills.jsx              # Competencies Matrix with discipline filters & ARIA tablist
    ├── Projects.jsx            # Case Studies Showcase & 5-tab Interactive Modal Viewer
    ├── TechSolutions.jsx       # 3 Technology Solutions (~25% weight) with status badges
    ├── Experience.jsx          # Academic Progression timeline & ACCA qualification card
    ├── Contact.jsx             # Accessible Formspree form, inquiry selector, copy-email button
    ├── Footer.jsx              # Canonical links, verified dossier anchors, back-to-top button
    └── SectionHeading.jsx      # Canonical section header component
```

### 2.3 Current Data Storage & Content Limitations
- **All content is static in JavaScript files:** Updates to research papers or coursework require code modifications and redeployments.
- **No authentication or administrative panel:** There is no `/admin` route or administrative access controls.
- **No drafting or previewing mechanism:** Content is either in production or in git branches.
- **Static SEO:** Global metadata is embedded directly into `index.html`. Deep case study sharing relies on URL hashes (`#projects`) without dedicated open-graph preview images per study.

### 2.4 Next.js Foundation & Database Layer on Migration Branch (`feat/nextjs-cms-migration`)
As established during Implementation Phases 1 and 2, the codebase on `feat/nextjs-cms-migration` features an isolated Next.js App Router and Drizzle ORM foundation coexisting non-destructively alongside the legacy Vite application:
- **Next.js App Router Architecture:** Next.js 15.5.28 configured with TypeScript 5.9.3, React 19.2.6, and Tailwind CSS 3.4.19.
  - Root Layout (`src/app/layout.tsx`): Establishes HTML shell, global Tailwind styles (`src/index.css`), metadata title/description, and search engine privacy indexation suppression (`robots: { index: false, follow: false }`).
  - Temporary Foundation Home (`src/app/page.tsx`): Minimal diagnostic status and navigation page linking to the live production portfolio.
  - Next.js Configuration (`next.config.ts`): Strict React mode enabled, Cloudinary remote image pattern configured.
  - Path Aliasing (`tsconfig.json`): `@/*` mapped to `./src/*` with strict type checking enabled.
- **Relational Schema & Database Architecture (12 Tables in Neon PostgreSQL):**
  - Neon Serverless PostgreSQL driver: `@neondatabase/serverless` 1.2.0.
  - Drizzle ORM & Kit: `drizzle-orm` 0.45.4, `drizzle-kit` 0.31.11.
  - Migration: `drizzle/0000_large_slayback.sql` generated and applied successfully against Neon PostgreSQL `neondb`.
  - Normalized Schema Tables (`src/lib/db/schema.ts`):
    1. `users`: Auth.js-compatible admin credential entity.
    2. `site_settings`: Site profile, bio, headline, social links, ACCA trajectory, and strict privacy guardrail VAL-07 (`phonePrivacyStatus = 'hidden'`).
    3. `system_settings`: Operational key-value storage.
    4. `case_studies`: 8 academic research papers with methodology, findings, recommendations, formulas, audit notes, and draft/published status.
    5. `financial_schedules`: Tabular financial schedules with typed JSONB headers/rows for `.tabular-nums` formatting.
    6. `case_study_discrepancies`: Formal disclosures for the 3 mathematical discrepancies (VAL-09, VAL-10, VAL-11).
    7. `competencies`: 16 evidence-based competencies across 4 domains.
    8. `academic_milestones`: 3 confirmed education milestones.
    9. `tech_solutions`: 3 business/tech problem-solving systems.
    10. `media_assets`: Register for Cloudinary uploaded assets.
    11. `content_revisions`: Append-only snapshots supporting Draft -> Preview -> Publish lifecycle and safe rollback.
    12. `activity_logs`: Administrative action audit trail.
- **Automated Seeding Pipeline & Verification Tooling:**
  - `scripts/seed.ts`: Fully idempotent TypeScript seed script with `--dry-run` and live execution modes.
  - `scripts/verify-db.ts`: Automated read-only audit script verifying 100% record parity and foreign key constraints.
  - Database Content Synced: 1 site settings record, 8 case studies, 9 financial schedules, 3 discrepancy disclosures, 16 competencies, 3 academic milestones, 3 tech solutions.
- **Legacy Vite Application Preservation & Recovery:**
  - All existing Vite source files (`src/App.jsx`, `src/main.jsx`, `src/components/`, `src/data/`, `src/hooks/`, `src/assets/`, `index.html`, `vite.config.js`) remain 100% unaltered.
  - Dual build scripts in `package.json`: `npm run build` runs Next.js production build (`next build`); `npm run build:vite` runs legacy Vite build (`vite build`). Both compile cleanly with zero errors.
- **Environment Isolation:**
  - `.env.example`: Non-secret template documenting `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `AUTH_SECRET`, and `AUTH_URL`.
  - `.gitignore`: Hardened against `.next/`, `out/`, `drizzle/` build artifacts, while preserving `.env.example`.
- **Auth.js Authentication & Server-Enforced Admin Boundary (Phase 3 Completed):**
  - **Auth Stack:** `next-auth@5.0.0-beta.32`, `bcryptjs` (cost factor 12), `@types/bcryptjs`.
  - **Strategy:** Credentials Provider with JWT session tokens. Eliminates unnecessary database session tables while strictly verifying administrator roles on the server.
  - **Schema Compatibility:** Directly reuses the existing, verified `users` table (`id`, `email`, `role`, `passwordHash`, `name`, `createdAt`, `updatedAt`). Zero DDL migrations required.
  - **Edge Middleware Protection (`src/middleware.ts`):** Employs lightweight, edge-compatible `src/auth.config.ts` to intercept `/admin/:path*` requests, automatically redirecting unauthenticated or non-admin visitors to `/admin/login`.
  - **Server-Side Authorization Guard (`src/lib/auth.ts`):** Provides reusable `requireAdmin()` for Server Components and Server Actions, guaranteeing role enforcement even if middleware is bypassed.
  - **Open-Redirect Neutralization (`sanitizeCallbackUrl()`):** Strictly confines post-login return URLs to internal relative paths, preventing open-redirect exploits.
  - **Brute-Force & Attempt Limiting (`src/lib/auth-limiter.ts`):** Enforces sliding-window rate limiting (maximum 5 failed attempts per 15 minutes per identifier) with automatic account lockout and retry countdown.
  - **Initial Administrator Provisioning (`scripts/create-admin.ts` / `npm run db:admin:create`):** Safe, idempotent CLI tool for seeding and rotating administrative credentials using bcrypt-12 hashing without plaintext exposure.
  - **Executive Claymorphism Admin Interface:**
    - Login portal (`src/app/(admin)/admin/login/page.tsx` & `login-form.tsx`): Tactile claymorphic surfaces, accessible inputs, show/hide password toggle, and error feedback.
    - Protected Entry Console (`src/app/(admin)/admin/page.tsx`): Displays verified server session identity, boundary health checklist, and working server-action sign-out.
  - **Automated Security Verification:** `scripts/test-auth-boundary.ts` (`npm run test:auth`) validating 27 automated assertions across redirects, rate limiting, and role enforcement.

### 2.5 Cloudinary Media Storage & Asset Management (Phase 4 Completed)
- **Official Cloudinary Node.js SDK:** Integrated `cloudinary@2.11.0` exclusively on the server side (`src/lib/cloudinary.ts`).
- **Cryptographic Security & Zero-Secret Exposure:**
  - `CLOUDINARY_API_SECRET` is kept strictly server-side in `.env` and never exposed via `NEXT_PUBLIC_*`, client components, or API payloads.
  - Signed Direct Upload Architecture:
    1. Authenticated administrator requests an upload signature via Server Action (`getUploadSignatureAction`).
    2. Server validates admin session (`requireAdmin()`) and generates a short-lived SHA-1/HMAC signature constrained to the `portfolio/media` namespace.
    3. Browser uploads directly to Cloudinary's REST API endpoint (`api.cloudinary.com/v1_1/:cloud_name/image/upload`) using the signed ticket.
    4. Browser sends returned upload metadata back to the Server Action (`registerMediaAssetAction`).
    5. Server independently verifies Cloudinary's cryptographic signature using `cloudinary.v2.utils.verifyNotificationSignature` / official SDK signature verification before registering metadata in Neon PostgreSQL.
- **Strict File Validation & Whitelisting:**
  - Formats: Strictly limited to web-safe raster formats (`jpg`, `jpeg`, `png`, `webp`). Executable or active formats like SVG are rejected.
  - Payload Limit: Enforced at 5 MB (5,242,880 bytes).
  - Uniqueness & Collision Resistance: Public IDs are slug-normalized, collision-safe, and scoped under `portfolio/media`.
- **Database Metadata Storage (`media_assets` table):**
  - Reused existing schema (`id`, `publicId`, `url`, `secureUrl`, `format`, `resourceType`, `width`, `height`, `bytes`, `altText`, `caption`, `createdAt`, `updatedAt`). Zero DDL migrations required.
  - Idempotent conflict resolution (`onConflictDoUpdate`) on `publicId` prevents duplication on retry.
- **Destructive Deletion Safeguards:**
  - Server Action (`deleteMediaAssetAction`) independently verifies admin status and validates asset existence.
  - Published Content Reference Protection: Queries `siteSettings` (`avatarUrl`, `resumeUrl`) to reject deletion if the asset is currently referenced by published content.
  - Cloudinary invalidation executed first; database record removed only upon confirmed provider deletion.
- **Executive Claymorphism Media Library UI (`/admin/media`):**
  - Gated server-side behind `requireAdmin()`.
  - Responsive asset grid with aspect-ratio wells, format badges, and live search.
  - Format filters (All, JPEG, PNG, WebP).
  - Asset Detail Inspector with clipboard copy-URL action and visual confirmation feedback.
  - Inline Alt-Text Editor for WCAG 2.1 AA accessibility compliance.
  - Destructive Deletion Modal with safety warning.
  - Diagnostic Configuration Banner indicating operational status without crashing if credentials are unconfigured.
- **Automated Verification & Verified Live Asset:**
  - Automated test suite `scripts/test-media-pipeline.ts` (`npm run test:media`) passing 24/24 assertions.
  - Profile portrait `src/assets/siam.jpeg` successfully uploaded and registered in `media_assets` with public ID `portfolio/media/siam_portrait`.
  - Zero modifications to public site portrait references (`Hero.jsx`, `portfolioData.js`) in this phase.

### 2.6 Core CMS Content Models & Admin UI (Phase 5 Completed)
- **Executive Claymorphism Navigation & Administrative Console:**
  - `src/components/admin/admin-nav.tsx`: Persistent header providing unified navigation across `/admin`, `/admin/case-studies`, `/admin/competencies`, `/admin/academic-journey`, `/admin/tech-solutions`, and `/admin/media`.
  - Overhauled `/admin` console with live statistics cards for all entities and real-time recent activity log feed.
- **Primary Case Studies Management (`/admin/case-studies`):**
  - Full CRUD operations with search, discipline group filtering (Group A / Group B), and draft/published status toggles.
  - Structured editor (`/admin/case-studies/[id]/edit` & `/new`) with fields for methodology, findings, audit notes, recommendations, and associated media.
  - **Tabular Financial Schedule Matrix Editor:** Interactive editor for complex accounting schedules (e.g. Budgeted Income Statements, Ratio Summaries, Tax Computations) with column/row reordering, type validation, and `.tabular-nums` preview before saving.
  - **Financial Integrity & Discrepancy Guardrails:** Explicit warning alerts for case studies with historical discrepancies (VAL-09, VAL-10, VAL-11). Deletion safeguard in `deleteCaseStudyAction` strictly blocks deleting case studies bound to active discrepancy disclosures.
  - **Admin-Only Draft Preview (`/admin/case-studies/[id]/preview`):** Gated draft render environment displaying full narrative, tabular schedules, and discrepancy notices with a direct "Publish Now" button.
- **Supporting Content Modules:**
  - **Competencies (`/admin/competencies`):** Filterable management across all 4 domains (`Financial Accounting`, `Managerial Accounting`, `Taxation & Audit`, `Software & Tech`). Prevents fabricating unverified credentials.
  - **Academic Journey & ACCA Trajectory (`/admin/academic-journey`):** Manages verified milestones (`BBA Accounting`, `HSC Business`, `SSC Business`) and ACCA roadmap planning while safeguarding privacy (`phonePrivacyStatus = 'hidden'`) and preventing unverified completion claims.
  - **Tech Solutions (`/admin/tech-solutions`):** Manages 3 business/tech problem-solving solutions with safe URL scheme validation.
- **Media Picker Modal (`src/components/admin/media-picker-modal.tsx`):**
  - Reusable modal dialog enabling selection and association of registered Cloudinary assets without duplicating records or re-uploading files.
- **Append-Only Revision Snapshotting & Audit Trail (`src/lib/cms-audit.ts`):**
  - Monotonic sequential revision numbers in `content_revisions` capturing full JSONB snapshots on creation, update, and publish events.
  - Administrative audit logging in `activity_logs` attributing mutations to verified administrator sessions.
- **Automated Verification:**
  - Test suite `scripts/test-cms-pipeline.ts` (`npm run test:cms`) passing 41/41 assertions.

---

## 3. Planned Target Architecture (Full Portfolio CMS)

The target architecture elevates the existing portfolio into a full-stack, database-backed Portfolio CMS with an authenticated Admin Panel, while preserving existing verified content, financial rigor, and visual identity.

### 3.1 Approved Future Technology Stack
- **Framework:** **Next.js (App Router)**
  - Server Components (RSC) for public data fetching, streaming, and SEO
  - Server Actions for type-safe administrative mutations and authentication
  - API Routes / Handlers for Draft Mode previewing and webhook callbacks
- **Database:** **Neon PostgreSQL**
  - Serverless PostgreSQL with auto-scaling, instantaneous branching, and connection pooling
  - Zero server maintenance overhead
- **ORM:** **Drizzle ORM**
  - Fully type-safe TypeScript schema definitions
  - Parameterized queries with near-zero runtime overhead
  - Declarative migrations via Drizzle Kit (`drizzle-kit generate` & `drizzle-kit migrate`)
- **Authentication:** **Auth.js (NextAuth v5)**
  - Session protection for the `/admin` route
  - Secure HTTP-only cookies and JWT session handling
  - Credentials and OAuth provider capabilities
- **Media & Asset Management:** **Cloudinary**
  - Cloud-hosted media library with on-the-fly image transformations (`f_auto,q_auto`)
  - Direct signed uploads from the admin dashboard
  - Responsive image optimization replacing uncompressed static files
- **Design Direction:** **Executive Claymorphism**
  - Tactile 3D containers with soft double-drop shadows and subtle inner highlights
  - Deep Navy/Ink canvas (`#0A0F1D`), Emerald Jade accents (`#059669`), and Amber variance cues
  - Seamless dark and light mode adaptation for both public showcase and dense admin dashboards
- **Deployment Platform:** **Vercel**
  - Native Next.js App Router support, Edge middleware, and zero-config deployment

### 3.2 Target Routing Architecture
```
app/
├── (public)/
│   ├── layout.tsx              # Public shell (Navbar, Footer, Claymorphism background)
│   ├── page.tsx                # Homepage (Hero, Ribbon, About, Skills, Studies, Tech, Journey, Contact)
│   ├── case-studies/
│   │   └── [slug]/
│   │       └── page.tsx        # Deep-linkable server-rendered case study detail page
│   └── api/
│       ├── draft/route.ts      # Next.js Draft Mode enable/preview handler
│       └── disable-draft/      # Draft Mode disable handler
├── (admin)/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx        # Secure administrative login
│   │   ├── layout.tsx          # Authenticated admin shell (Sidebar, Claymorphic navigation)
│   │   ├── page.tsx            # Admin Dashboard (Overview stats, activity feed)
│   │   ├── case-studies/
│   │   │   ├── page.tsx        # Case studies list with status pills (Draft/Published)
│   │   │   ├── new/page.tsx    # Case study creator & schedule builder
│   │   │   └── [id]/page.tsx   # Case study editor, audit note register, revision log
│   │   ├── competencies/
│   │   │   └── page.tsx        # Competency matrix CRUD
│   │   ├── academic-journey/
│   │   │   └── page.tsx        # Education & ACCA roadmap editor
│   │   ├── tech-solutions/
│   │   │   └── page.tsx        # Supporting business/tech projects editor
│   │   ├── media/
│   │   │   └── page.tsx        # Cloudinary media library & direct uploader
│   │   ├── seo/
│   │   │   └── page.tsx        # Global & per-route metadata controls
│   │   └── activity/
│   │       └── page.tsx        # Audit log & revision history viewer
```

---

## 4. Migration Strategy & Constraints

### 4.1 Migration Principles
1. **Zero Data Loss & Content Preservation:** All 8 existing academic case studies, 4 integrity disclosures, 16 competencies, 3 confirmed education milestones, and 3 technology solutions must be migrated to Neon PostgreSQL.
2. **Strict Financial Integrity Preservation:** Mathematical discrepancies identified in Phase 6 (Individual Income Tax return net refund divergence, StyleTex RMG shirt contribution margin calculation, and FIFA World Cup direct vs total economic impact conflict) must **NOT** be silently changed or reconciled during migration. They must be ported directly into the database's `case_study_discrepancies` table and transparently displayed in the Case Study Viewer.
3. **Public Route & Component Parity:** The public portfolio must retain all functional capabilities (smooth navigation, dark/light theme switching, Formspree contact submission, verified CV downloads, responsive modal viewer, `.tabular-nums` formatting).
4. **Isolated Step-by-Step Rollout:** Application source code, dependencies, and deployment settings remain untouched during this audit phase (Phase 0). Migration will proceed incrementally according to the approved roadmap.

### 4.2 Security Boundaries
- **Public Surface:** Read-only Server Component queries against published records (`status = 'published'`). No administrative queries or draft data exposed on public endpoints.
- **Admin Surface:** Strictly gated behind Auth.js middleware. Unauthenticated requests to `/admin/*` redirect immediately to `/admin/login`.
- **Database Boundary:** Database credentials (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`) are strictly server-side environment variables. Drizzle queries execute exclusively on the server (Server Components or Server Actions).
- **Media Boundary:** Cloudinary API Secret is strictly server-side. Client-side uploads in `/admin/media` utilize signed upload signatures generated via Server Actions.

### 4.3 Deployment Considerations
- **Platform:** Vercel root deployment.
- **Environment Variables Required in Target Stack:**
  - `DATABASE_URL` (Neon Pooled connection string for serverless queries)
  - `DATABASE_URL_UNPOOLED` (Neon Direct connection string for Drizzle migrations)
  - `AUTH_SECRET` (NextAuth encryption secret)
  - `AUTH_ADMIN_EMAIL` / `AUTH_ADMIN_PASSWORD` (or OAuth credentials)
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
  - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
  - `DRAFT_MODE_SECRET` (For previewing unpublished drafts)
- **Legacy Cleanup Checkpoint:** During migration, remove obsolete `gh-pages` script and dependency from `package.json` to eliminate hosting conflict with Vercel.

---

## 5. Known Inconsistencies & Unresolved Decisions

The following items are formally registered as pending owner decisions or known source data limitations:

| Register ID | Item | Current Status | Description & Context |
|---|---|---|---|
| **VAL-03** | **ACCA Registration / Exam Progress** | Unconfirmed | ACCA is presented strictly as a career trajectory. Specific exam pass status or registration number requires owner confirmation: `[ACCA REGISTRATION / EXAM STATUS — OWNER TO CONFIRM]`. |
| **VAL-07** | **Phone Number Publication** | Consent Unconfirmed | Phone number (`+880 1841-380687`) exists in raw source data but is excluded from the UI until explicit owner publication consent is granted. |
| **VAL-08** | **Square Pharma Overhead Claim** | Unsubstantiated | Raw source claims "saved estimated 8% overhead"; framed strictly as an academic proposal in the integrity registry. |
| **VAL-09** | **Income Tax Return Arithmetic** | Inconsistent in Source | Gross Tax (68,750) - Rebate (32,000) - TDS (48,500) = Net Refund (11,750), whereas narrative summary mentions BDT 19,250 payable / 1,750 refund. Ported with explicit discrepancy disclosure. |
| **VAL-10** | **RMG Cost Sheet Contribution Margin** | Inconsistent in Source | Shirt VC (680 + 320 + 120 = 1,120) vs SP (1,500) yields arithmetic CM of BDT 380 (25.33%), while table row states BDT 420 (28.0%). Ported with explicit discrepancy disclosure. |
| **VAL-11** | **FIFA World Cup Direct vs Total Data** | Inconsistent in Source | Line claims total impact of BDT 24,500 crore, while sector table lists total direct impact of BDT 43,420 crore (direct exceeds total). Ported with explicit discrepancy disclosure. |
| **VAL-12** | **Expected Graduation Date** | Unconfirmed | Placeholder `[GRADUATION DATE — OWNER TO CONFIRM]` preserved. |
| **VAL-13** | **University Academic GPA / CGPA** | Unconfirmed | Placeholder `[ACADEMIC RESULT / CGPA — OWNER TO CONFIRM]` preserved. |
| **VAL-14** | **College & School GPAs (HSC / SSC)** | Unconfirmed | Placeholders preserved to prevent fabricating grades. |
| **VAL-15** | **Work Experience / Internships** | Unconfirmed | Placeholder `[WORK EXPERIENCE / INTERNSHIP ENGAGEMENTS — OWNER TO CONFIRM]` preserved. |

---

## 6. Current Technical Limitations & Migration Risks

1. **Monolithic Data Extraction:** The static data files contain raw strings, nested objects, and formatting quirks. A robust migration seed script must parse and insert these records into PostgreSQL without schema truncation.
2. **Financial Table Dynamism:** The 8 case studies contain different tabular structures (e.g., 3-year ratios vs. cost breakdown schedules vs. tax brackets). The database schema must use flexible JSONB column storage for table headers and rows while preserving `.tabular-nums` formatting.
3. **Draft Mode Security:** Next.js Draft Mode must be properly secured with a cryptographic secret to prevent unauthorized public access to unpublished draft case studies.
4. **Cloudinary Asset Transition:** Profile portraits and documents currently located in `src/assets/` or Google Drive must be mirrored to Cloudinary with fallback handling to guarantee zero 404 image errors during DNS propagation.
6. **Deployment Isolation & Handoff (Phase 8.1):** Live production website (`https://ibnasiam.vercel.app/`) is powered by Vercel project `portfolio` (`prj_T00X3uhpDtkTm4pFvJM0Erk6rYiY`) on `main` (Vite SPA) and remains 100% untouched. The Next.js migration will deploy to an isolated preview project `portfolio-cms-preview` tracking `feat/nextjs-cms-migration` once authorized by the owner.
