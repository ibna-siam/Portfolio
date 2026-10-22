# Design System: Executive Claymorphism
## Siam's Accounting-Focused Hybrid Professional Portfolio & Portfolio CMS

**Document Version:** 2.0.0  
**Phase:** Phase 0: Portfolio CMS Documentation Audit & Alignment  
**Date:** October 21, 2026  
**Design Direction:** Executive Claymorphism  
**Target Applications:** Public Portfolio Showcase & Authenticated Admin Panel (`/admin`)  
**Implementation Stack:** Next.js (App Router), Tailwind CSS, Framer Motion, React Icons  

---

## 1. Visual Direction & Design Philosophy

### 1.1 The Concept: "Executive Claymorphism"
**Executive Claymorphism** merges the rigorous, understated authority of institutional corporate finance (reminiscent of annual corporate disclosures, the Financial Times, and Bloomberg terminals) with a **modern, tactile 3D interface paradigm**. 

Unlike playful, cartoonish "neomorphism" or overly generic flat UI, Executive Claymorphism uses:
1. **Subtle, Tactile Depth:** Rounded, pillowy containers with gentle, double-layered drop shadows paired with soft inner corner highlights (`inset` box-shadows). Surfaces appear extruded from the background like frosted matte clay or premium archival paper.
2. **Institutional Financial Rigor:** An authoritative slate/navy canvas paired with restrained emerald accents (symbolizing growth and reconciliation) and amber gold indicators (for variance warnings).
3. **Tabular Numerals & High Scannability:** Monospaced and tabular-aligned numbers (`font-variant-numeric: tabular-nums`) across all financial statements, metrics, and admin schedules.
4. **Unified Public & Admin Experience:** The same cohesive design language spans both the public-facing portfolio showcase and the internal CMS administration portal, creating a seamless, polished, and custom-tailored operational tool.

### 1.2 Core Design Principles
1. **Tactile Restraint:** Shadows and inner highlights must remain subtle, soft, and balanced. Avoid harsh, muddy black drop-shadows or oversaturated neon glows.
2. **Accessibility-First Contrast:** Depth and shadows are decorative; readability is structural. All text, numbers, and interactive borders must strictly satisfy WCAG 2.1 AA standards (minimum 4.5:1 for body text, 3:1 for large text and focus states).
3. **Purposeful Feedback:** Physical buttons and interactive elements depress slightly on click (`active:translate-y-0.5 active:shadow-inner`), giving the operator a satisfying, tangible sense of direct manipulation.
4. **Clutter-Free Administrative Density:** Admin surfaces utilize compact claymorphic cards, clear status badges, and organized tabular builders to maximize productivity without visual overwhelm.

---

## 2. Color Architecture & Semantic Token System

