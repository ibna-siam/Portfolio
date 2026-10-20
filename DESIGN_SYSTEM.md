# Design System: Executive Financial Precision
## Siam's Accounting-Focused Hybrid Professional Portfolio

**Document Version:** 1.0.0  
**Phase:** Phase 2: Design Plan & System Specifications  
**Date:** October 10, 2026  
**Implementation Stack:** React 19, Tailwind CSS 3.4, PostCSS, Framer Motion 12  
**Target Identity:** Md Ibna Siam — Accounting & Finance Professional in Development  

---

## 1. Visual Direction & Design Philosophy

### 1.1 The Concept: "Executive Financial Precision"
The design language transitions Siam's portfolio from an informal developer template into an authoritative, editorial, and analytically rigorous executive presentation. 

### 1.2 Core Design Principles
1. **Editorial Rigor Over Tech Tropes:** Eliminate dark terminal screens, green hacker glows, typing prompts (`>`), and gratuitous floating shapes. Use crisp typography, structured borders, and generous whitespace reminiscent of the Financial Times, Bloomberg, or an annual corporate report.
2. **Tabular & Mathematical Clarity:** Financial figures, variance calculations, and ratio metrics must be presented with tabular alignment (`font-variant-numeric: tabular-nums`) to ensure scannability.
3. **Subtle & Restrained Motion:** Motion must exist solely to aid comprehension, reveal content progressively, and signal interactive states. No infinite spinning rings or bouncy badges.
4. **Accessible High-Contrast Foundations:** Ensure complete readability in both dark and light modes, exceeding WCAG 2.1 AA standards across all text and border treatments.

---

## 2. Color Architecture & Semantic Token System

### 2.1 Palette Foundations
The color system pairs a deep, authoritative **Executive Navy / Ink** foundation with a refined **Emerald Jade** accent (representing financial balance and prosperity) and an **Amber Gold** tone (for financial warnings, variances, and highlights).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRIMARY BRAND PALETTES                          │
├────────────────────────────────┬───────────────────────────────────────┤
│  NAVY / INK (Foundation)       │  EMERALD / TEAL (Growth / Primary)    │
│  50:  #F8FAFC (Ice Canvas)     │  50:  #ECFDF5                         │
│  100: #F1F5F9 (Soft Muted)     │  100: #D1FAE5                         │
│  200: #E2E8F0 (Divider Slate)  │  400: #34D399 (Dark Accent)           │
│  500: #64748B (Secondary Text) │  500: #10B981 (Brand Emerald)         │
│  800: #1E293B (Card Dark)      │  600: #059669 (Primary Button)        │
│  900: #0F172A (Surface Dark)   │  700: #047857 (Hover Dark)            │
│  950: #0A0F1D (Base Canvas)    │                                       │
├────────────────────────────────┴───────────────────────────────────────┤
│  AMBER (Variance / Attention)  │  SLATE (Neutral Financial Borders)    │
│  400: #FBBF24 (Dark Gold)      │  200: #E2E8F0                         │
│  500: #F59E0B (Accent Warning) │  700: #334155                         │
│  600: #D97706 (Deep Amber)     │  800: #1E293B                         │
└────────────────────────────────┴───────────────────────────────────────┘
```

### 2.2 Semantic Color Tokens (Light vs. Dark Mode)

| Semantic Token | Light Mode Value | Dark Mode Value | Usage Context |
|---|---|---|---|
| `--color-canvas-bg` | `#F8FAFC` (`slate-50`) | `#0A0F1D` (`slate-950`) | Global page background |
| `--color-surface-bg` | `#FFFFFF` (`white`) | `#111827` (`gray-900`) | Standard card and section backgrounds |
| `--color-surface-elevated` | `#FFFFFF` (`white`) | `#1E293B` (`slate-800`) | Modals, drawers, tooltips, dropdowns |
| `--color-text-primary` | `#0F172A` (`slate-900`) | `#F8FAFC` (`slate-50`) | Headings, primary metrics, card titles |
| `--color-text-secondary` | `#475569` (`slate-600`) | `#94A3B8` (`slate-400`) | Body copy, subtitles, methodological descriptions |
| `--color-text-muted` | `#64748B` (`slate-500`) | `#64748B` (`slate-500`) | Meta labels, date ranges, footnote text |
| `--color-border-subtle` | `#E2E8F0` (`slate-200`) | `#1E293B` (`slate-800`) | Card outlines, table rows, section dividers |
| `--color-border-strong` | `#CBD5E1` (`slate-300`) | `#334155` (`slate-700`) | Active tabs, focused controls, structural borders |
| `--color-brand-primary` | `#059669` (`emerald-600`) | `#10B981` (`emerald-500`) | Primary CTAs, active indicators, brand logo accent |
| `--color-brand-hover` | `#047857` (`emerald-700`) | `#059669` (`emerald-600`) | Primary button hover states |
| `--color-status-growth` | `#059669` (`emerald-600`) | `#34D399` (`emerald-400`) | Positive profit, upward trend, favorable variance |
| `--color-status-variance` | `#D97706` (`amber-600`) | `#FBBF24` (`amber-400`) | Deficit warning, adverse variance, monitor item |
| `--color-status-risk` | `#DC2626` (`red-600`) | `#F87171` (`red-400`) | Audit control weakness, high risk rating |

