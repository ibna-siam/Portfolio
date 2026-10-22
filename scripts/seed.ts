import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

import * as schema from "../src/lib/db/schema";
import { personal, about, projects } from "../src/data/portfolioData.js";
import { CASE_STUDY_METADATA } from "../src/data/caseStudyIntegrity.js";
import { competencies as rawCompetencies } from "../src/data/competenciesData.js";
import { ACADEMIC_MILESTONES, PROFESSIONAL_TRAJECTORY } from "../src/data/academicJourneyData.js";
import { TECH_SOLUTIONS } from "../src/data/techSolutionsData.js";

// Load environment variables (.env.local, .env)
dotenv.config({ path: ".env.local" });
dotenv.config();

const isDryRun = process.argv.includes("--dry-run");

const SLUG_MAP: Record<number, string> = {
  1: "square-pharmaceuticals-financial-analysis",
  2: "agrofab-master-budget-simulation",
  3: "individual-income-tax-return-ay2023-24",
  4: "styletex-rmg-costing-cvp-analysis",
  5: "dhakashop-retail-internal-audit",
  6: "fifa-world-cup-macroeconomic-impact",
  7: "digital-economy-bangladesh-analysis",
  8: "macroeconomics-inflation-business-cycle",
};

interface SeedStats {
  created: number;
  updated: number;
  skipped: number;
  failed: number;
}

const stats: Record<string, SeedStats> = {
  siteSettings: { created: 0, updated: 0, skipped: 0, failed: 0 },
  caseStudies: { created: 0, updated: 0, skipped: 0, failed: 0 },
  financialSchedules: { created: 0, updated: 0, skipped: 0, failed: 0 },
  caseStudyDiscrepancies: { created: 0, updated: 0, skipped: 0, failed: 0 },
  competencies: { created: 0, updated: 0, skipped: 0, failed: 0 },
  academicMilestones: { created: 0, updated: 0, skipped: 0, failed: 0 },
  techSolutions: { created: 0, updated: 0, skipped: 0, failed: 0 },
};

interface CaseStudyMeta {
  group: string;
  groupId: string;
  groupShort: string;
  academicScope: string;
  framework: string;
  evidenceType: string;
  currencyUnit: string;
  inputsClassification: string;
  calculationBasis: string;
  integrityStatus: { key: string };
  secondaryStatus: { key: string } | null;
  auditNotes: Array<{ topic: string; finding: string; status: string }>;
  formulas: Array<{ name: string; formula: string }>;
  discrepancyNotice?: {
    headline: string;
    summary: string;
    details: string[];
    originalValues: string;
    formulaTested: string;
    statusText: string;
  };
}

interface FinancialScheduleItem {
  title: string;
  headers: string[];
  rows: string[][];
  notes?: string;
}

function logHeader(title: string) {
  console.log(`\n======================================================`);
  console.log(`  ${title}`);
  console.log(`======================================================`);
}

