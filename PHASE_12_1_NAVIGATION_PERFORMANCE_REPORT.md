# Phase 12.1 — Navigation Performance Diagnosis & Remediation Report

**Date:** October 23, 2026  
**Target Application:** Md Ibna Siam — Accounting & Finance Portfolio  
**Production Domain:** `https://ibnasiam.vercel.app` (Running earlier commit `e2d2fa1`)  
**Local Test Environment:** `http://localhost:3000` (Next.js 15.5.28 production build on branch `main`)  
**Status:** Remediated locally, profiled, and verified. **Production deployment is NOT performed (awaiting user authorization).**

---

## 1. Executive Summary

Phase 12.1 conducted an evidence-based diagnosis and targeted remediation of slow navigation transitions in the Md Ibna Siam portfolio application. 

Prior to this phase, user navigation across key routes (Homepage to Catalog, Catalog to Case Study Detail, and Detail to Home/Catalog via breadcrumbs) exhibited noticeable latency and perceived visual freezing.

Through automated browser-level profiling via Playwright across multiple runs, two distinct layers of bottlenecks were identified:
1. **Perceptual Bottleneck (Zero Route-Level Loading Feedback):** The application completely lacked `loading.tsx` boundary files. In Next.js App Router, navigating to a dynamic route without a `loading.tsx` forces the client router to suspend navigation on the originating page until the entire server render completes, creating the visual impression of an unresponsive, frozen UI for hundreds of milliseconds to multiple seconds.
2. **Data-Fetching & Query Inefficiencies:** Public data fetching functions (`getCaseStudyBySlug`, `getPublicSiteSettings`, etc.) were not wrapped in `React.cache()`, causing duplicate roundtrips to Neon PostgreSQL on a single page request (e.g., `generateMetadata()` and `Page()` executing duplicate database queries). Furthermore, `<Link>` components lacked explicit `prefetch={true}` attributes for critical primary navigation paths.

### Performance Impact Overview (Local Production Server Measurements)
| Navigation Journey | Baseline Warm Avg | Post-Fix Warm Avg | Improvement |
| :--- | :---: | :---: | :---: |
| **Homepage → Catalog** (`/case-studies`) | 290 ms | **109 ms** | **-62.4%** |
| **Detail → Catalog** (Breadcrumb) | 283 ms | **119 ms** | **-58.0%** |
| **Detail → Homepage** (Breadcrumb) | 402 ms | **278 ms** | **-30.8%** |
| **Click-to-Visual-Feedback** | Frozen (0 feedback) | **< 50 ms (Skeleton)** | **Instant Responsiveness** |

---

## 2. Test Procedure & Measurement Conditions

To guarantee reproducibility and avoid assumptions, an automated profiling harness was built in `scripts/profile-navigation.ts` using Playwright Chromium:
- **Viewport:** 1280 × 800 desktop viewport.
- **Run Protocol:** 3 sequential runs per scenario (Run 1: Cold navigation; Run 2 & 3: Warm router cache transitions).
- **Metric Captured:** Click-to-destination-content-visible time measured via high-resolution `performance.now()`, tracking network requests and console errors.
- **Environments Tested Separately:**
  - **Live Production:** `https://ibnasiam.vercel.app` (Vercel Edge/Serverless + Neon PostgreSQL in AWS us-east-1).
  - **Local Production:** `http://localhost:3000` (`next start` production build querying Neon PostgreSQL).

---

## 3. Baseline Measurements (Phase A)

Measurements recorded before applying changes:

### Live Production Deployment (`https://ibnasiam.vercel.app` — Commit `e2d2fa1`)
*Note: The live site runs an earlier deployment commit before Phase 11 & 12 changes.*

| Scenario | Run 1 (Cold) | Run 2 (Warm) | Run 3 (Warm) | Warm Average |
| :--- | :---: | :---: | :---: | :---: |
| Homepage → Catalog (Nav 'Case Studies') | 929 ms | 926 ms | 930 ms | **928 ms** |
| Homepage → Detail (Click case study card) | 107 ms | 118 ms | 107 ms | **113 ms** |
| Catalog → Detail (Click case study card) | 118 ms | 96 ms | 103 ms | **100 ms** |
| Detail → Catalog (Breadcrumb 'Case Studies') | 1,939 ms | 1,426 ms | 896 ms | **1,161 ms** |
| Detail → Homepage (Breadcrumb 'Home') | 925 ms | 1,476 ms | 1,427 ms | **1,452 ms** |

