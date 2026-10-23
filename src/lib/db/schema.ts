import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  boolean,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// -----------------------------------------------------------------------------
// 1. Users & Administrative Authentication (Auth.js Compatible Foundation)
// -----------------------------------------------------------------------------
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  image: text("image"),
  role: varchar("role", { length: 50 }).default("user").notNull(),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// -----------------------------------------------------------------------------
// 2. Site Settings & Profile Configuration
// -----------------------------------------------------------------------------
export const siteSettings = pgTable("site_settings", {
  id: varchar("id", { length: 50 }).primaryKey().default("default"),
  siteName: varchar("site_name", { length: 255 }).notNull(),
  ownerName: varchar("owner_name", { length: 255 }).notNull(),
  headline: varchar("headline", { length: 255 }).notNull(),
  taglines: jsonb("taglines").$type<string[]>().notNull(),
  bio: text("bio").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  publicEmail: varchar("public_email", { length: 255 }).notNull(),
  // Private phone number stored for admin record only; strict guardrail VAL-07: NEVER expose on public UI
  privatePhone: varchar("private_phone", { length: 50 }),
  phonePrivacyStatus: varchar("phone_privacy_status", { length: 50 })
    .default("hidden")
    .notNull(),
  resumeUrl: text("resume_url"),
  avatarUrl: text("avatar_url"),
  socialLinks: jsonb("social_links")
    .$type<{
      github?: string;
      linkedin?: string;
      twitter?: string;
      facebook?: string;
    }>()
    .notNull(),
  aboutSummary: text("about_summary").notNull(),
  aboutHighlights: jsonb("about_highlights")
    .$type<Array<{ label: string; value: string }>>()
    .notNull(),
  accaTrajectory: jsonb("acca_trajectory")
    .$type<{
      qualification: string;
      credentialBody: string;
      trajectoryType: string;
      statusLabel: string;
      integrityNotice: string;
      strategicFocus: string[];
    }>()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// -----------------------------------------------------------------------------
// 3. System Settings (Operational Key-Value Pairs)
// -----------------------------------------------------------------------------
export const systemSettings = pgTable("system_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: jsonb("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// -----------------------------------------------------------------------------
// 4. Academic Case Studies & Research Papers (8 Studies)
// -----------------------------------------------------------------------------
export const caseStudies = pgTable(
  "case_studies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sourceId: integer("source_id").notNull().unique(), // 1 through 8
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: text("title").notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    group: varchar("group", { length: 100 }).notNull(), // e.g. "Applied Accounting Case Study"
    groupId: varchar("group_id", { length: 50 }).notNull(), // "accounting" | "macroeconomics"
    groupShort: varchar("group_short", { length: 50 }).notNull(), // "Accounting" | "Research"
    academicScope: text("academic_scope").notNull(),
    framework: text("framework").notNull(),
    evidenceType: text("evidence_type").notNull(),
    currencyUnit: varchar("currency_unit", { length: 100 }).notNull(),
    inputsClassification: text("inputs_classification").notNull(),
    calculationBasis: text("calculation_basis").notNull(),
    integrityStatusKey: varchar("integrity_status_key", { length: 50 }).notNull(),
    secondaryStatusKey: varchar("secondary_status_key", { length: 50 }),
    description: text("description").notNull(),
    details: jsonb("details").$type<string[]>().notNull(),
    tools: jsonb("tools").$type<string[]>().notNull(),
    imageUrl: text("image_url"),
    outcome: text("outcome").notNull(),
    type: varchar("type", { length: 50 }).default("Academic Project").notNull(),
    featured: boolean("featured").default(false).notNull(),
    overview: text("overview").notNull(),
    objectives: jsonb("objectives").$type<string[]>().notNull(),
    methodology: jsonb("methodology")
      .$type<Array<{ heading: string; body: string }>>()
      .notNull(),
    keyFindings: jsonb("key_findings").$type<string[]>().notNull(),
    conclusion: text("conclusion").notNull(),
    recommendations: jsonb("recommendations").$type<string[]>().notNull(),
    auditNotes: jsonb("audit_notes")
      .$type<Array<{ topic: string; finding: string; status: string }>>()
      .notNull(),
    formulas: jsonb("formulas")
      .$type<Array<{ name: string; formula: string }>>()
      .notNull(),
    status: varchar("status", { length: 20 }).default("published").notNull(), // 'draft' | 'preview' | 'published' | 'archived'
    version: integer("version").default(1).notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("case_studies_slug_idx").on(table.slug),
    index("case_studies_group_idx").on(table.groupId),
    index("case_studies_status_idx").on(table.status),
  ]
);

// -----------------------------------------------------------------------------
// 5. Financial Tabular Schedules (Heterogeneous Tables with .tabular-nums)
// -----------------------------------------------------------------------------
export const financialSchedules = pgTable(
  "financial_schedules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    caseStudyId: uuid("case_study_id")
      .notNull()
      .references(() => caseStudies.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    headers: jsonb("headers").$type<string[]>().notNull(),
    rows: jsonb("rows").$type<string[][]>().notNull(),
    notes: text("notes"),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("financial_schedules_case_study_idx").on(table.caseStudyId)]
);

// -----------------------------------------------------------------------------
// 6. Case Study Integrity Disclosures & Mathematical Discrepancies
// -----------------------------------------------------------------------------
export const caseStudyDiscrepancies = pgTable(
  "case_study_discrepancies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    caseStudyId: uuid("case_study_id")
      .notNull()
      .references(() => caseStudies.id, { onDelete: "cascade" }),
    headline: text("headline").notNull(),
    summary: text("summary").notNull(),
    details: jsonb("details").$type<string[]>().notNull(),
    originalValues: text("original_values").notNull(),
    formulaTested: text("formula_tested").notNull(),
    statusText: text("status_text").notNull(),
    preservationPolicy: text("preservation_policy").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("discrepancies_case_study_idx").on(table.caseStudyId)]
);

// -----------------------------------------------------------------------------
// 7. Accounting & Financial Competencies Matrix (16 Competencies)
// -----------------------------------------------------------------------------
export const competencies = pgTable(
  "competencies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    domain: varchar("domain", { length: 100 }).notNull(), // "Financial Accounting", "Managerial Accounting", etc.
    category: varchar("category", { length: 100 }).notNull(),
    evidenceLabel: varchar("evidence_label", { length: 50 }).notNull(), // "Case Study", "Coursework", etc.
    description: text("description").notNull(),
    frameworkTags: jsonb("framework_tags").$type<string[]>().notNull(),
    relatedProject: text("related_project").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    status: varchar("status", { length: 20 }).default("published").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("competencies_domain_idx").on(table.domain),
    index("competencies_sort_idx").on(table.sortOrder),
  ]
);