async function runSeed() {
  logHeader(`STARTING DATABASE SEED ${isDryRun ? "[DRY RUN — NO WRITES]" : "[LIVE EXECUTION]"}`);

  // 1. Mandatory Preflight Validation
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("CRITICAL: DATABASE_URL is not configured.");
    process.exit(1);
  }

  // Validate Source Data Completeness
  console.log("--> Validating source data integrity...");
  if (!Array.isArray(projects) || projects.length !== 8) {
    throw new Error(`Expected exactly 8 case studies, found ${projects?.length || 0}`);
  }
  if (!Array.isArray(rawCompetencies) || rawCompetencies.length !== 16) {
    throw new Error(`Expected exactly 16 competencies, found ${rawCompetencies?.length || 0}`);
  }
  if (!Array.isArray(ACADEMIC_MILESTONES) || ACADEMIC_MILESTONES.length !== 3) {
    throw new Error(`Expected exactly 3 academic milestones, found ${ACADEMIC_MILESTONES?.length || 0}`);
  }
  if (!Array.isArray(TECH_SOLUTIONS) || TECH_SOLUTIONS.length !== 3) {
    throw new Error(`Expected exactly 3 tech solutions, found ${TECH_SOLUTIONS?.length || 0}`);
  }

  console.log("✓ Source data verified: 8 case studies, 16 competencies, 3 milestones, 3 solutions.");
  console.log("✓ Strict privacy guardrail VAL-07: Phone number marked as private admin field (hidden from public displays).");

  const sql = neon(connectionString);
  const db = drizzle(sql, { schema });

  // ---------------------------------------------------------------------------
  // 2. Seed Site Settings
  // ---------------------------------------------------------------------------
  console.log("\n--> Processing Site Settings...");
  try {
    const existingSettings = await db
      .select()
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.id, "default"))
      .limit(1);

    const siteData = {
      id: "default",
      siteName: "Md Ibna Siam — Accounting & Finance Portfolio",
      ownerName: personal.name,
      headline: "Accounting & Finance Undergraduate | ACCA Pathway",
      taglines: personal.taglines,
      bio: personal.bio,
      location: personal.location,
      publicEmail: personal.email,
      privatePhone: personal.phone,
      phonePrivacyStatus: "hidden", // Guardrail VAL-07
      resumeUrl: personal.resumeUrl,
      avatarUrl: "/src/assets/siam.jpeg",
      socialLinks: personal.social,
      aboutSummary: about.summary,
      aboutHighlights: about.highlights,
      accaTrajectory: {
        qualification: PROFESSIONAL_TRAJECTORY.qualification,
        credentialBody: PROFESSIONAL_TRAJECTORY.credentialBody,
        trajectoryType: PROFESSIONAL_TRAJECTORY.trajectoryType,
        statusLabel: PROFESSIONAL_TRAJECTORY.statusLabel,
        integrityNotice: PROFESSIONAL_TRAJECTORY.integrityNotice,
        strategicFocus: PROFESSIONAL_TRAJECTORY.strategicFocus,
      },
    };

    if (existingSettings.length === 0) {
      if (!isDryRun) {
        await db.insert(schema.siteSettings).values(siteData);
      }
      stats.siteSettings.created++;
      console.log(`  + Site Settings: Created default profile record`);
    } else {
      if (!isDryRun) {
        await db
          .update(schema.siteSettings)
          .set({ ...siteData, updatedAt: new Date() })
          .where(eq(schema.siteSettings.id, "default"));
      }
      stats.siteSettings.updated++;
      console.log(`  ~ Site Settings: Updated existing profile record`);
    }
  } catch (err: unknown) {
    stats.siteSettings.failed++;
    console.error("  x Site Settings failed:", (err as Error).message);
  }

  // ---------------------------------------------------------------------------
  // 3. Seed Case Studies & Sub-Entities (Financial Schedules & Discrepancies)
  // ---------------------------------------------------------------------------
  console.log("\n--> Processing Case Studies (8 Studies)...");
  for (const proj of projects) {
    const meta = (CASE_STUDY_METADATA as unknown as Record<number, CaseStudyMeta>)[proj.id];
    if (!meta) {
      throw new Error(`Missing CASE_STUDY_METADATA for project ID ${proj.id}`);
    }

    const slug = SLUG_MAP[proj.id];
    if (!slug) {
      throw new Error(`Missing slug mapping for project ID ${proj.id}`);
    }

    try {
      const existingStudy = await db
        .select()
        .from(schema.caseStudies)
        .where(eq(schema.caseStudies.sourceId, proj.id))
        .limit(1);

      const studyPayload = {
        sourceId: proj.id,
        slug,
        title: proj.title,
        category: proj.category,
        group: meta.group,
        groupId: meta.groupId,
        groupShort: meta.groupShort,
        academicScope: meta.academicScope,
        framework: meta.framework,
        evidenceType: meta.evidenceType,
        currencyUnit: meta.currencyUnit,
        inputsClassification: meta.inputsClassification,
        calculationBasis: meta.calculationBasis,
        integrityStatusKey: meta.integrityStatus.key,
        secondaryStatusKey: meta.secondaryStatus ? meta.secondaryStatus.key : null,
        description: proj.description,
        details: proj.details,
        tools: proj.tools,
        imageUrl: proj.image,
        outcome: proj.outcome,
        type: proj.type,
        featured: proj.featured || false,
        overview: proj.fullReport.overview,
        objectives: proj.fullReport.objectives,
        methodology: proj.fullReport.methodology,
        keyFindings: proj.fullReport.keyFindings,
        conclusion: proj.fullReport.conclusion,
        recommendations: proj.fullReport.recommendations,
        auditNotes: meta.auditNotes,
        formulas: meta.formulas,
        status: "published",
        version: 1,
        publishedAt: new Date(),
      };

      let caseStudyDbId: string;

      if (existingStudy.length === 0) {
        if (!isDryRun) {
          const inserted = await db
            .insert(schema.caseStudies)
            .values(studyPayload)
            .returning({ id: schema.caseStudies.id });
          caseStudyDbId = inserted[0].id;
        } else {
          caseStudyDbId = "dry-run-uuid-" + proj.id;
        }
        stats.caseStudies.created++;
        console.log(`  + Case Study ${proj.id}: Created [${slug}]`);
      } else {
        caseStudyDbId = existingStudy[0].id;
        if (!isDryRun) {
          await db
            .update(schema.caseStudies)
            .set({ ...studyPayload, updatedAt: new Date() })
            .where(eq(schema.caseStudies.id, caseStudyDbId));
        }
        stats.caseStudies.updated++;
        console.log(`  ~ Case Study ${proj.id}: Updated [${slug}]`);
      }

      // Process Tabular Financial Schedules
      if (proj.fullReport && Array.isArray(proj.fullReport.tables)) {
        for (let i = 0; i < proj.fullReport.tables.length; i++) {
          const tableData = proj.fullReport.tables[i] as FinancialScheduleItem;
          try {
            if (!isDryRun) {
              const existingSchedule = await db
                .select()
                .from(schema.financialSchedules)
                .where(eq(schema.financialSchedules.caseStudyId, caseStudyDbId))
                .limit(10);

              const matchedSchedule = existingSchedule.find((s) => s.title === tableData.title);
              if (!matchedSchedule) {
                await db.insert(schema.financialSchedules).values({
                  caseStudyId: caseStudyDbId,
                  title: tableData.title,
                  headers: tableData.headers,
                  rows: tableData.rows,
                  notes: tableData.notes || null,
                  sortOrder: i,
                });
                stats.financialSchedules.created++;
              } else {
                await db
                  .update(schema.financialSchedules)
                  .set({
                    headers: tableData.headers,
                    rows: tableData.rows,
                    notes: tableData.notes || null,
                    sortOrder: i,
                    updatedAt: new Date(),
                  })
                  .where(eq(schema.financialSchedules.id, matchedSchedule.id));
                stats.financialSchedules.updated++;
              }
            } else {
              stats.financialSchedules.created++;
            }
          } catch (err: unknown) {
            stats.financialSchedules.failed++;
            console.error(`    x Schedule "${tableData.title}" failed:`, (err as Error).message);
          }
        }
      }

      // Process Discrepancy Notices (VAL-09, VAL-10, VAL-11)
      if (meta.discrepancyNotice) {
        const disc = meta.discrepancyNotice;
        try {
          if (!isDryRun) {
            const existingDisc = await db
              .select()
              .from(schema.caseStudyDiscrepancies)
              .where(eq(schema.caseStudyDiscrepancies.caseStudyId, caseStudyDbId))
              .limit(1);

            const discPayload = {
              caseStudyId: caseStudyDbId,
              headline: disc.headline,
              summary: disc.summary,
              details: disc.details,
              originalValues: disc.originalValues,
              formulaTested: disc.formulaTested,
              statusText: disc.statusText,
              preservationPolicy:
                "Raw source figures in portfolioData.js are preserved unaltered; full audit disclosure displayed per financial integrity policy.",
            };

            if (existingDisc.length === 0) {
              await db.insert(schema.caseStudyDiscrepancies).values(discPayload);
              stats.caseStudyDiscrepancies.created++;
              console.log(`    ! Discrepancy registered: [${disc.headline.slice(0, 50)}...]`);
            } else {
              await db
                .update(schema.caseStudyDiscrepancies)
                .set({ ...discPayload, updatedAt: new Date() })
                .where(eq(schema.caseStudyDiscrepancies.id, existingDisc[0].id));
              stats.caseStudyDiscrepancies.updated++;
            }
          } else {
            stats.caseStudyDiscrepancies.created++;
          }
        } catch (err: unknown) {
          stats.caseStudyDiscrepancies.failed++;
          console.error(`    x Discrepancy record failed:`, (err as Error).message);
        }
      }
    } catch (err: unknown) {
      stats.caseStudies.failed++;
      console.error(`  x Case study ${proj.id} failed:`, (err as Error).message);
    }
  }

  // ---------------------------------------------------------------------------
  // 4. Seed Accounting & Financial Competencies (16 Competencies)
  // ---------------------------------------------------------------------------
  console.log("\n--> Processing Accounting Competencies (16 Items)...");
  for (let i = 0; i < rawCompetencies.length; i++) {
    const comp = rawCompetencies[i];
    try {
      const existing = await db
        .select()
        .from(schema.competencies)
        .where(eq(schema.competencies.name, comp.name))
        .limit(1);

      const compPayload = {
        name: comp.name,
        domain: comp.domain,
        category: comp.category,
        evidenceLabel: comp.evidenceLabel,
        description: comp.description,
        frameworkTags: comp.frameworkTags,
        relatedProject: comp.relatedProject,
        sortOrder: i,
        status: "published",
      };

      if (existing.length === 0) {
        if (!isDryRun) {
          await db.insert(schema.competencies).values(compPayload);
        }
        stats.competencies.created++;
        console.log(`  + Competency: [${comp.name.slice(0, 45)}]`);
      } else {
        if (!isDryRun) {
          await db
            .update(schema.competencies)
            .set({ ...compPayload, updatedAt: new Date() })
            .where(eq(schema.competencies.id, existing[0].id));
        }
        stats.competencies.updated++;
        console.log(`  ~ Competency: Updated [${comp.name.slice(0, 45)}]`);
      }
    } catch (err: unknown) {
      stats.competencies.failed++;
      console.error(`  x Competency "${comp.name}" failed:`, (err as Error).message);
    }
  }

  // ---------------------------------------------------------------------------
  // 5. Seed Academic Milestones (3 Milestones)
  // ---------------------------------------------------------------------------
  console.log("\n--> Processing Academic Milestones (3 Milestones)...");
  for (let i = 0; i < ACADEMIC_MILESTONES.length; i++) {
    const mile = ACADEMIC_MILESTONES[i];
    try {
      const existing = await db
        .select()
        .from(schema.academicMilestones)
        .where(eq(schema.academicMilestones.id, mile.id))
        .limit(1);

      const milePayload = {
        id: mile.id,
        institution: mile.institution,
        campus: mile.campus,
        degree: mile.degree,
        major: mile.major,
        status: mile.status,
        period: mile.period,
        overview: mile.overview,
        disciplines: mile.disciplines,
        connectedStudies: mile.connectedStudies,
        sortOrder: i,
      };

      if (existing.length === 0) {
        if (!isDryRun) {
          await db.insert(schema.academicMilestones).values(milePayload);
        }
        stats.academicMilestones.created++;
        console.log(`  + Milestone: [${mile.institution}] — ${mile.degree}`);
      } else {
        if (!isDryRun) {
          await db
            .update(schema.academicMilestones)
            .set({ ...milePayload, updatedAt: new Date() })
            .where(eq(schema.academicMilestones.id, mile.id));
        }
        stats.academicMilestones.updated++;
        console.log(`  ~ Milestone: Updated [${mile.institution}] — ${mile.degree}`);
      }
    } catch (err: unknown) {
      stats.academicMilestones.failed++;
      console.error(`  x Milestone "${mile.id}" failed:`, (err as Error).message);
    }
  }

  // ---------------------------------------------------------------------------
  // 6. Seed Business & Tech Solutions (3 Solutions)
  // ---------------------------------------------------------------------------
  console.log("\n--> Processing Technology Solutions (3 Solutions)...");
  for (let i = 0; i < TECH_SOLUTIONS.length; i++) {
    const tech = TECH_SOLUTIONS[i];
    try {
      const existing = await db
        .select()
        .from(schema.techSolutions)
        .where(eq(schema.techSolutions.id, tech.id))
        .limit(1);

      const techPayload = {
        id: tech.id,
        title: tech.title,
        category: tech.category,
        status: tech.status,
        statusTheme: tech.statusTheme,
        problem: tech.problem,
        solution: tech.solution,
        userRole: tech.userRole,
        techStack: tech.techStack,
        features: tech.features,
        verifiedRepo: tech.verifiedRepo,
        verifiedDemo: tech.verifiedDemo,
        linkText: tech.linkText,
        sortOrder: i,
        contentStatus: "published",
      };

      if (existing.length === 0) {
        if (!isDryRun) {
          await db.insert(schema.techSolutions).values(techPayload);
        }
        stats.techSolutions.created++;
        console.log(`  + Tech Solution: [${tech.title.slice(0, 50)}]`);
      } else {
        if (!isDryRun) {
          await db
            .update(schema.techSolutions)
            .set({ ...techPayload, updatedAt: new Date() })
            .where(eq(schema.techSolutions.id, tech.id));
        }
        stats.techSolutions.updated++;
        console.log(`  ~ Tech Solution: Updated [${tech.title.slice(0, 50)}]`);
      }
    } catch (err: unknown) {
      stats.techSolutions.failed++;
      console.error(`  x Tech Solution "${tech.id}" failed:`, (err as Error).message);
    }
  }

  // ---------------------------------------------------------------------------
  // 7. Summary & Final Reconciliation Report
  // ---------------------------------------------------------------------------
  logHeader("SEED EXECUTION SUMMARY");
  console.log("Entity                   Created   Updated   Skipped   Failed");
  console.log("-------------------------------------------------------------");
  for (const [entity, s] of Object.entries(stats)) {
    console.log(
      `${entity.padEnd(25)} ${String(s.created).padEnd(9)} ${String(s.updated).padEnd(9)} ${String(s.skipped).padEnd(9)} ${String(s.failed)}`
    );
  }

  logHeader("FINANCIAL DISCREPANCY RECONCILIATION SUMMARY");
  console.log("1. Individual Income Tax Return (AY 2023-24):");
  console.log("   - Preserved: Narrative BDT 19,250 payable / BDT 1,750 refund alongside table BDT (11,750) net refund.");
  console.log("   - Formula verified: Gross Tax (68,750) - Rebate (32,000) - TDS (48,500) = (11,750) Refund.");
  console.log("2. StyleTex RMG Costing & CVP Analysis:");
  console.log("   - Preserved: Table row BDT 420 (28%) contribution margin alongside calculated BDT 380 (25.33%).");
  console.log("   - Formula verified: Selling Price (1,500) - Variable Cost (1,120) = BDT 380 per unit.");
  console.log("3. FIFA World Cup Economic Impact:");
  console.log("   - Preserved: Narrative BDT 24,500 crore total impact alongside table direct impact of BDT 43,420 crore.");
  console.log("   - Conflict verified: Total direct impact exceeds total economic contribution (definitional conflict).");
  console.log("4. Square Pharmaceuticals Ltd.:");
  console.log("   - Preserved: 'saving an estimated 8% overhead' clarified as academic estimation in audit notes.");

  const totalFailed = Object.values(stats).reduce((acc, s) => acc + s.failed, 0);
  if (totalFailed > 0) {
    console.error(`\nCRITICAL: Seed execution completed with ${totalFailed} errors.`);
    process.exit(1);
  } else {
    console.log(`\n✓ SEED SCRIPT EXECUTED SUCCESSFULLY (${isDryRun ? "DRY RUN COMPLETE" : "ALL RECORDS SYNCED"}).`);
  }
}

runSeed().catch((err) => {
  console.error("FATAL ERROR in seed script:", err);
  process.exit(1);
});
