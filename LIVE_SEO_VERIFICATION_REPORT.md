# Live SEO Verification Report

**Evaluation Date:** October 2026  
**Auditor:** Technical SEO Specialist & Integration QA Engineer  
**Live Target:** `https://ibnasiam.vercel.app`  
**Execution Tool:** `scripts/verify-live-deployment.ts` & Local Automated SEO Pipeline (`scripts/test-seo-pipeline.ts`)  

---

## 1. Live vs. Staged Comparison Matrix

| SEO Checkpoint | Deployed Live State (Commit `e2d2fa1`) | Staged Local State (Ready to Deploy) | Production Ready? |
|---|---|---|---|
| **Root Canonical URL** | Not present in HTML `<head>` | `<link rel="canonical" href="https://ibnasiam.vercel.app/">` | **YES (Staged)** |
| **Catalog Canonical URL** | Not present in HTML `<head>` | `<link rel="canonical" href="https://ibnasiam.vercel.app/case-studies">` | **YES (Staged)** |
| **Detail Canonical URLs** | Not present in HTML `<head>` | `<link rel="canonical" href="https://ibnasiam.vercel.app/case-studies/[slug]">` | **YES (Staged)** |
| **Meta Robots (Public)** | `noindex, nofollow` (blocking) | `index, follow, max-image-preview:large...` (open) | **YES (Staged)** |
| **Meta Robots (Admin)** | `noindex, nofollow` (protected) | `noindex, nofollow, nocache, noimageindex` (hardened) | **YES** |
| **OpenGraph Metadata** | Not present in rendered HTML | Full `og:type`, `og:site_name`, `og:title`, `og:description` | **YES (Staged)** |
| **Twitter Card Tags** | Not present in rendered HTML | `summary_large_image`, title, description | **YES (Staged)** |
| **Structured Data (JSON-LD)** | Not present in App Router HTML | `Person`, `WebSite`, `CollectionPage`, `Article` schemas | **YES (Staged)** |
| **Robots.txt Output** | Returns `404 Not Found` | Generates RFC 9309 valid `/robots.txt` with sitemap pointer | **YES (Staged)** |
| **XML Sitemap Output** | Returns `404 Not Found` | Generates dynamic `/sitemap.xml` with 10 published routes | **YES (Staged)** |
| **Phone Privacy (VAL-07)** | Phone number absent from HTML | Phone number absent from HTML, API, metadata, schemas | **YES** |
| **Title Format Quality** | Duplicated brand suffix on child pages | Cleaned up: child pages use parent template cleanly | **YES** |

---

## 2. Technical Findings from Network Audit

1. **Root Layout Indexing Switch**:
   The live Vercel site is currently configured with `noindex, nofollow` inherited from early development. The staged local code replaces this with `index: true, follow: true` on the root layout. Once deployed, search engines will be able to crawl and index all public pages.
2. **Title Template Harmonization**:
   In Next.js App Router, when `template: "%s | Md Ibna Siam"` is declared in the root layout, child page titles should not include `| Md Ibna Siam`. Prior to this audit, child routes appended the brand name twice. This has now been resolved in `src/app/case-studies/page.tsx` and `src/app/case-studies/[slug]/page.tsx`.
3. **Robots Directives Modernization**:
   Removed legacy `host:` directive from `src/app/robots.ts` to strictly adhere to RFC 9309 standards.

---

## 3. Post-Deployment Verification Protocol

Upon user authorization to push and deploy:
1. Re-run `npx tsx scripts/verify-live-deployment.ts`.
2. Confirm `https://ibnasiam.vercel.app/robots.txt` returns `200 OK` with `text/plain`.
3. Confirm `https://ibnasiam.vercel.app/sitemap.xml` returns `200 OK` with `application/xml`.
4. Confirm `<meta name="robots" content="index, follow">` is present on `https://ibnasiam.vercel.app/`.
5. Confirm `<script type="application/ld+json">` contains valid `Person` schema without phone numbers.