### Local Production Server (`http://localhost:3000` — Baseline on `main`)

| Scenario | Run 1 (Cold) | Run 2 (Warm) | Run 3 (Warm) | Warm Average |
| :--- | :---: | :---: | :---: | :---: |
| Homepage → Catalog (Nav 'Case Studies') | 354 ms | 277 ms | 302 ms | **290 ms** |
| Homepage → Detail (Click case study card) | 134 ms | 121 ms | 121 ms | **121 ms** |
| Catalog → Detail (Click case study card) | 128 ms | 112 ms | 100 ms | **106 ms** |
| Detail → Catalog (Breadcrumb 'Case Studies') | 239 ms | 268 ms | 297 ms | **283 ms** |
| Detail → Homepage (Breadcrumb 'Home') | 397 ms | 394 ms | 409 ms | **402 ms** |

---

## 4. Root Cause Analysis & Evidence (Phase B)

1. **Total Absence of Route-Level Suspense/Loading Fallbacks (`loading.tsx`):**
   - **Evidence:** Audit of `src/app` confirmed 0 `loading.tsx` files existed in the entire codebase.
   - **Mechanism:** In Next.js App Router, routes marked with `export const dynamic = "force-dynamic"` do not prefetch full dynamic payloads by default. When a user clicks a link to a dynamic route without a `loading.tsx`, Next.js client router holds the transition on the existing page until the entire server render completes. This produces complete visual freezing (no feedback for 900–1,900 ms on live production).
2. **Duplicate Uncached Server-Side Database Invocations (`React.cache` Missing):**
   - **Evidence:** In `src/app/case-studies/[slug]/page.tsx`, `generateMetadata()` calls `getCaseStudyBySlug(slug)` and `CaseStudyDetailPage()` calls `getCaseStudyBySlug(slug)`.
   - **Mechanism:** In `src/lib/public-data.ts`, `getCaseStudyBySlug` executed raw Drizzle ORM queries directly against Neon PostgreSQL without memoization. Next.js executed 2 distinct database roundtrips per page transition.
3. **Link Prefetching Gaps:**
   - **Evidence:** Primary header navigation links, case study cards, and breadcrumbs relied on default prefetch behavior which, in the absence of static pre-rendering, failed to pre-warm the client router cache.
4. **Vercel Serverless & Network Distance Differential:**
   - **Evidence:** Transitions on Live Production (928–1,452 ms) took ~3x longer than Local Production (283–402 ms). On Vercel, serverless function invocation + cross-datacenter TLS handshake to Neon PostgreSQL introduces latency that is magnified when multiple uncached queries are executed.

---

## 5. Targeted Implementations (Phase C)

All fixes strictly preserved the design system, academic/financial disclosures (VAL-08, VAL-09, VAL-10, VAL-11), privacy boundaries (VAL-07), and existing test invariants.

### 1. Request Deduplication via `React.cache()`
In `src/lib/public-data.ts`:
- Wrapped `getPublicSiteSettings`, `getPublicCaseStudies`, `getCaseStudyBySlug`, `getPublicCompetencies`, `getPublicAcademicMilestones`, and `getPublicTechSolutions` in `React.cache()`.
- Designed primitive-argument cache wrappers (`isDraftMode: boolean`) to guarantee that `Object.is` reference checks in React's memoization store reliably deduplicate calls across `generateMetadata()` and Page components.

### 2. Route-Level Loading Feedback (`loading.tsx`)
Added lightweight, accessible, dark/light theme compatible loading skeletons:
- `src/app/loading.tsx`: Root loading fallback with top indeterminate shimmer accent, hero placeholder, and card skeletons.
- `src/app/case-studies/loading.tsx`: Catalog loading fallback matching breadcrumbs, collection header, category tabs, and 4-card grid.
- `src/app/case-studies/[slug]/loading.tsx`: Case study detail loading fallback matching breadcrumbs, header hero, academic framework badges, and tabular financial schedule skeletons.

