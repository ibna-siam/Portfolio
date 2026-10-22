# UI/UX Audit & Design System Specification: Executive Financial Precision

**Portfolio:** Md Ibna Siam — Accounting & Finance Portfolio CMS  
**Date:** October 2026  
**Auditor:** Senior Product Designer & Design-System Architect  
**Design Direction:** Executive Financial Precision  

---

## 1. Visual Identity & Brand Cohesion

The design direction **Executive Financial Precision** communicates the analytical rigor, audit standards, and structured clarity of an accounting and finance candidate targeting the ACCA qualification.

### Core Visual Principles
1. **Restraint over Decoration:** Eliminated decorative badges, arbitrary all-caps text, and unnecessary card nesting.
2. **Tabular Numeric Alignment:** Strict adherence to `.tabular-nums` (`font-variant-numeric: tabular-nums`) across all financial calculations, tax figures, currency denominations (BDT), and dates.
3. **Architectural Differentiation:** The public website offers a readable portfolio presentation for external recruiters, while the Admin Panel provides a dense, tool-oriented management dashboard. Both share color tokens, fonts, and component primitives without conflating their layout models.

---

## 2. Color Palette & Dual-Theme Tokens

### 2.1 The Soft Light Theme (Overhaul)
The previous light theme suffered from severe glare caused by unbounded pure white (`#ffffff`) across the entire canvas and card surfaces. The palette was revised to use warm, muted slate neutrals:

| Role | Color Token | Hex Value | Application |
|---|---|---|---|
| **Canvas Background** | `bg-ink-50` | `#f8f9fa` | Page body background (soft warm off-white, eliminates glare) |
| **Primary Surface** | `bg-white` / `bg-ink-100` | `#ffffff` / `#f1f3f5` | Cards, sidebar, modal dialogs, table rows |
| **Muted Surface** | `bg-ink-100` | `#f1f3f5` | Table headers, search inputs, secondary button backgrounds |
| **Border / Dividers** | `border-ink-200` | `#e5e7eb` | Structural borders, card boundaries, table cell separators |
| **Primary Typography** | `text-ink-900` | `#1f2937` | Deep charcoal headings and primary labels (never pure #000) |
| **Secondary Typography**| `text-ink-600` | `#4b5563` | Subtitles, descriptions, supporting data notes |
| **Tertiary / Mono** | `text-ink-500` | `#6b7280` | Metadata, character counts, timestamps, IDs |
| **Primary Accent** | `emerald-600` | `#059669` | Primary actions, published status indicators, active links |
| **Warning / Variance** | `amber-500` | `#d97706` | Discrepancy disclosures, review notices, draft badges |
| **Destructive** | `red-600` | `#dc2626` | Delete confirmation prompts, irreversible actions |

### 2.2 The Obsidian Dark Theme
Preserved high-contrast accessibility:
- **Canvas:** `#020617` (Obsidian slate)
- **Surfaces:** `#0b1329` / `#0f172a` (Deep ink surfaces)
- **Borders:** `#1e293b` / `#334155` (Subtle dark slate)
- **Text:** `#f8fafc` (Primary) / `#94a3b8` (Secondary)
- **Accent:** Emerald `#10b981` / `#34d399`

---

## 3. Typography Audit & Standards

### Font Family System
- **Display Font:** `Playfair Display` (serif) — Used exclusively for main section titles and portfolio headlines.
- **Body Font:** `DM Sans` (sans-serif) — Standardized for UI controls, paragraphs, table entries, and descriptions.
- **Monospace Font:** `JetBrains Mono` (monospace) — Applied to currency codes (`BDT`), student IDs, financial ratios, formula syntax, and Cloudinary public IDs.

### Type Scale & Hierarchy
- `text-2xl` (24px, font-bold): Admin page titles, modal titles.
- `text-lg` (18px, font-bold): Card group headers, section subtitles.
- `text-sm` (14px, font-medium): Table cell values, standard form inputs.
- `text-xs` (12px, font-normal/medium): Descriptions, secondary labels, action buttons.
- `text-[11px]` (11px, font-mono): Micro-metadata, character counters, revision numbers.

### Content & Phrasing Refinements
- **Sentence Case:** Standardized headings and labels ("Case studies", "Add milestone", "Save changes") rather than arbitrary title/uppercase shouting.
- **Direct UI Phrasing:** Replaced robotic strings ("Click here to perform your case study management operations") with concise action wording ("Manage your case studies and academic research papers").
- **Financial Disclosures Invariant:** All statutory tax calculation notes, RMG costing formulas, and ACCA trajectory disclaimers strictly preserved with zero alterations to facts or qualifications.

---

## 4. Admin Dashboard Layout Architecture

### Previous Failure
The Admin Panel previously mounted the public website's full-width horizontal navigation bar at the top of every screen. This introduced visual clutter, duplicated links, caused severe mobile layout instability, and created an unprofessional consumer-website appearance inside an administrative workspace.

### Rebuilt Dashboard Model (`<AdminShell>`)
```
+--------------------------------------------------------------------------+
|  PERSISTENT DESKTOP SIDEBAR      |  TOP UTILITY BAR                       |
|  - Brand & "Admin Portal" Badge  |  - Breadcrumb hierarchy                |
|                                  |  - View Live Site link                 |
|  WORKSPACE                       |  - Dual-Theme Switcher (Dark/Light)    |
|  - [icon] Overview               |  - Admin User Badge                    |
|                                  |  - Sign Out action                     |
|  PORTFOLIO CONTENT               +----------------------------------------+
|  - [icon] Case Studies           |  CONTEXTUAL PAGE HEADER                |
|  - [icon] Competencies           |  - Title: "Case Studies"               |
|  - [icon] Academic Journey       |  - Description: Context summary        |
|  - [icon] Tech Solutions         |  - Page Actions (e.g., "+ New")        |
|                                  +----------------------------------------+
|  MEDIA                           |  MAIN CONTENT WORKSPACE                |
|  - [icon] Media Library          |  - Dense management tables             |
|                                  |  - Search & filter controls            |
|  FOOTER                          |  - Consistent responsive padding       |
|  - Logged in as: admin           |                                        |
+--------------------------------------------------------------------------+
```

### Mobile Drawer Navigation
On screens `< 1024px`, the persistent sidebar converts to a smooth sliding drawer:
- Toggled via a hamburger button in the compact mobile top bar.
- Closes automatically upon route navigation (`prevPath !== pathname`).
- Closes on `Escape` key and outside backdrop clicks.
- Body scroll is locked while the mobile drawer is active.

---

## 5. Modal Dialogs & Form Interactions

### Previous Deficiencies
- Dialogs rendered at arbitrary page positions without viewport height limits.
- Submissions and action buttons were hidden below the fold, forcing the user to scroll the entire parent window.
- Dialogs lacked keyboard focus trapping and body scroll lock.

### Standardized Modal Anatomy (`<Modal>`)
```
+----------------------------------------------------+
| STICKY HEADER (shrink-0)                           |
| [Icon] Modal Title                    [Close (X)]  |
| Contextual helper description                      |
+----------------------------------------------------+
| SCROLLABLE BODY (flex-1 overflow-y-auto)           |
|                                                    |
| [Form Fields, Textareas, Media Selectors]          |
| - Validation error messages inline                 |
| - Proper field spacing (space-y-4)                 |
| - Accessible labels & helper text                  |
|                                                    |
+----------------------------------------------------+
| STICKY FOOTER (shrink-0)                           |
| Status message / info           [Cancel]  [Action] |
+----------------------------------------------------+
```

### Dialog Accessibility Features
- `role="dialog"` and `aria-modal="true"`.
- `aria-labelledby="modal-title"`.
- Background scroll lock via `document.body.style.overflow = "hidden"`.
- Dismissible via `Escape` key and backdrop click.
- Viewport containment (`max-h-[90vh]`) on all screen sizes.

---

## 6. Public Section Display Limits Audit

| Section Component | Required Initial Limit | Phase 10.1 Implementation | Status |
|---|---|---|---|
| **Case Studies Preview** | Exactly **4** items | `publishedStudies.slice(0, 4)` | Verified & Tested |
| **Competencies Preview** | Exactly **4** items | `competencies.slice(0, 4)` | Verified & Tested |
| **Tech Solutions Preview**| Exactly **3** items | `techSolutions.slice(0, 3)` | Verified & Tested |
| **Dedicated Catalog** (`/case-studies`) | Unrestricted | Complete 8-study list with category filtering | Verified & Preserved |

The "See More" / "Show Less" toggle maintains smooth Framer Motion height transitions, respects keyboard activation (`Enter` / `Space`), and does not reload data from the network.