### 2.1 Primary Brand Palettes
The palette anchors on deep, authoritative ink/navy tones, enriched by a refined emerald jade and an amber variance accent.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRIMARY BRAND PALETTES                          │
├────────────────────────────────┬───────────────────────────────────────┤
│  NAVY / INK (Foundation)       │  EMERALD / JADE (Growth / Primary)    │
│  50:  #F8FAFC (Ice Canvas)     │  50:  #ECFDF5                         │
│  100: #F1F5F9 (Soft Muted)     │  100: #D1FAE5                         │
│  200: #E2E8F0 (Divider Slate)  │  400: #34D399 (Dark Accent)           │
│  500: #64748B (Secondary Text) │  500: #10B981 (Brand Emerald)         │
│  800: #1E293B (Card Dark)      │  600: #059669 (Primary Action)        │
│  900: #0F172A (Surface Dark)   │  700: #047857 (Hover Dark)            │
│  950: #0A0F1D (Base Canvas)    │                                       │
├────────────────────────────────┴───────────────────────────────────────┤
│  AMBER (Variance / Attention)  │  SLATE (Neutral Borders & Badges)     │
│  400: #FBBF24 (Gold Accent)    │  200: #E2E8F0                         │
│  500: #F59E0B (Variance Warning│  700: #334155                         │
│  600: #D97706 (Deep Amber)     │  800: #1E293B                         │
└────────────────────────────────┴───────────────────────────────────────┘
```

### 2.2 Semantic Color Tokens (Light vs. Dark Mode)

| Semantic Token | Light Mode Value | Dark Mode Value | Usage Context |
|---|---|---|---|
| `--color-canvas-bg` | `#F8FAFC` (`ink-50`) | `#0A0F1D` (`ink-950`) | Global page background |
| `--color-surface-clay` | `#FFFFFF` (`white`) | `#111827` (`ink-900`) | Standard clay cards and section panels |
| `--color-surface-elevated` | `#FFFFFF` (`white`) | `#1E293B` (`ink-800`) | Modals, drawers, dropdowns, floating bars |
| `--color-surface-inset` | `#F1F5F9` (`ink-100`) | `#0A0F1D` (`ink-950`) | Inset table wells, form inputs, code blocks |
| `--color-text-primary` | `#0F172A` (`ink-900`) | `#F8FAFC` (`ink-50`) | Headings, primary metrics, card titles |
| `--color-text-secondary` | `#475569` (`ink-600`) | `#94A3B8` (`ink-400`) | Body copy, subtitles, methodological text |
| `--color-text-muted` | `#64748B` (`ink-500`) | `#64748B` (`ink-500`) | Footnotes, date stamps, metadata pills |
| `--color-brand-primary` | `#059669` (`emerald-600`) | `#10B981` (`emerald-500`) | Primary CTAs, active tabs, brand accents |
| `--color-brand-hover` | `#047857` (`emerald-700`) | `#059669` (`emerald-600`) | Primary button hover states |
| `--color-status-growth` | `#059669` (`emerald-600`) | `#34D399` (`emerald-400`) | Favorable variance, positive ratios, published |
| `--color-status-variance` | `#D97706` (`amber-600`) | `#FBBF24` (`amber-400`) | Deficit warning, adverse variance, draft item |
| `--color-status-risk` | `#DC2626` (`red-600`) | `#F87171` (`red-400`) | Audit finding, control weakness, archived |

---

## 3. Executive Claymorphism Surface & Shadow Specifications

The defining aesthetic of Executive Claymorphism is achieved through dual-layer drop shadows combined with subtle top-left inner bevels:

```
┌────────────────────────────────────────────────────────┐
│  LIGHT MODE CLAY LAYER                                 │
│  - Outer Shadow: 6px 10px 20px rgba(15, 23, 42, 0.06) │
│  - Secondary:    -3px -3px 8px rgba(255, 255, 255, 0.8)│
│  - Inner Bevel:  inset 1px 1px 2px rgba(255, 255, 255, 0.9)
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  DARK MODE CLAY LAYER                                  │
│  - Outer Shadow: 8px 12px 24px rgba(0, 0, 0, 0.45)    │
│  - Secondary:    -2px -2px 6px rgba(30, 41, 59, 0.25) │
│  - Inner Bevel:  inset 1px 1px 1px rgba(255, 255, 255, 0.08)
└────────────────────────────────────────────────────────┘
```

### 3.1 Custom Tailwind Shadow Tokens

```javascript
// tailwind.config.js extension
boxShadow: {
  'clay-card': '6px 10px 20px -3px rgba(15, 23, 42, 0.06), -3px -3px 8px 0px rgba(255, 255, 255, 0.8), inset 1px 1px 2px 0px rgba(255, 255, 255, 0.9)',
  'clay-card-dark': '8px 12px 24px -4px rgba(0, 0, 0, 0.45), -2px -2px 6px 0px rgba(30, 41, 59, 0.25), inset 1px 1px 1px 0px rgba(255, 255, 255, 0.08)',
  'clay-btn': '4px 6px 14px -2px rgba(5, 150, 105, 0.3), inset 1px 1px 2px 0px rgba(255, 255, 255, 0.4)',
  'clay-btn-dark': '4px 6px 14px -2px rgba(0, 0, 0, 0.5), inset 1px 1px 1px 0px rgba(255, 255, 255, 0.2)',
  'clay-inset': 'inset 2px 2px 6px 0px rgba(15, 23, 42, 0.08), inset -2px -2px 6px 0px rgba(255, 255, 255, 0.7)',
  'clay-inset-dark': 'inset 2px 2px 6px 0px rgba(0, 0, 0, 0.4), inset -1px -1px 3px 0px rgba(255, 255, 255, 0.04)',
}
```

---

## 4. Typography Architecture

