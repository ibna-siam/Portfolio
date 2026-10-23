# Production Acceptance Checklist & Google Search Console Guide

**Document Version:** 1.0.0  
**Phase:** Phase 12 Production Verification & Final QA  
**Domain:** `https://ibnasiam.vercel.app`  
**Identity:** Md Ibna Siam (BBA in Accounting, Daffodil International University)  

---

## 1. System Readiness Checklist

### Technical SEO & Crawling
- [x] `metadataBase` configured as `https://ibnasiam.vercel.app`
- [x] Public indexation enabled (`index: true, follow: true`)
- [x] Private Admin routes protected with `noindex, nofollow, nocache`
- [x] Self-referencing canonical tags on `/`, `/case-studies`, and detail routes
- [x] Dynamic `/robots.txt` endpoint operational (RFC 9309 compliant, disallows `/admin` & `/api`)
- [x] Dynamic `/sitemap.xml` endpoint operational (includes 10 public routes, excludes drafts and admin)
- [x] Schema.org `Person` JSON-LD implemented with verified facts only
- [x] Schema.org `WebSite` JSON-LD implemented
- [x] Schema.org `CollectionPage` JSON-LD implemented on `/case-studies`
- [x] Schema.org `Article` JSON-LD implemented on case study detail pages
- [x] Meta descriptions optimized for 150–160 character SERP snippet display

### Content Integrity & Disclosures
- [x] ACCA presented strictly as a career pathway in planning (zero unverified membership claims)
- [x] VAL-07: Phone number completely isolated and absent from all public HTML, APIs, and schemas
- [x] VAL-08: Square Pharma 8% overhead saving framed strictly as an academic proposal
- [x] VAL-09: Individual Income Tax Return arithmetic discrepancy disclosed via `DiscrepancyNotice`
- [x] VAL-10: StyleTex RMG Costing contribution margin divergence preserved and disclosed
- [x] VAL-11: FIFA World Cup direct sector vs. headline impact divergence preserved and disclosed
- [x] Official contact points to verified academic email and LinkedIn profile

### Accessibility & Performance
- [x] Light Mode contrast meets WCAG 2.2 Level AA standards
- [x] Dark Mode contrast verified
- [x] Semantic heading hierarchy maintained (single `<h1>` per route)
- [x] Public preview limits enforced: Case Studies (4), Competencies (4), Tech Solutions (3)
- [x] See More / Show Less controls fully operational
- [x] Dual-track rollback preserved (Next.js production build and Vite fallback build both operational)

---

## 2. Google Search Console Manual Setup Guide

Follow these steps once changes are deployed to production:

### Step 1: Add and Verify Property
1. Sign in to [Google Search Console](https://search.google.com/search-console).
2. Click **Add property**.
3. Choose **URL prefix** and enter:
   ```
   https://ibnasiam.vercel.app
   ```
4. Verification Options:
   - **Recommended (HTML Tag)**: Copy the verification meta tag `<meta name="google-site-verification" content="..." />` and provide the code snippet to add into `src/app/layout.tsx`.
   - **Alternative (DNS TXT record)**: If using a custom apex domain, add the TXT record in your DNS provider.

### Step 2: Submit XML Sitemap
1. Navigate to **Sitemaps** in the left sidebar.
2. Under "Add a new sitemap", enter:
   ```
   sitemap.xml
   ```
3. Click **Submit**.
4. Confirm that the status reports **Success** and 10 discovered URLs are indexed.

### Step 3: Inspect URLs (Request Indexing)
1. Use the search bar at the top ("Inspect any URL in 'https://ibnasiam.vercel.app'").
2. Inspect the homepage: `https://ibnasiam.vercel.app/`.
3. Click **Test Live URL** to confirm Googlebot can fetch the page without errors.
4. Click **Request Indexing**.
5. Repeat for one representative case study:
   `https://ibnasiam.vercel.app/case-studies/square-pharmaceuticals-financial-analysis`.

### Step 4: Monitor Indexing & Coverage
- Check the **Pages** report after 48–72 hours to verify:
  - Indexed pages count increases to 10.
  - Zero "Blocked by robots.txt" errors for public pages.
  - Admin URLs (`/admin/*`) are correctly excluded.
  - Zero canonical URL mismatch warnings.