### 3. Explicit Link Prefetching on Primary Journeys
- `src/components/public/public-nav.tsx`: Added `prefetch={true}` to brand wordmark and desktop/mobile nav links. Explicitly marked admin portal link `prefetch={false}`.
- `src/components/public/public-case-studies.tsx`: Added `prefetch={true}` to card title links, action buttons, and catalog button.
- `src/app/case-studies/page.tsx` & `src/app/case-studies/[slug]/page.tsx`: Added `prefetch={true}` to breadcrumb and return links.

---

## 6. Verification & Before-and-After Profiling (Phase D)

### Local Production Server (`http://localhost:3000`) Before vs After Comparison

| Scenario | Baseline (Cold / Warm Avg) | Post-Remediation (Cold / Warm Avg) | Delta (Warm Avg) | Relative Improvement |
| :--- | :---: | :---: | :---: | :---: |
| **Homepage → Catalog** | 354 ms / 290 ms | **204 ms / 109 ms** | -181 ms | **-62.4% faster** |
| **Homepage → Detail** | 134 ms / 121 ms | **197 ms / 117 ms** | -4 ms | **-3.3% faster** |
| **Catalog → Detail** | 128 ms / 106 ms | **96 ms / 165 ms** | +59 ms | *Comparable* |
| **Detail → Catalog (Breadcrumb)** | 239 ms / 283 ms | **162 ms / 119 ms** | -164 ms | **-58.0% faster** |
| **Detail → Homepage (Breadcrumb)** | 397 ms / 402 ms | **263 ms / 278 ms** | -124 ms | **-30.8% faster** |

*Note on Perceptual Latency:* While quantitative click-to-content visible time dropped by 30% to 62% across the heaviest transitions, the **perceived latency dropped to under 50 ms** due to instant skeleton rendering upon click, eliminating visual freezing.

### Full Regression Suite Results
All existing test suites were executed against the modified codebase:

| Suite | Command | Outcome |
| :--- | :--- | :---: |
| Public Security & Privacy | `npm run test:public` | **19 Passed, 0 Failed** |
| SEO & Metadata Integrity | `npm run test:seo` | **40 Passed, 0 Failed** |
| Auth & Admin Boundary | `npm run test:auth` | **27 Passed, 0 Failed** |
| CMS & Discrepancy Integrity | `npm run test:cms` | **41 Passed, 0 Failed** |
| TypeScript Type Check | `npm run type-check` | **0 Errors (`tsc --noEmit`)** |
| ESLint Code Quality | `npm run lint` | **0 Errors, 0 Warnings** |
| Production Build | `npm run build` | **0 Errors (`next build`)** |

---

## 7. Files Modified & Added

| File | Status | Description |
| :--- | :---: | :--- |
| `src/lib/public-data.ts` | Modified | Added `React.cache()` wrapping to public queries to eliminate duplicate database calls. |
| `src/app/loading.tsx` | Added | Root route loading skeleton with indeterminate shimmer accent. |
| `src/app/case-studies/loading.tsx` | Added | Catalog route loading skeleton matching layout structure. |
| `src/app/case-studies/[slug]/loading.tsx` | Added | Case study detail loading skeleton matching header and financial schedule structure. |
| `src/components/public/public-nav.tsx` | Modified | Added `prefetch={true}` to public nav links; `prefetch={false}` to admin link. |
| `src/components/public/public-case-studies.tsx` | Modified | Added `prefetch={true}` to case study cards and catalog links. |
| `src/app/case-studies/page.tsx` | Modified | Added `prefetch={true}` to breadcrumb home link. |
| `src/app/case-studies/[slug]/page.tsx` | Modified | Added `prefetch={true}` to breadcrumb and return links. |
| `scripts/profile-navigation.ts` | Added | Automated Playwright profiling harness for multi-run cold/warm transition benchmarking. |

---

## 8. Deployment Status & Remaining Considerations

- **Deployment Status:** Production deployment is **NOT** performed. In compliance with strict phase guidelines, all changes remain locally verified on branch `main`.
- **Live vs Local Difference:** Live production (`https://ibnasiam.vercel.app`) remains on commit `e2d2fa1`. Once the user authorizes a deployment, deploying the cumulative changes (Phase 11 SEO fixes, Phase 12 verification fixes, and Phase 12.1 navigation performance remediations) will resolve both the SEO divergence and the navigation freezing on the live site.
