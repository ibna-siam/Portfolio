import { cache } from "react";
import { eq, asc } from "drizzle-orm";
import { getDb } from "./db";
import {
  caseStudies,
  financialSchedules,
  caseStudyDiscrepancies,
  competencies,
  academicMilestones,
  techSolutions,
  siteSettings,
} from "./db/schema";

/**
 * Public Data Access Layer (Server-Only)
 *
 * Enforces strict publication boundary, privacy guardrails (VAL-07),
 * and financial disclosure integrity (VAL-08, VAL-09, VAL-10, VAL-11).
 */

export interface PublicSiteSettings {
  siteName: string;
  ownerName: string;
  headline: string;
  taglines: string[];
  bio: string;
  location: string;
  publicEmail: string;
  resumeUrl: string | null;
  avatarUrl: string | null;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  aboutSummary: string;
  aboutHighlights: Array<{ label: string; value: string }>;
  accaTrajectory: {
    qualification: string;
    credentialBody: string;
    trajectoryType: string;
    statusLabel: string;
    integrityNotice: string;
    strategicFocus: string[];
  };
}

export interface PublicCaseStudySummary {
  id: string;
  sourceId: number;
  slug: string;
  title: string;
  category: string;
  group: string;
  groupId: string;
  groupShort: string;
  academicScope: string;
  framework: string;
  evidenceType: string;
  currencyUnit: string;
  calculationBasis: string;
  integrityStatusKey: string;
  description: string;
  featured: boolean;
  status: string;
  hasDiscrepancy: boolean;
  discrepancyHeadline?: string;
  discrepancySummary?: string;
  updatedAt: Date;
}

export interface PublicFinancialSchedule {
  id: string;
  title: string;
  headers: string[];
  rows: string[][];
  notes: string | null;
  sortOrder: number;
}

export interface PublicDiscrepancyNotice {
  id: string;
  headline: string;
  summary: string;
  details: string[];
  originalValues: string;
  formulaTested: string;
  statusText: string;
  preservationPolicy: string;
}

export interface PublicCaseStudyDetail extends PublicCaseStudySummary {
  inputsClassification: string;
  overview: string;
  objectives: string[];
  methodology: Array<{ heading: string; body: string }>;
  keyFindings: string[];
  conclusion: string;
  recommendations: string[];
  auditNotes: Array<{ topic: string; finding: string; status: string }>;
  formulas: Array<{ name: string; formula: string }>;
  tools: string[];
  details: string[];
  imageUrl: string | null;
  schedules: PublicFinancialSchedule[];
  discrepancy: PublicDiscrepancyNotice | null;
  updatedAt: Date;
}

/**
 * Retrieve public-safe site settings.
 * Strict Guardrail VAL-07: privatePhone is intentionally NOT selected or returned.
 */
export const getPublicSiteSettings = cache(
  async (): Promise<PublicSiteSettings | null> => {
    const db = getDb();
    const [row] = await db
      .select({
        siteName: siteSettings.siteName,
        ownerName: siteSettings.ownerName,
        headline: siteSettings.headline,
        taglines: siteSettings.taglines,
        bio: siteSettings.bio,
        location: siteSettings.location,
        publicEmail: siteSettings.publicEmail,
        resumeUrl: siteSettings.resumeUrl,
        avatarUrl: siteSettings.avatarUrl,
        socialLinks: siteSettings.socialLinks,
        aboutSummary: siteSettings.aboutSummary,
        aboutHighlights: siteSettings.aboutHighlights,
        accaTrajectory: siteSettings.accaTrajectory,
      })
      .from(siteSettings)
      .limit(1);

    return row || null;
  }
);

/**
 * Retrieve case studies for public listing.
 * By default, retrieves ONLY status = 'published'.
 * When isDraftMode = true, also includes drafts for authorized previewers.
 * Wrapped in React cache using normalized primitive boolean to ensure deduplication.
 */