### 4.1 Font Family Stacks
1. **Display & Editorial Titles:**
   - Font: `Playfair Display`, `Georgia`, serif
   - Role: Establishes corporate authority and financial journal heritage for primary section titles, hero headlines, and report titles.
2. **Body & User Interface:**
   - Font: `DM Sans`, `Inter`, -apple-system, BlinkMacSystemFont, sans-serif
   - Role: Provides crisp legibility, high x-height, and clean rendering across high-density admin dashboards and public copy.
3. **Tabular Numerals & Codes:**
   - Font: `JetBrains Mono`, `SFMono-Regular`, Menlo, monospace
   - Role: Enforces numerical vertical alignment (`font-variant-numeric: tabular-nums`) across financial schedules, ratio tables, and formula definitions.

### 4.2 Responsive Type Scale
- `text-display-xl`: 3.75rem (60px) / 1.1 — Hero Headline
- `text-display-lg`: 2.5rem (40px) / 1.2 — Section Headings (`<h2>`)
- `text-title-md`: 1.5rem (24px) / 1.3 — Case Study & Card Titles (`<h3>`), Admin Widget Titles
- `text-title-sm`: 1.125rem (18px) / 1.4 — Modal Sub-headings, Table Headers
- `text-body-base`: 1rem (16px) / 1.6 — Descriptions, Report Findings, Form Inputs
- `text-body-sm`: 0.875rem (14px) / 1.5 — Table Cells, Metadata Notes
- `text-caption`: 0.75rem (12px) / 1.4 — Status Pills, Eyebrow Badges, Timestamps

---

## 5. Public Showcase Component Specifications

### 5.1 Section Heading Component (`SectionHeading.tsx`)
- **Structure:**
  - Eyebrow tag: Monospaced uppercase badge with clay pill border (`px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 shadow-clay-inset dark:shadow-clay-inset-dark mb-3 inline-block`).
  - Title: Editorial serif heading (`font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 dark:text-ink-50 tracking-tight mb-3`).
  - Subtitle: Clear explanatory body (`text-sm sm:text-base text-ink-600 dark:text-ink-400 max-w-2xl mx-auto leading-relaxed`).

### 5.2 Claymorphic Buttons
- **Primary Extruded Action (e.g. Download CV, Publish):**
  - Classes: `inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-medium text-sm rounded-2xl shadow-clay-btn dark:shadow-clay-btn-dark hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-clay-inset transition-all duration-200 cursor-pointer`
- **Secondary Clay Action (e.g. Explore Studies, Preview):**
  - Classes: `inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-200 font-medium text-sm rounded-2xl border border-ink-200/60 dark:border-ink-700/60 shadow-clay-card dark:shadow-clay-card-dark hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-clay-inset-dark transition-all duration-200 cursor-pointer`
- **Tactile Icon Button (e.g. Theme Toggle):**
  - Classes: `p-3 rounded-2xl bg-white dark:bg-ink-800 text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 shadow-clay-card dark:shadow-clay-card-dark hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer`

### 5.3 Case Study Preview Card
- **Structure:**
  - Container: Tactile clay tile (`bg-white dark:bg-ink-900 rounded-3xl p-6 border border-ink-100 dark:border-ink-800/80 shadow-clay-card dark:shadow-clay-card-dark hover:-translate-y-1.5 transition-all duration-300`).
  - Badge Header: Category badge on left; integrity status pill on right.
  - Title: `font-display font-semibold text-lg sm:text-xl text-ink-900 dark:text-ink-100 mb-2`.
  - Metric Highlight: Soft clay inset well (`bg-ink-50 dark:bg-ink-950/60 p-3.5 rounded-2xl border border-ink-200/40 dark:border-ink-800/40 shadow-clay-inset dark:shadow-clay-inset-dark text-xs tabular-nums text-emerald-700 dark:text-emerald-400 font-medium mb-4`).
  - Action trigger: Interactive button opening Case Study Viewer.

### 5.4 Financial Data Schedule Component
- **Structure:**
  - Inset well container: `overflow-x-auto rounded-2xl bg-ink-50/50 dark:bg-ink-950/50 p-1 border border-ink-200/60 dark:border-ink-800/60 shadow-clay-inset dark:shadow-clay-inset-dark`.
  - Table: `w-full text-left border-collapse text-xs`.
  - Header: `bg-ink-100/80 dark:bg-ink-900/80 font-semibold text-ink-700 dark:text-ink-300 px-4 py-3 rounded-xl`.
  - Cells: `px-4 py-3 text-ink-600 dark:text-ink-300 border-t border-ink-200/40 dark:border-ink-800/40 tabular-nums`.
  - Row Hover: subtle soft highlight `hover:bg-ink-100/50 dark:hover:bg-ink-800/30`.