*Accessibility Rule:* Financial status (e.g. positive trend vs. deficit) must **never** rely on color alone. Always pair color with an explicit textual or numerical indicator (e.g. `↑ Positive`, `↓ Adverse`, `+15.8%`, `(BDT 1,200,000)`).

---

## 3. Typography Architecture

### 3.1 Font Family Stacks
1. **Display & Section Titles:**
   - Font: `Playfair Display`, `Georgia`, serif
   - Role: Imparts corporate authority, editorial tradition, and visual distinction to section headers and name typography.
2. **Body & Interface:**
   - Font: `DM Sans`, `Inter`, -apple-system, BlinkMacSystemFont, sans-serif
   - Role: Provides crisp legibility, high x-height, and clean rendering across desktop and mobile screens.
3. **Tabular Figures & Financial Codes:**
   - Font: `JetBrains Mono`, `SFMono-Regular`, Menlo, monospace
   - Role: Used for ratio values, data tables, date ranges, and category eyebrow tags. Enforces `font-variant-numeric: tabular-nums`.

### 3.2 Responsive Type Scale

| Scale Token | Desktop Size / Line-Height | Mobile Size / Line-Height | Weight | Applied Element |
|---|---|---|---|---|
| `text-display-xl` | 3.75rem (60px) / 1.1 | 2.5rem (40px) / 1.15 | Bold (700) | Hero Headline ("Hi, I'm Siam") |
| `text-display-lg` | 2.5rem (40px) / 1.2 | 2rem (32px) / 1.25 | Bold (700) | Primary Section Headings (`<h2>`) |
| `text-title-md` | 1.5rem (24px) / 1.3 | 1.25rem (20px) / 1.3 | Semi-Bold (600) | Case Study / Card Titles (`<h3>`) |
| `text-title-sm` | 1.125rem (18px) / 1.4 | 1rem (16px) / 1.4 | Semi-Bold (600) | Modal Sub-headings, Table Titles |
| `text-body-lg` | 1.125rem (18px) / 1.6 | 1rem (16px) / 1.55 | Regular (400) | Hero Intro Paragraph, About Summary |
| `text-body-base` | 1rem (16px) / 1.6 | 0.9375rem (15px) / 1.5 | Regular (400) | Card Descriptions, Report Findings |
| `text-body-sm` | 0.875rem (14px) / 1.5 | 0.8125rem (13px) / 1.45 | Regular / Medium | Table Cells, Methodology Text |
| `text-caption` | 0.75rem (12px) / 1.4 | 0.75rem (12px) / 1.4 | Medium (500) | Metadata Tags, Eyebrow Labels, Footnotes |

### 3.3 Font Loading & Fallback Strategy
```css
/* Google Fonts Import with display=swap */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');
```
- In CSS base layer, declare:
  ```css
  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }
  ```

---

## 4. Layout, Spacing & Grid System

### 4.1 Grid & Container Boundaries
- **Maximum Width:** `max-w-6xl` (1,152 px) centered with `mx-auto`.
- **Gutter Padding:**
  - Mobile: `px-5` (20 px)
  - Tablet: `px-8` (32 px)
  - Desktop: `px-8` (32 px)
- **Section Vertical Spacing:**
  - Standard Section: `py-20 sm:py-24` (80px–96px padding)
  - Compact Section (Ribbon / Stats): `py-10 sm:py-12` (40px–48px padding)