const getPublicCaseStudiesInternal = cache(
  async (isDraftMode: boolean): Promise<PublicCaseStudySummary[]> => {
    const db = getDb();

    let query = db
      .select({
        id: caseStudies.id,
        sourceId: caseStudies.sourceId,
        slug: caseStudies.slug,
        title: caseStudies.title,
        category: caseStudies.category,
        group: caseStudies.group,
        groupId: caseStudies.groupId,
        groupShort: caseStudies.groupShort,
        academicScope: caseStudies.academicScope,
        framework: caseStudies.framework,
        evidenceType: caseStudies.evidenceType,
        currencyUnit: caseStudies.currencyUnit,
        calculationBasis: caseStudies.calculationBasis,
        integrityStatusKey: caseStudies.integrityStatusKey,
        description: caseStudies.description,
        featured: caseStudies.featured,
        status: caseStudies.status,
        updatedAt: caseStudies.updatedAt,
      })
      .from(caseStudies)
      .orderBy(asc(caseStudies.sourceId));

    if (!isDraftMode) {
      query = query.where(eq(caseStudies.status, "published")) as typeof query;
    }

    // Parallelize case study query and discrepancy lookup to eliminate sequential roundtrips
    const [rows, discrepancies] = await Promise.all([
      query,
      db.select().from(caseStudyDiscrepancies),
    ]);

    const discrepancyMap = new Map<string, (typeof discrepancies)[0]>();
    for (const disc of discrepancies) {
      discrepancyMap.set(disc.caseStudyId, disc);
    }

    return rows.map((study) => {
      const disc = discrepancyMap.get(study.id);
      return {
        ...study,
        hasDiscrepancy: Boolean(disc),
        discrepancyHeadline: disc?.headline,
        discrepancySummary: disc?.summary,
      };
    });
  }
);

export async function getPublicCaseStudies(options?: {
  isDraftMode?: boolean;
}): Promise<PublicCaseStudySummary[]> {
  return getPublicCaseStudiesInternal(Boolean(options?.isDraftMode));
}

/**
 * Retrieve a single case study by slug with all related financial schedules and discrepancy notices.
 * By default, only returns if status = 'published'.
 * When isDraftMode = true, allows previewing drafts.
 * Wrapped in React cache with normalized primitive arguments to deduplicate across generateMetadata and Page render.
 */
const getCaseStudyBySlugInternal = cache(
  async (slug: string, isDraftMode: boolean): Promise<PublicCaseStudyDetail | null> => {
    const db = getDb();

    const query = db
      .select()
      .from(caseStudies)
      .where(eq(caseStudies.slug, slug))
      .limit(1);

    const [study] = await query;

    if (!study) {
      return null;
    }

    // If not in draft mode and not published, treat as not found
    if (!isDraftMode && study.status !== "published") {
      return null;
    }

    // Fetch associated financial schedules and discrepancy disclosure in parallel
    const [schedules, [discrepancyRow]] = await Promise.all([
      db
        .select({
          id: financialSchedules.id,
          title: financialSchedules.title,
          headers: financialSchedules.headers,
          rows: financialSchedules.rows,
          notes: financialSchedules.notes,
          sortOrder: financialSchedules.sortOrder,
        })
        .from(financialSchedules)
        .where(eq(financialSchedules.caseStudyId, study.id))
        .orderBy(asc(financialSchedules.sortOrder)),
      db
        .select({
          id: caseStudyDiscrepancies.id,
          headline: caseStudyDiscrepancies.headline,
          summary: caseStudyDiscrepancies.summary,
          details: caseStudyDiscrepancies.details,
          originalValues: caseStudyDiscrepancies.originalValues,
          formulaTested: caseStudyDiscrepancies.formulaTested,
          statusText: caseStudyDiscrepancies.statusText,
          preservationPolicy: caseStudyDiscrepancies.preservationPolicy,
        })
        .from(caseStudyDiscrepancies)
        .where(eq(caseStudyDiscrepancies.caseStudyId, study.id))
        .limit(1),
    ]);

    return {
      id: study.id,
      sourceId: study.sourceId,
      slug: study.slug,
      title: study.title,
      category: study.category,
      group: study.group,
      groupId: study.groupId,
      groupShort: study.groupShort,
      academicScope: study.academicScope,
      framework: study.framework,
      evidenceType: study.evidenceType,
      currencyUnit: study.currencyUnit,
      inputsClassification: study.inputsClassification,
      calculationBasis: study.calculationBasis,
      integrityStatusKey: study.integrityStatusKey,
      description: study.description,
      details: study.details,
      tools: study.tools,
      imageUrl: study.imageUrl,
      featured: study.featured,
      overview: study.overview,
      objectives: study.objectives,
      methodology: study.methodology,
      keyFindings: study.keyFindings,
      conclusion: study.conclusion,
      recommendations: study.recommendations,
      auditNotes: study.auditNotes,
      formulas: study.formulas,
      status: study.status,
      updatedAt: study.updatedAt,
      hasDiscrepancy: Boolean(discrepancyRow),
      discrepancyHeadline: discrepancyRow?.headline,
      discrepancySummary: discrepancyRow?.summary,
      schedules,
      discrepancy: discrepancyRow || null,
    };
  }
);