---

## 6. Admin Panel Component Specifications (`/admin`)

The Admin Panel adheres to the same Executive Claymorphism foundation, optimized for administrative clarity, data density, and authoring workflow:

### 6.1 Admin Shell & Navigation
- **Sidebar Container:** Elevated clay panel (`w-64 bg-white dark:bg-ink-900 border-r border-ink-200/60 dark:border-ink-800/60 shadow-clay-card dark:shadow-clay-card-dark h-screen fixed`).
- **Active Navigation Item:** Tactile indented well (`bg-ink-100/80 dark:bg-ink-950 text-emerald-600 dark:text-emerald-400 font-medium rounded-xl px-4 py-3 shadow-clay-inset dark:shadow-clay-inset-dark border border-emerald-500/20`).
- **Inactive Navigation Item:** Smooth soft hover (`text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 hover:bg-ink-50 dark:hover:bg-ink-800/60 rounded-xl px-4 py-3 transition-colors`).

### 6.2 Publishing Lifecycle Badges (Status Pills)
Status pills provide immediate, non-color-dependent publishing awareness:
- **Draft:** `bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 shadow-clay-inset dark:shadow-clay-inset-dark px-3 py-1 rounded-full text-xs font-medium` (Icon: Pencil `✏️`).
- **Preview / Staging:** `bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/30 shadow-clay-inset dark:shadow-clay-inset-dark px-3 py-1 rounded-full text-xs font-medium` (Icon: Eye `👁️`).
- **Published:** `bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 shadow-clay-inset dark:shadow-clay-inset-dark px-3 py-1 rounded-full text-xs font-medium` (Icon: Check `✓`).
- **Archived:** `bg-ink-500/10 text-ink-600 dark:text-ink-400 border border-ink-500/30 shadow-clay-inset dark:shadow-clay-inset-dark px-3 py-1 rounded-full text-xs font-medium` (Icon: Archive `📦`).

### 6.3 KPI Metric Widgets (Admin Dashboard)
- **Structure:** Compact clay tile (`bg-white dark:bg-ink-900 rounded-2xl p-5 border border-ink-100 dark:border-ink-800 shadow-clay-card dark:shadow-clay-card-dark`).
- **Content:** Label (`text-xs font-mono uppercase text-ink-500`), Value (`text-2xl font-bold text-ink-900 dark:text-ink-50 tabular-nums`), and Subtext/Trend indicator.

### 6.4 Form Inputs & Rich Text Authoring
- **Text Inputs & Selects:**
  - Base: `w-full px-4 py-3 rounded-2xl bg-ink-50/70 dark:bg-ink-950/70 border border-ink-200/80 dark:border-ink-700/80 text-ink-900 dark:text-ink-100 text-sm shadow-clay-inset dark:shadow-clay-inset-dark outline-none transition-all`
  - Focus State: `focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`
- **Tabular Schedule Builder:**
  - Interactive grid allowing admin to add rows, delete rows, reorder columns, and preview `.tabular-nums` formatting in real time before publishing.

---

## 7. Motion & Tactile Feedback Guidelines

### 7.1 Tactile Feedback Principles
- Motion confirms interaction and provides physical satisfaction without feeling sluggish.
- Clay surfaces respond to cursor interactions with subtle translation (`hover:-translate-y-1`) and shadow shifts.
- Button presses use a slight depression (`active:scale-[0.98] active:translate-y-0.5`).

### 7.2 Animation Durations & Springs
- State transitions (dark/light mode, tab switching): `0.2s ease-out`.
- Modal/Drawer entrance: Spring animation (`stiffness: 300, damping: 25`).
- Dropdown menus: Snappy opacity fade with slight scale (`opacity: 0, scale: 0.95` → `opacity: 1, scale: 1`).

### 7.3 Accessibility Compliance (`prefers-reduced-motion`)
- In accordance with WCAG 2.1 Criterion 2.3.3:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
- All Framer Motion components dynamically query `prefers-reduced-motion` and collapse translations to instant renders.
