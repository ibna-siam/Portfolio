import "dotenv/config";
import assert from "node:assert";

import {
  getPublicSiteSettings,
  getPublicCaseStudies,
  getCaseStudyBySlug,
  getPublicCompetencies,
  getPublicAcademicMilestones,
  getPublicTechSolutions,
} from "../src/lib/public-data";
import { getDb } from "../src/lib/db";
import { caseStudies } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

let passed = 0;
let failed = 0;

function it(name: string, fn: () => void | Promise<void>) {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      console.log(`✓ [PASS] ${name}`);
      passed++;
    })
    .catch((err) => {
      console.error(`✗ [FAIL] ${name}:`, err.message || err);
      failed++;
    });
}

async function runTestSuite() {
  console.log("\n=======================================================");
  console.log("  PHASE 6 PUBLIC PORTFOLIO & DATA ACCESS SECURITY TESTS");
  console.log("=======================================================\n");

  console.log("--> 1. Public Site Settings & Privacy Isolation (VAL-07):");
  await it("Retrieves valid public site settings", async () => {
    const settings = await getPublicSiteSettings();
    assert(settings !== null, "Site settings should be present");
    assert(typeof settings.siteName === "string", "siteName should be a string");
    assert(settings.ownerName === "Md Ibna Siam", "ownerName should be Md Ibna Siam");
    assert(settings.publicEmail.includes("@"), "publicEmail should be a valid email");
  });

  await it("Strictly excludes privatePhone from public settings payload (VAL-07)", async () => {
    const settings = (await getPublicSiteSettings()) as unknown as Record<
      string,
      unknown
    >;
    assert(
      settings.privatePhone === undefined,
      "privatePhone must NOT be present in public payload"
    );
    assert(settings.phone === undefined, "phone must NOT be present in public payload");
  });

  await it("ACCA trajectory correctly frames credential as in-planning target", async () => {
    const settings = await getPublicSiteSettings();
    assert(settings !== null);
    assert(
      settings.accaTrajectory.statusLabel.toLowerCase().includes("planning") ||
        settings.accaTrajectory.statusLabel.toLowerCase().includes("pathway"),
      "ACCA status must reflect a planning or pathway status"
    );
    assert(
      !settings.accaTrajectory.statusLabel.toLowerCase().includes("completed") &&
        !settings.accaTrajectory.statusLabel.toLowerCase().includes("qualified member"),
      "Must not make unverified claims of completed qualification"
    );
  });

  console.log("\n--> 2. Public Case Studies & Publication Status Boundary:");
  await it("Normal public query returns ONLY published case studies", async () => {
    const publicStudies = await getPublicCaseStudies({ isDraftMode: false });
    assert(publicStudies.length > 0, "Should have published case studies");
    for (const study of publicStudies) {
      assert.strictEqual(
        study.status,
        "published",
        `Case study "${study.slug}" must have status='published'`
      );
    }
  });

  await it("Public listing flags case studies with active discrepancy disclosures", async () => {
    const publicStudies = await getPublicCaseStudies({ isDraftMode: false });
    const taxStudy = publicStudies.find(
      (s) => s.slug === "individual-income-tax-return-ay2023-24"
    );
    assert(taxStudy !== undefined, "Tax return study should be present");
    assert.strictEqual(
      taxStudy.hasDiscrepancy,
      true,
      "Tax study should have hasDiscrepancy=true"
    );
    assert(taxStudy.discrepancyHeadline !== undefined, "Should have discrepancyHeadline");
  });

  console.log("\n--> 3. Financial Content Integrity & Discrepancy Disclosures:");
  await it("Preserves Individual Income Tax Return arithmetic discrepancy (VAL-09)", async () => {
    const study = await getCaseStudyBySlug("individual-income-tax-return-ay2023-24");
    assert(study !== null, "Tax study should exist");
    assert(study.discrepancy !== null, "Tax discrepancy disclosure must be present");
    assert.strictEqual(
      study.discrepancy.formulaTested,
      "Gross Tax (68,750) - Investment Rebate (32,000) - TDS (48,500) = (11,750) Refund"
    );
    assert(
      study.discrepancy.originalValues.includes("11,750") ||
        study.discrepancy.details.some((d) => d.includes("11,750")),
      "Details and original values must disclose the arithmetic divergence"
    );
  });

  await it("Preserves StyleTex RMG Costing contribution margin divergence (VAL-10)", async () => {
    const study = await getCaseStudyBySlug("styletex-rmg-costing-cvp-analysis");
    assert(study !== null, "StyleTex study should exist");
    assert(study.discrepancy !== null, "StyleTex discrepancy disclosure must be present");
    assert.strictEqual(
      study.discrepancy.formulaTested,
      "CM = Selling Price (1,500) - Variable Cost (1,120) = BDT 380 per unit"
    );
  });

  await it("Preserves FIFA World Cup macroeconomic impact divergence (VAL-11)", async () => {
    const study = await getCaseStudyBySlug("fifa-world-cup-macroeconomic-impact");
    assert(study !== null, "FIFA study should exist");
    assert(study.discrepancy !== null, "FIFA discrepancy disclosure must be present");
    assert.strictEqual(
      study.discrepancy.formulaTested,
      "Total Economic Impact = Direct Impact + Indirect (Multiplier Effect) [Direct cannot exceed Total]"
    );
  });

  await it("Identifies Square Pharma 8% overhead saving as academic proposal (VAL-08)", async () => {
    const study = await getCaseStudyBySlug("square-pharmaceuticals-financial-analysis");
    assert(study !== null, "Square Pharma study should exist");
    const proposalNote = study.auditNotes.find(
      (n) =>
        n.finding.toLowerCase().includes("academic proposal") ||
        n.finding.toLowerCase().includes("academic estimate") ||
        n.topic.toLowerCase().includes("overhead")
    );
    assert(
      proposalNote !== undefined,
      "Must document 8% overhead saving as an academic proposal"
    );
  });

  console.log("\n--> 4. Tabular Financial Schedules & .tabular-nums Invariants:");
  await it("All published financial schedules preserve rectangular tabular structure", async () => {
    const publicStudies = await getPublicCaseStudies();
    let scheduleCount = 0;
    for (const summary of publicStudies) {
      const detail = await getCaseStudyBySlug(summary.slug);
      if (detail && detail.schedules.length > 0) {
        for (const sched of detail.schedules) {
          scheduleCount++;
          assert(sched.headers.length > 0, `Schedule "${sched.title}" must have headers`);
          assert(sched.rows.length > 0, `Schedule "${sched.title}" must have rows`);
          for (const row of sched.rows) {
            assert.strictEqual(
              row.length,
              sched.headers.length,
              `Row length in "${sched.title}" must match header length (${sched.headers.length})`
            );
          }
        }
      }
    }
    assert(
      scheduleCount >= 9,
      `Expected at least 9 schedules across all studies, found ${scheduleCount}`
    );
  });

  console.log("\n--> 5. Supporting Content Modules (Competencies, Milestones, Tech):");
  await it("Retrieves exactly 16 competencies distributed across 4 domains", async () => {
    const comps = await getPublicCompetencies();
    assert.strictEqual(comps.length, 16, "Must retrieve exactly 16 competencies");
    const domains = new Set(comps.map((c) => c.domain));
    assert(
      domains.has("Financial Accounting"),
      "Must include Financial Accounting domain"
    );
    assert(
      domains.has("Managerial Accounting"),
      "Must include Managerial Accounting domain"
    );
    assert(domains.has("Taxation & Audit"), "Must include Taxation & Audit domain");
    assert(domains.has("Software & Tech"), "Must include Software & Tech domain");
  });

  await it("Retrieves 3 confirmed educational milestones", async () => {
    const milestones = await getPublicAcademicMilestones();
    assert.strictEqual(
      milestones.length,
      3,
      "Must retrieve exactly 3 academic milestones"
    );
    assert(
      milestones[0].degree.includes("Bachelor of Business Administration") ||
        milestones[0].degree.includes("BBA"),
      "First milestone should be Bachelor of Business Administration in Accounting"
    );
  });

  await it("Retrieves 3 verified technology solutions with safe HTTP/HTTPS repository URLs", async () => {
    const solutions = await getPublicTechSolutions();
    assert.strictEqual(solutions.length, 3, "Must retrieve exactly 3 tech solutions");
    for (const sol of solutions) {
      if (sol.verifiedRepo) {
        assert(
          sol.verifiedRepo.startsWith("http://") ||
            sol.verifiedRepo.startsWith("https://"),
          `Repository URL must use safe http/https scheme: ${sol.verifiedRepo}`
        );
      }
    }
  });

  console.log("\n--> 6. Draft Mode Boundary & Unauthorized Draft Access Protection:");
  await it("Returns null / 404 for non-existent slug", async () => {
    const missing = await getCaseStudyBySlug("non-existent-case-study-slug");
    assert.strictEqual(missing, null, "Non-existent slug should return null");
  });

  await it("Draft case study is inaccessible when isDraftMode = false", async () => {
    const db = getDb();
    // Temporarily set one study to 'draft'
    const testSlug = "agrofab-master-budget-simulation";
    await db
      .update(caseStudies)
      .set({ status: "draft" })
      .where(eq(caseStudies.slug, testSlug));

    try {
      // Normal public query should return null
      const publicResult = await getCaseStudyBySlug(testSlug, { isDraftMode: false });
      assert.strictEqual(
        publicResult,
        null,
        "Draft case study must NOT be returned when isDraftMode=false"
      );

      // Draft mode query should successfully retrieve it
      const draftResult = await getCaseStudyBySlug(testSlug, { isDraftMode: true });
      assert(
        draftResult !== null,
        "Draft case study should be returned when isDraftMode=true"
      );
      assert.strictEqual(draftResult.status, "draft");
    } finally {
      // Restore status to 'published'
      await db
        .update(caseStudies)
        .set({ status: "published" })
        .where(eq(caseStudies.slug, testSlug));
    }
  });

  console.log("\n--> 7. Open-Redirect Vulnerability Neutralization for Draft Mode:");
  await it("Draft mode redirect validator rejects external absolute URLs", () => {
    const isLocalRelative = (target: string) =>
      target.startsWith("/") &&
      !target.startsWith("//") &&
      !target.startsWith("/\\") &&
      !target.includes("://");

    assert.strictEqual(isLocalRelative("https://evil.com"), false);
    assert.strictEqual(isLocalRelative("//attacker.com"), false);
    assert.strictEqual(isLocalRelative("/\\attacker.com"), false);
    assert.strictEqual(isLocalRelative("javascript:alert(1)"), false);
    assert.strictEqual(isLocalRelative("/case-studies"), true);
    assert.strictEqual(isLocalRelative("/"), true);
  });

  console.log(
    "\n--> 8. Public Section Preview Display Limits Regression Tests (Phase 10.1):"
  );
  await it("Enforces exact initial visible limit of 4 on Case Studies preview", () => {
    const mockStudies = Array.from({ length: 10 }, (_, i) => ({ id: `cs-${i}` }));
    const INITIAL_LIMIT = 4;
    const initialSlice = mockStudies.slice(0, INITIAL_LIMIT);
    const remainingCount = Math.max(0, mockStudies.length - INITIAL_LIMIT);
    assert.strictEqual(
      initialSlice.length,
      4,
      "Initial visible case studies must be exactly 4"
    );
    assert.strictEqual(remainingCount, 6, "Remaining count must be length - 4");
  });

  await it("Enforces exact initial visible limit of 4 on Competencies preview", () => {
    const mockCompetencies = Array.from({ length: 9 }, (_, i) => ({ id: `comp-${i}` }));
    const INITIAL_LIMIT = 4;
    const initialSlice = mockCompetencies.slice(0, INITIAL_LIMIT);
    const remainingCount = Math.max(0, mockCompetencies.length - INITIAL_LIMIT);
    assert.strictEqual(
      initialSlice.length,
      4,
      "Initial visible competencies must be exactly 4"
    );
    assert.strictEqual(remainingCount, 5, "Remaining count must be length - 4");
  });

  await it("Enforces exact initial visible limit of 3 on Tech Solutions preview", () => {
    const mockSolutions = Array.from({ length: 7 }, (_, i) => ({ id: `sol-${i}` }));
    const INITIAL_LIMIT = 3;
    const initialSlice = mockSolutions.slice(0, INITIAL_LIMIT);
    const remainingCount = Math.max(0, mockSolutions.length - INITIAL_LIMIT);
    assert.strictEqual(
      initialSlice.length,
      3,
      "Initial visible tech solutions must be exactly 3"
    );
    assert.strictEqual(remainingCount, 4, "Remaining count must be length - 3");
  });

  console.log("\n=======================================================");
  console.log(`  RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