export async function getCaseStudyBySlug(
  slug: string,
  options?: { isDraftMode?: boolean }
): Promise<PublicCaseStudyDetail | null> {
  return getCaseStudyBySlugInternal(slug, Boolean(options?.isDraftMode));
}

/**
 * Retrieve public competencies matrix across 4 domains.
 */
export const getPublicCompetencies = cache(async () => {
  const db = getDb();
  return db
    .select({
      id: competencies.id,
      name: competencies.name,
      domain: competencies.domain,
      category: competencies.category,
      evidenceLabel: competencies.evidenceLabel,
      description: competencies.description,
      frameworkTags: competencies.frameworkTags,
      relatedProject: competencies.relatedProject,
      sortOrder: competencies.sortOrder,
    })
    .from(competencies)
    .where(eq(competencies.status, "published"))
    .orderBy(asc(competencies.sortOrder));
});

/**
 * Retrieve public educational milestones.
 */
export const getPublicAcademicMilestones = cache(async () => {
  const db = getDb();
  return db
    .select({
      id: academicMilestones.id,
      institution: academicMilestones.institution,
      campus: academicMilestones.campus,
      degree: academicMilestones.degree,
      major: academicMilestones.major,
      status: academicMilestones.status,
      period: academicMilestones.period,
      overview: academicMilestones.overview,
      disciplines: academicMilestones.disciplines,
      connectedStudies: academicMilestones.connectedStudies,
      sortOrder: academicMilestones.sortOrder,
    })
    .from(academicMilestones)
    .orderBy(asc(academicMilestones.sortOrder));
});

/**
 * Retrieve public tech and business solutions.
 */
export const getPublicTechSolutions = cache(async () => {
  const db = getDb();
  return db
    .select({
      id: techSolutions.id,
      title: techSolutions.title,
      category: techSolutions.category,
      status: techSolutions.status,
      statusTheme: techSolutions.statusTheme,
      problem: techSolutions.problem,
      solution: techSolutions.solution,
      userRole: techSolutions.userRole,
      techStack: techSolutions.techStack,
      features: techSolutions.features,
      verifiedRepo: techSolutions.verifiedRepo,
      verifiedDemo: techSolutions.verifiedDemo,
      linkText: techSolutions.linkText,
      sortOrder: techSolutions.sortOrder,
    })
    .from(techSolutions)
    .where(eq(techSolutions.contentStatus, "published"))
    .orderBy(asc(techSolutions.sortOrder));
});