### 4.2 Spacing Scale
Follows standard 8pt grid tokens:
- `gap-2` (8px), `gap-3` (12px), `gap-4` (16px), `gap-6` (24px), `gap-8` (32px), `gap-12` (48px).

### 4.3 Corner Radius & Border Standards
- Cards & Modals: `rounded-2xl` (16px) for refined modernity.
- Badges & Buttons: `rounded-xl` (12px) or `rounded-full` (for category pills).
- Border Width: Standard `border` (1px) with subtle opacity (`border-slate-200 dark:border-slate-800`).

---

## 5. Reusable Component Specifications

### 5.1 Section Heading Component (`SectionHeading.jsx`)
- **Structure:**
  - Eyebrow tag: `font-mono text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold mb-2 block`
  - Title: `font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-3`
  - Subtitle: `text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed`

### 5.2 Button System
- **Primary Action (e.g. Download CV):**
  - Classes: `inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-medium text-sm rounded-xl shadow-sm hover:shadow transition-all duration-200 cursor-pointer`
- **Secondary Action (e.g. View Case Studies):**
  - Classes: `inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-sm rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-200 cursor-pointer`
- **Ghost / Icon Button (e.g. Theme Toggle):**
  - Classes: `p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer`

### 5.3 Case Study Preview Card (`ProjectCard.jsx`)
- **Structure:**
  - Container: Elevated surface (`bg-white dark:bg-slate-900`), `rounded-2xl`, `border border-slate-200 dark:border-slate-800`, subtle hover lift (`hover:-translate-y-1 hover:border-emerald-500/40`).
  - Image Header: 180px height image with gentle gradient scrim; category badge on top-left (`px-2.5 py-1 text-xs font-semibold rounded-full`), academic status badge on bottom-left.
  - Body:
    - Case study title (`font-display font-semibold text-lg text-slate-900 dark:text-slate-100 line-clamp-2 mb-2`).
    - Problem summary description (`text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4`).
    - Key Metric / Outcome Callout: A highlighted box (`bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-2.5 text-xs text-slate-700 dark:text-slate-300`).
    - Tool tags: Max 3 pills (`text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-slate-600 dark:text-slate-400`).
    - Action trigger: *"View Case Study →"* link.

### 5.4 Financial Data Table Component
- **Structure:**
  - Encapsulating wrapper with `overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800`.
  - Header: `bg-slate-50 dark:bg-slate-800/60 font-semibold text-xs text-slate-700 dark:text-slate-300 px-3.5 py-2.5 text-left`.
  - Body Cells: `px-3.5 py-2.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200/60 dark:border-slate-800/60 tabular-nums`.
  - First Column: Pinned or bolded for row labels.
  - Positive trend cells: subtle emerald highlight or badge.

### 5.5 Case Study Viewer Modal / Drawer (`CaseStudyModal.jsx`)
- **Structure:**
  - High z-index overlay (`fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm`).
  - Content Sheet: `max-w-4xl w-full max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl`.
  - Sections:
    1. Executive Summary & Business Background
    2. Analytical Objectives & Problem Statement
    3. Methodology & Compliance Framework (IFRS / ITA 2023 / BSA)
    4. Key Findings & Tabular Statements
    5. Actionable Strategic Recommendations

### 5.6 Form Controls
- Standard Input & Textarea:
  - Base: `w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 outline-none transition-all`
  - Focus state: `focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`
  - Error state: `border-red-500 focus:border-red-500 focus:ring-red-500/20`

---

## 6. Motion & Animation Guidelines

### 6.1 Principles of Purposeful Motion
- Motion in this portfolio serves two purposes only:
  1. Confirming interaction (button click, filter tab switch).
  2. Guiding visual focus upon scroll (subtle fade-in of section content).
- No distracting loops, spinning wheels, or bouncing badges.

### 6.2 Timing & Easing Curves
- Standard Duration: `0.2s – 0.4s` (snappy, professional).
- Section Reveal: `0.5s` duration with cubic ease: `ease: [0.22, 1, 0.36, 1]` (graceful deceleration).
- Modal Entry: `0.25s` scale-up from `0.98` with opacity.

### 6.3 Reduced Motion Accessibility
- In accordance with WCAG 2.1 Criteria 2.3.3:
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
- In Framer Motion components, honor `window.matchMedia("(prefers-reduced-motion: reduce)").matches` to disable transform translations and render instant state transitions.
