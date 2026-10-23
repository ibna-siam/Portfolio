# Phase 11 Audit Report: SEO, Content Quality & Career-Readiness Optimization

**Date:** October 2026  
**Auditor:** Senior Technical SEO Specialist, Portfolio Content Strategist, Accessibility Engineer & Next.js Performance Architect  
**Target Domain:** `https://ibnasiam.vercel.app`  
**Identity:** Md Ibna Siam — BBA in Accounting Candidate, Daffodil International University (ID: 252-58-083)  
**Career Trajectory:** Accounting, Finance, Taxation, Internal Audit, Financial Analysis & ACCA Pathway (in planning)  

---

## 1. Baseline Technical SEO Audit

An inspection of the active codebase revealed the following baseline state and confirmed deficiencies:

### 1.1 Metadata Architecture (`src/app/layout.tsx`, `page.tsx`, `case-studies/page.tsx`, `case-studies/[slug]/page.tsx`)
- **CRITICAL GAP 1 (Global Noindex)**: In `src/app/layout.tsx` (lines 12–15), `robots` was configured as:
  ```ts
  robots: {
    index: false,
    follow: false,
  }
  ```
  This completely blocks search engines from indexing the production website at `https://ibnasiam.vercel.app`. Public routes must be updated to `index: true, follow: true`, while private admin routes remain strictly `index: false, follow: false`.
