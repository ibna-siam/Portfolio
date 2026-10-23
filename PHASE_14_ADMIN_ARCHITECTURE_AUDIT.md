# Phase 14 — Admin CMS Architecture Audit & CRUD Standardization Plan

**Author:** Senior Next.js Architect, CMS Engineer & Admin UX Specialist  
**Date:** October 23, 2026  
**Status:** Audit & Architecture Planning Only (No application source code or production database modifications)  
**Project:** Md Ibna Siam — Accounting & Finance Portfolio CMS  
**Production URL:** [https://ibnasiam.vercel.app](https://ibnasiam.vercel.app/)  
**Framework Stack:** Next.js 15.5.28 App Router, React 19.2.6, TypeScript 5.9.3, Tailwind CSS 3.4.19, Neon PostgreSQL with Drizzle ORM, Auth.js v5 (NextAuth), Cloudinary CDN  

---

## 1. Executive Summary & Purpose

This audit evaluates the current implementation of the Admin Content Management System (CMS) in the Md Ibna Siam Portfolio. The primary goal is to **standardize CRUD workflows**, **eliminate modal-based data entry**, **simplify management lists**, and **improve usability and accessibility** across all administrative modules without altering the underlying database schema or disrupting production operations.

### Key Finding:
- **Case Studies** already utilizes a dedicated multi-page CRUD architecture (`/admin/case-studies/new`, `/admin/case-studies/[id]/edit`, and `/admin/case-studies/[id]/preview`).
- **Competencies**, **Tech Solutions**, and **Academic Journey** currently rely on **modal-based data entry forms** (`src/components/admin/modal.tsx`). While functional, editing rich multi-field entities (such as competencies with framework tags, tech solutions with multi-line problem/solution specifications, or milestones with discipline arrays) inside constrained modal dialogs introduces severe usability limitations: cramped viewports, poor mobile responsiveness, loss of unsaved changes upon accidental backdrop click, and lack of direct URL shareability/bookmarkability.
- **Academic Journey** is a hybrid entity: it manages a relational collection of academic milestone records (`academic_milestones` table) alongside a singleton configuration document (`acca_trajectory` stored as JSONB within `site_settings`).
- **Zero Database Migration is Required**: The existing relational schema in `src/lib/db/schema.ts` completely satisfies all CRUD operations, sort orders, and audit logging needs.

---

## 2. Actual Route & Component Inventory

Based on an exhaustive inspection of the filesystem, the following is the exact inventory of existing admin routes, client shells, action handlers, and shared components:

```
src/app/(admin)/
├── layout.tsx                                    # Admin root layout (blocks search indexing, sets nocache)
└── admin/
    ├── layout.tsx                                # (Inherited from parent)
    ├── page.tsx                                  # Dashboard / Overview (Server Component)
    ├── actions.ts                                # Global admin actions (signOutAction)
    ├── login/
    │   ├── page.tsx                              # Admin Login page (Server Component)
    │   ├── login-form.tsx                        # Client login form with Auth.js integration
    │   └── actions.ts                            # Login rate-limiting and authentication actions
    ├── case-studies/
    │   ├── page.tsx                              # Case Studies List (Server Component)
    │   ├── case-studies-client.tsx               # Client list manager (Search, filter, toggle status)
    │   ├── actions.ts                            # upsertCaseStudyAction, deleteCaseStudyAction, togglePublish
    │   ├── new/
    │   │   └── page.tsx                          # Dedicated Create Case Study page
    │   └── [id]/
    │       ├── edit/
    │       │   └── page.tsx                      # Dedicated Edit Case Study page
    │       └── preview/
    │           └── page.tsx                      # Admin-only draft preview page
    ├── competencies/
    │   ├── page.tsx                              # Competencies List (Server Component)
    │   ├── competencies-client.tsx               # Client manager with MODAL form
    │   └── actions.ts                            # upsertCompetencyAction, deleteCompetencyAction
    ├── academic-journey/
    │   ├── page.tsx                              # Academic Journey Overview (Server Component)
    │   ├── journey-client.tsx                    # Client manager with TWO MODAL forms (Milestones + ACCA)
    │   └── actions.ts                            # updateMilestoneAction, updateAccaTrajectoryAction
    ├── tech-solutions/
    │   ├── page.tsx                              # Tech Solutions List (Server Component)
    │   ├── solutions-client.tsx                  # Client manager with MODAL form
    │   └── actions.ts                            # upsertTechSolutionAction, deleteTechSolutionAction
    └── media/
        ├── page.tsx                              # Media Library (Server Component)
        ├── media-client.tsx                      # Client media grid, uploader, alt text modal, delete modal
        └── actions.ts                            # getUploadSignatureAction, registerMediaAssetAction, deleteMediaAssetAction

src/components/admin/
├── admin-shell.tsx                               # Responsive navigation shell, breadcrumbs, sidebar, header
├── modal.tsx                                     # Shared React Portal modal dialog (currently used for data entry)
├── media-picker-modal.tsx                        # Asset selector modal for case study cover images
└── case-study-editor.tsx                         # 993-line comprehensive form component for case studies
```

---

## 3. Existing CRUD Behavior by Module

| Module | Current Route | List View Type | Create Workflow | Edit Workflow | Delete Workflow | Persistence & Table |
|---|---|---|---|---|---|---|
| **Dashboard** | `/admin` | Stat cards & recent log feed | N/A | N/A | N/A | Drizzle `count()` queries on 5 tables |
| **Case Studies** | `/admin/case-studies` | Grid of cards with search & status filters | Dedicated Page (`/admin/case-studies/new`) | Dedicated Page (`/admin/case-studies/[id]/edit`) | Modal confirmation dialog -> Server Action | `case_studies`, `financial_schedules`, `case_study_discrepancies` |
| **Competencies** | `/admin/competencies` | 2-col card grid with domain & text filters | **Modal Form** (`editingItem` state) | **Modal Form** (`editingItem` state) | Inline window confirm / Server Action | `competencies` (UUID primary key) |
| **Academic Journey** | `/admin/academic-journey` | 3 milestone cards + 1 ACCA trajectory card | None (Fixed 3 institutions) | **Modal Form** (Milestone) + **Modal Form** (ACCA) | None (Milestones are fixed academic record) | `academic_milestones` (String ID) + `site_settings` (`acca_trajectory` JSONB) |
| **Tech Solutions** | `/admin/tech-solutions` | 1-col card list with repo links | **Modal Form** (`editingItem` state) | **Modal Form** (`editingItem` state) | Modal confirmation dialog -> Server Action | `tech_solutions` (Slug ID) |
| **Media Library** | `/admin/media` | Responsive thumbnail grid with search/format filters | Direct Cloudinary unsigned/signed browser upload | Modal for Alt Text edit | Modal confirmation dialog -> Server Action | `media_assets` (UUID + Cloudinary `publicId`) |

---

## 4. Current Database & Validation Dependencies

### 4.1 Schema Entities & Relationships
1. **`case_studies` (UUID `id`, unique `source_id`, unique `slug`):**
   - Cascades delete to `financial_schedules`.
   - Bound 1-to-1 to `case_study_discrepancies`.
   - Safeguard: `deleteCaseStudyAction` strictly blocks deletion if an active discrepancy disclosure is attached.
2. **`competencies` (UUID `id`, unique `name`):**
   - Categorized by 4 primary domains (`Financial Accounting`, `Managerial Accounting`, `Taxation & Audit`, `Software & Tech`).
   - Sorted by `sortOrder` integer.
3. **`academic_milestones` (Varchar `id`, e.g., `'bba-accounting'`, `'hsc-business'`, `'ssc-business'`):**
   - Contains educational degrees, periods, institutions, and disciplines.
   - Sorted by `sortOrder` integer.
4. **`site_settings` (Varchar `id = 'default'`):**
   - Singleton record containing `acca_trajectory` JSONB structure.
   - Enforces strict ethical disclaimer guardrail: prevents claiming completed ACCA membership without verified credential.
5. **`tech_solutions` (Varchar `id`, e.g., `'financial-portfolio-engine'`):**
   - Contains problem/solution descriptions, user role, tech stack, and verified repo links.
   - Enforces URL sanitization (requires `http://` or `https://`).
6. **`content_revisions` & `activity_logs`:**
   - Append-only audit history tracking all `create`, `update`, `publish`, and `delete` operations with author attribution.

### 4.2 Current Validation Mechanisms
- **Server Actions:** Validate mandatory fields (`name`, `title`, `slug`, `domain`, `id`), enforce non-empty strings, sanitize slugs and URLs, check uniqueness, and verify admin session via `requireAdmin()`.
- **Client Side:** Basic HTML5 `required` attributes and inline transition state indicators (`isPending`).
- **Opportunity:** Introduce structured validation schemas (e.g., Zod or shared TypeScript type guards) to ensure identical validation rules between client forms and server actions.

---

## 5. Architectural Problems with Current Modal-Based Data Entry

1. **Constrained Viewport & Scroll Collisions:**
   - Modals are capped at `max-h-[90vh]`. When editing large text areas (such as Tech Solution problem descriptions or Competency methodological scopes), inner scrolling conflicts with browser window scrolling.
2. **Risk of Accidental Data Loss:**
   - Clicking outside the modal backdrop or pressing the Escape key dismisses the dialog immediately, losing all unsaved form inputs with zero confirmation prompt.
3. **No Direct Deep-Linking or Navigation History:**
   - An administrator cannot bookmark or share a direct link like `/admin/competencies/tax-planning/edit`.
   - Browser back/forward buttons close the page instead of canceling the modal.
4. **Poor Mobile Responsiveness:**
   - On small screens (<640px), modal forms stretch to 100% width with virtual keyboards obscuring inputs and action buttons.
5. **Inconsistent CMS UX:**
   - Case Studies uses full-page editing with rich breadcrumbs and action bars, whereas Competencies and Tech Solutions squeeze into small dialog windows.

---

## 6. Proposed Standardized CRUD Architecture

To establish an **Executive Financial Precision** administrative experience, all portfolio content modules will follow a **unified Page-Based CRUD Architecture**:

```
/admin/[module]                 -> Management List (Compact, sortable, searchable, filterable)
/admin/[module]/new             -> Dedicated Create Page (Full page, clear breadcrumbs, action bar)
/admin/[module]/[id]/edit       -> Dedicated Edit Page (Pre-populated, revision history, action bar)
```

### 6.1 Standardized Route Structure

| Module | Management List Route | Dedicated Create Route | Dedicated Edit Route | Action Modals Preserved |
|---|---|---|---|---|
| **Case Studies** | `/admin/case-studies` | `/admin/case-studies/new` *(Existing)* | `/admin/case-studies/[id]/edit` *(Existing)* | Delete confirmation, Media Picker |
| **Competencies** | `/admin/competencies` | `/admin/competencies/new` *(Proposed)* | `/admin/competencies/[id]/edit` *(Proposed)* | Delete confirmation only |
| **Tech Solutions** | `/admin/tech-solutions` | `/admin/tech-solutions/new` *(Proposed)* | `/admin/tech-solutions/[id]/edit` *(Proposed)* | Delete confirmation only |
| **Academic Journey** | `/admin/academic-journey` | N/A (Fixed 3 degrees) | `/admin/academic-journey/[id]/edit` *(Proposed)* + `/admin/academic-journey/acca/edit` *(Proposed)* | None |
| **Media Library** | `/admin/media` | Direct dropzone/modal uploader *(Preserved)* | Inline / Drawer Alt-Text Edit *(Optimized)* | Delete confirmation, Full preview |

### 6.2 Key Architectural Rule: Distinction Between Data Entry vs. Action Confirmation
- **Data Entry (Forms):** **Exclusively Full Pages**. Never squeeze multi-field record creation or updates into modals.
- **Action Confirmation (Destructive / Quick):** **Lightweight Modals**. Confirming record deletion, unpublishing, or picking an asset from the media library remains appropriate for focused modal dialogs.

---

## 7. Evaluated List Views & Layout Recommendations

### 7.1 Case Studies List View (`/admin/case-studies`)
- **Current:** 2-column large cards with verbose metadata.
- **Recommendation:** Convert to a **High-Density Financial Data Table**:
  - Columns: `Title & Slug`, `Domain Group`, `Framework`, `Schedules Count`, `Discrepancy Status`, `Publication Status`, `Actions`.
  - Filter Tabs: `All (8)`, `Published (8)`, `Draft (0)`, `With Discrepancy (3)`.
  - Actions: Edit (direct link), Preview (direct link), Status Toggle, Delete.
  - Mobile behavior: Responsive card collapse with critical status badges.

### 7.2 Competencies List View (`/admin/competencies`)
- **Current:** 2-column cards showing description and tags.
- **Recommendation:** Convert to a **Compact Categorized Data Table / Matrix**:
  - Grouped by Domain: *Financial Accounting*, *Managerial Accounting*, *Taxation & Audit*, *Software & Tech*.
  - Columns: `Order (#)`, `Competency Name`, `Evidence Classification`, `Framework Tags`, `Status`, `Actions`.
  - Actions: Edit (`/admin/competencies/[id]/edit`), Quick Reorder (Up/Down arrow buttons), Delete.
  - Mobile behavior: Compact list rows with chevron expansion.

### 7.3 Tech Solutions List View (`/admin/tech-solutions`)
- **Current:** Full-width large preview cards repeating public layout.
- **Recommendation:** Convert to a **System Engineering Showcase Table**:
  - Columns: `System Title`, `Category`, `Tech Stack (Monospace Pills)`, `Status Badge`, `Repository Link`, `Actions`.
  - Actions: Edit (`/admin/tech-solutions/[id]/edit`), Quick Reorder, Delete.

### 7.4 Academic Journey Management (`/admin/academic-journey`)
- **Current:** 3 milestone cards and 1 ACCA card on a single page, each opening a modal.
- **Recommendation:**
  - **Section A: Institutional Milestones Table:** Lists the 3 verified degrees (`BBA Accounting`, `HSC Business`, `SSC Business`). Action button: "Edit Milestone Details" -> links to `/admin/academic-journey/[id]/edit`.
  - **Section B: ACCA Career Trajectory Card:** Displays current planning status, ethical disclaimer, and strategic papers. Action button: "Edit ACCA Trajectory" -> links to `/admin/academic-journey/acca/edit`.

### 7.5 Media Library (`/admin/media`)
- **Current:** Responsive thumbnail grid with search and format filters.
- **Recommendation:** Retain thumbnail grid as it is visually optimal for images, but:
  - Add compact list view toggle.
  - Add batch selection capabilities.
  - Make alt-text editing an inline editable field or compact flyout drawer instead of a full modal.

---

## 8. Shared Reusable Form Components Plan

To avoid duplicate code across the new dedicated pages, a lightweight set of reusable UI components should be extracted under `src/components/admin/forms/`:

1. **`AdminPageHeader`:**
   - Renders breadcrumbs (`/admin > Competencies > Edit`), page title, status badge, and top action buttons (Cancel, Save).
2. **`FormSection` / `FormCard`:**
   - Standardized container with title, explanatory description, and subtle border/surface background (`bg-white dark:bg-ink-900 border-ink-200 dark:border-ink-800`).
3. **`FormInput` & `FormTextarea`:**
   - Consistent label with required asterisk, error text, helper text, and accessible focus ring (`focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`).
4. **`TagInputField`:**
   - Interactive badge-based tag input for comma-separated items (e.g., framework tags, disciplines, tech stack) with backspace-to-delete and enter-to-add.
5. **`FormActionBar`:**
   - Sticky bottom action bar on mobile and desktop containing:
     - "Discard Changes" (with dirty state confirmation if user modified inputs).
     - "Save Record" (with pending loading spinner and success state).
6. **`DeleteConfirmationModal`:**
   - Reusable, accessible dialog for confirming destructive deletions with exact entity name confirmation.

---

## 9. Security, Data Integrity & Guardrail Preservation

Any future implementation of this plan must strictly maintain the established security and factual boundaries:

1. **Session Authorization:**
   - Every Server Action must continue calling `await requireAdmin()`.
   - Every admin page must verify `await requireAdmin()` at the server component root, redirecting unauthenticated visitors to `/admin/login`.
2. **Financial Discrepancy Safeguards:**
   - Under no circumstances allow deleting a Case Study that possesses an active discrepancy disclosure (`VAL-09`, `VAL-10`, `VAL-11`).
   - Discrepancy details must remain strictly read-only or subject to transparent audit logging.
3. **ACCA Career Trajectory Ethical Guardrail:**
   - The ACCA editor must programmatically block any attempt to select "Completed Member", "Fellow Member", or unverified credentials (`VAL-03`).
4. **Phone Privacy Guardrail (VAL-07):**
   - Personal phone number must never be added to public payloads or client form defaults without explicit owner consent.
5. **Audit Trails & Revision Snapshots:**
   - All creates, updates, and deletes across the new pages must continue calling `recordContentRevision()` and `recordActivityLog()`.

---

## 10. Recommended Implementation Sequence for Subsequent Phases

### **Phase 15: Admin Shared Components & Competencies/Tech Solutions Page Migration**
1. Create shared admin form components (`AdminPageHeader`, `FormSection`, `TagInputField`, `FormActionBar`, `DeleteConfirmationModal`).
2. Implement `/admin/competencies/new` and `/admin/competencies/[id]/edit` dedicated pages.
3. Refactor `/admin/competencies/page.tsx` into a compact, sortable data table with create button.
4. Implement `/admin/tech-solutions/new` and `/admin/tech-solutions/[id]/edit` dedicated pages.
5. Refactor `/admin/tech-solutions/page.tsx` into an engineering showcase list.
6. Verify all automated tests (`npm run test:cms`, `npm run test:public`) pass with zero regressions.

### **Phase 16: Academic Journey Dedicated Editing & Case Studies List Refinement**
1. Implement `/admin/academic-journey/[id]/edit` for individual degree milestones.
2. Implement `/admin/academic-journey/acca/edit` for the ACCA strategic trajectory.
3. Refactor `/admin/case-studies/page.tsx` into a high-density financial data table.
4. Deprecate data-entry usage of `modal.tsx` (retaining it exclusively for delete confirmations and media picking).
5. Execute end-to-end regression testing and document completed architecture.

---

## 11. Testing & Acceptance Criteria

To declare the standardization successful in future phases:
- **Zero Modals for Data Entry:** Navigating to "New Competency", "Edit Competency", "New Solution", "Edit Solution", or "Edit Milestone" opens a dedicated URL route.
- **Deep Linking:** Direct navigation to `/admin/competencies/[id]/edit` directly loads the requested record or throws a clean `notFound()` if invalid.
- **Data Parity:** Exactly 16 competencies, 3 tech solutions, 3 milestones, and 8 case studies remain intact in PostgreSQL.
- **Test Integrity:** All existing test suites pass:
  - `npm run test:cms` (41/41 assertions pass)
  - `npm run test:public` (19/19 assertions pass)
  - `npm run test:auth` (27/27 assertions pass)
  - `npm run test:seo` (40/40 assertions pass)
  - `npm run test:media` (24/24 assertions pass)
  - Total: 151/151 assertions passing.
- **Typecheck & Lint:** `npm run type-check` (0 errors), `npm run lint` (0 errors), `npm run build` (Exit code 0).

---

## 12. Uncertainties & Items for Owner Decision

1. **Ordering Mechanism:**
   - Currently, `sortOrder` is an integer updated via the form. Should we implement an explicit Up/Down reorder action in the table, or preserve integer editing? *(Recommendation: Simple Up/Down arrow actions on table rows, avoiding heavyweight drag-and-drop dependencies).*
2. **Milestone Creation:**
   - Currently, academic milestones represent Siam's completed and active degrees (BBA, HSC, SSC). Should administrators be permitted to add *new* milestones, or should the module remain strictly an editor for verified credentials? *(Recommendation: Keep create restricted unless owner requests adding graduate degree).*