// -----------------------------------------------------------------------------
// 8. Academic Milestones & Qualifications (3 Milestones + Future Trajectory)
// -----------------------------------------------------------------------------
export const academicMilestones = pgTable(
  "academic_milestones",
  {
    id: varchar("id", { length: 50 }).primaryKey(), // "bba-accounting", "hsc-business", "ssc-business"
    institution: varchar("institution", { length: 255 }).notNull(),
    campus: text("campus").notNull(),
    degree: varchar("degree", { length: 255 }).notNull(),
    major: varchar("major", { length: 100 }).notNull(),
    status: varchar("status", { length: 100 }).notNull(),
    period: varchar("period", { length: 50 }).notNull(),
    overview: text("overview").notNull(),
    disciplines: jsonb("disciplines").$type<string[]>().notNull(),
    connectedStudies: jsonb("connected_studies")
      .$type<
        Array<{
          id: number;
          title: string;
          discipline: string;
        }>
      >()
      .notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("academic_milestones_sort_idx").on(table.sortOrder)]
);

// -----------------------------------------------------------------------------
// 9. Technology & Business Problem-Solving Solutions (3 Systems)
// -----------------------------------------------------------------------------
export const techSolutions = pgTable(
  "tech_solutions",
  {
    id: varchar("id", { length: 100 }).primaryKey(), // "financial-portfolio-engine", etc.
    title: text("title").notNull(),
    category: varchar("category", { length: 255 }).notNull(),
    status: varchar("status", { length: 100 }).notNull(),
    statusTheme: varchar("status_theme", { length: 50 }).notNull(),
    problem: text("problem").notNull(),
    solution: text("solution").notNull(),
    userRole: text("user_role").notNull(),
    techStack: jsonb("tech_stack").$type<string[]>().notNull(),
    features: jsonb("features").$type<string[]>().notNull(),
    verifiedRepo: text("verified_repo"),
    verifiedDemo: text("verified_demo"),
    linkText: varchar("link_text", { length: 100 }).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    contentStatus: varchar("content_status", { length: 20 })
      .default("published")
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("tech_solutions_sort_idx").on(table.sortOrder)]
);

// -----------------------------------------------------------------------------
// 10. Media Asset Metadata (Cloudinary Storage Register)
// -----------------------------------------------------------------------------
export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    publicId: varchar("public_id", { length: 255 }).notNull().unique(),
    secureUrl: text("secure_url").notNull(),
    format: varchar("format", { length: 50 }),
    width: integer("width"),
    height: integer("height"),
    bytes: integer("bytes"),
    altText: text("alt_text"),
    folder: varchar("folder", { length: 100 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("media_assets_public_id_idx").on(table.publicId)]
);

// -----------------------------------------------------------------------------
// 11. Content Revision History (Draft -> Preview -> Publish Safe Reversion)
// -----------------------------------------------------------------------------
export const contentRevisions = pgTable(
  "content_revisions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entityType: varchar("entity_type", { length: 50 }).notNull(), // 'case_study', 'site_settings', etc.
    entityId: varchar("entity_id", { length: 100 }).notNull(),
    revisionNumber: integer("revision_number").notNull(),
    snapshot: jsonb("snapshot").notNull(),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
    changeSummary: text("change_summary"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("content_revisions_entity_idx").on(table.entityType, table.entityId)]
);

// -----------------------------------------------------------------------------
// 12. Administrative Activity Audit Log
// -----------------------------------------------------------------------------
export const activityLogs = pgTable(
  "activity_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    action: varchar("action", { length: 100 }).notNull(), // 'create', 'update', 'publish', 'archive'
    entityType: varchar("entity_type", { length: 50 }).notNull(),
    entityId: varchar("entity_id", { length: 100 }),
    userId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("activity_logs_action_idx").on(table.action),
    index("activity_logs_created_at_idx").on(table.createdAt),
  ]
);