- **CRITICAL GAP 2 (Missing `metadataBase`)**: `src/app/layout.tsx` lacks `metadataBase: new URL("https://ibnasiam.vercel.app")`. Without this, relative canonical paths and Open Graph image URLs fail or produce Next.js build warnings.
- **GAP 3 (Missing Open Graph & Twitter Card Metadata)**:
  - Root layout and public routes lack structured Open Graph (`og:type`, `og:site_name`, `og:locale`, `og:image`, `og:url`) and Twitter Card (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`) metadata.
- **GAP 4 (Missing Canonical URLs)**: Neither the home page (`/`), catalog (`/case-studies`), nor case study detail pages (`/case-studies/[slug]`) specify `alternates.canonical`.

### 1.2 Crawling & Indexing Infrastructure
- **GAP 5 (No `robots.txt` / `robots.ts`)**: There is no `robots.ts` or `public/robots.txt` in the Next.js App Router application. Search engine crawlers have no directive guiding them away from `/admin/` or `/api/` endpoints, or toward the sitemap.
- **GAP 6 (No `sitemap.xml` / `sitemap.ts`)**: There is no XML sitemap generation. Search engines cannot programmatically discover published case studies. The sitemap must be dynamically generated from published case studies while strictly excluding draft studies, admin routes, and internal endpoints.

### 1.3 Structured Data (Schema.org JSON-LD)
- **GAP 7 (Missing JSON-LD in Next.js App Router)**: While the legacy Vite `index.html` contained a static `Person` schema, the migrated Next.js App Router does not currently render structured data.
- **Requirement**: Provide verified, factual JSON-LD schemas:
  - `Person` schema on Homepage: verified name, university affiliation (`Daffodil International University`), verified social profiles (LinkedIn, GitHub), and core accounting competencies. Zero fabricated credentials (no claim of earned ACCA membership or registration).
  - `WebSite` schema on Homepage: official name, URL, publisher.
  - `Article` / `ScholarlyArticle` schema on Case Study detail pages: title, description, author, datePublished, dateModified, discipline category.

---

## 2. Content Quality & Career-Readiness Audit

### 2.1 Discipline Hierarchy (75% Accounting & Finance vs. 25% Supporting Tech)
- **Current Assessment**: The portfolio clearly prioritizes corporate financial reporting, cost accounting, taxation compliance, and ratio analysis.
- **Tech Solutions Framing**: Confirmed properly positioned as "Supporting Capability · 25% Weight" under `PublicTechSolutions`. Software tools are framed as multipliers for accounting precision rather than positioning Siam as a full-time software developer.
- **ACCA Trajectory**: Stored and rendered as "Career Pathway in Planning". VAL-03 integrity notice is maintained; zero claims of completed ACCA examinations or unverified charterholder status exist.

### 2.2 Financial Integrity & Disclosure Protections
- **VAL-07 (Phone Number Privacy)**: Stored in DB with `phonePrivacyStatus = 'hidden'`. Public UI components strictly exclude phone number. Verified.
- **VAL-08 (Square Pharma Overhead Savings)**: Framed strictly as an academic proposed saving (8%), not an achieved corporate outcome.
- **VAL-09 (Income Tax Return Arithmetic)**: Gross Tax (68,750) - Rebate (32,000) - TDS (48,500) = Net Refund (11,750). Historical source narrative divergence preserved and prominently disclosed via `DiscrepancyNotice`.
- **VAL-10 (StyleTex RMG Costing Contribution Margin)**: VC calculation divergence (BDT 380 vs BDT 420 row) preserved and disclosed.
- **VAL-11 (FIFA World Cup Macroeconomic Impact)**: Total direct sector impact (BDT 43,420 cr) exceeding total headline impact (BDT 24,500 cr) preserved and disclosed.
- **Rule**: Zero database records will be modified or figures rewritten during this phase.

### 2.3 Contact & Professional Presence
- **LinkedIn**: `https://www.linkedin.com/in/ibnasiam/` (verified).
- **GitHub**: `https://github.com/ibna-siam` (verified).
- **Formspree**: Working endpoint `https://formspree.io/f/mjgzqeeg` with client validation and confirmation state.

---

## 3. Planned Implementation Plan

1. **Root Layout Metadata Enhancement (`src/app/layout.tsx`)**:
   - Add `metadataBase: new URL("https://ibnasiam.vercel.app")`.
   - Update `robots`: Allow public indexing (`index: true, follow: true`, with GoogleBot directives).
   - Configure global Open Graph and Twitter Card defaults with fallback image `/assets/siam.jpeg`.
   - Add canonical link alternates.
2. **Robots Route Handler (`src/app/robots.ts`)**:
   - Implement Next.js `robots()`:
     - `allow: ["/", "/case-studies", "/case-studies/*"]`
     - `disallow: ["/admin", "/admin/*", "/api/*"]`
     - `sitemap: "https://ibnasiam.vercel.app/sitemap.xml"`
3. **Dynamic XML Sitemap (`src/app/sitemap.ts`)**:
   - Implement Next.js `sitemap()`:
     - Fetch only *published* case studies (`isDraftMode: false`).
     - Map `/`, `/case-studies`, and `/case-studies/[slug]` with appropriate `lastModified`, `changeFrequency`, and `priority`.
     - Zero admin, draft, or api routes included.
4. **Structured Data (JSON-LD)**:
   - Create reusable `<JsonLd>` component or inline script for:
     - `Person` & `WebSite` schema on Homepage (`src/app/page.tsx`).
     - `Article` schema on Case Study detail page (`src/app/case-studies/[slug]/page.tsx`).
5. **Page-Level Metadata Enhancements**:
   - Homepage (`src/app/page.tsx`): targeted canonical, Open Graph, Twitter.
   - Catalog (`src/app/case-studies/page.tsx`): targeted canonical, Open Graph, Twitter.
   - Detail (`src/app/case-studies/[slug]/page.tsx`): dynamic canonical, Open Graph article tags, published/modified dates, dynamic image.
6. **Automated Verification Script**:
   - Create `scripts/test-seo-pipeline.ts` to programmatically validate sitemap entries, robots rules, metadata completeness, JSON-LD validity, and draft route exclusion.
   - Run complete suite: `type-check`, `build`, `build:vite`, `test:public`, `test:auth`, `test:cms`.
7. **Documentation**:
   - Generate `PHASE_11_IMPLEMENTATION_REPORT.md`, `SEO_VALIDATION_REPORT.md`, `CONTENT_ACCURACY_REPORT.md`.
   - Update `PROJECT_CONTEXT.md`, `DEVELOPMENT_LOG.md`, `CURRENT_HANDOFF.md`, `IMPLEMENTATION_ROADMAP.md`.

---

## 4. Potential Risks & Mitigation

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Accidental indexing of `/admin`** | Information disclosure / security | Strict `disallow: ["/admin", "/admin/*", "/api/*"]` in `robots.ts` AND explicit `noindex, nofollow` in `src/app/(admin)/layout.tsx`. |
| **Draft case studies leaked in sitemap** | Unintentional publication of work-in-progress | Sitemap query strictly filters `where: eq(caseStudies.status, 'published')`. |
| **Over-promising ACCA status in JSON-LD** | Credential misrepresentation | Schema `alumniOf` and `jobTitle` strictly reference student status; ACCA trajectory omitted from formal credential fields. |
| **Broken relative URLs without `metadataBase`** | Social sharing preview failures | Configure authoritative `metadataBase: new URL("https://ibnasiam.vercel.app")` at root layout. |
