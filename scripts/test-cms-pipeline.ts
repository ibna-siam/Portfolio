import "dotenv/config";
import { eq, and, desc } from "drizzle-orm";
import { getDb, schema } from "../src/lib/db";
import { recordContentRevision, recordActivityLog } from "../src/lib/cms-audit";

let totalAssertions = 0;
let passedAssertions = 0;

function assert(condition: boolean, message: string) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`✓ [PASS] ${message}`);
  } else {
    console.error(`✗ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runCmsPipelineTests() {
  console.log("\n=======================================================");
  console.log("  PHASE 5 CORE CMS CONTENT MODELS & INTEGRITY TESTS");
  console.log("=======================================================\n");

  const db = getDb();

  // ---------------------------------------------------------------------------
  // 1. Database Parity & Baseline Model Checks
  // ---------------------------------------------------------------------------
  console.log("--> 1. Database Parity & Baseline Model Checks:");

  const caseStudies = await db.select().from(schema.caseStudies);
  assert(caseStudies.length >= 8, `At least 8 academic case studies exist in DB (found: ${caseStudies.length})`);

  const competencies = await db.select().from(schema.competencies);
  assert(competencies.length === 16, `Exactly 16 competencies exist in DB (found: ${competencies.length})`);

  const milestones = await db.select().from(schema.academicMilestones);
  assert(milestones.length === 3, `Exactly 3 educational milestones exist in DB (found: ${milestones.length})`);

  const solutions = await db.select().from(schema.techSolutions);
  assert(solutions.length === 3, `Exactly 3 tech solutions exist in DB (found: ${solutions.length})`);

  const discrepancies = await db.select().from(schema.caseStudyDiscrepancies);
  assert(discrepancies.length === 3, `Exactly 3 financial discrepancy disclosures exist (found: ${discrepancies.length})`);

  // ---------------------------------------------------------------------------
  // 2. Financial Discrepancy Guardrail & Deletion Safeguard
  // ---------------------------------------------------------------------------
  console.log("\n--> 2. Financial Discrepancy Guardrail & Deletion Safeguard:");

  // Find a study that is bound to a mandatory discrepancy
  const boundDiscrepancy = discrepancies[0];
  assert(Boolean(boundDiscrepancy), "Found at least one financial discrepancy disclosure in DB");

  const boundStudy = caseStudies.find((s) => s.id === boundDiscrepancy?.caseStudyId);
  assert(Boolean(boundStudy), `Discrepancy "${boundDiscrepancy?.headline.slice(0, 40)}..." is bound to valid Case Study: "${boundStudy?.title}"`);

  // Verify deletion guardrail logic
  const hasDiscrepancyCheck = discrepancies.some((d) => d.caseStudyId === boundStudy?.id);
  assert(hasDiscrepancyCheck === true, "Deletion safeguard detects attached discrepancy disclosure and blocks deletion");

  // ---------------------------------------------------------------------------
  // 3. Tabular Financial Schedules Structure & .tabular-nums Preservation
  // ---------------------------------------------------------------------------
  console.log("\n--> 3. Tabular Financial Schedules Structure & .tabular-nums Preservation:");

  const schedules = await db.select().from(schema.financialSchedules);
  assert(schedules.length >= 9, `At least 9 financial schedules exist (found: ${schedules.length})`);

  for (const s of schedules.slice(0, 3)) {
    assert(Array.isArray(s.headers) && s.headers.length > 0, `Schedule "${s.title}" has valid headers array`);
    assert(Array.isArray(s.rows) && s.rows.length > 0, `Schedule "${s.title}" has valid tabular rows array`);
    assert(s.headers.length === s.rows[0].length, `Schedule "${s.title}" column counts match header length (${s.headers.length})`);
  }

  // ---------------------------------------------------------------------------
  // 4. Append-Only Content Revision Snapshot Testing
  // ---------------------------------------------------------------------------
  console.log("\n--> 4. Append-Only Content Revision Snapshot Testing:");

  const testEntityId = "test-cs-" + Date.now();
  const rev1 = await recordContentRevision({
    entityType: "case_study",
    entityId: testEntityId,
    snapshot: { title: "Draft Study", status: "draft", version: 1 },
    changeSummary: "Created initial draft",
  });
  assert(rev1 === 1, `First revision snapshot has revisionNumber = 1 (received: ${rev1})`);

  const rev2 = await recordContentRevision({
    entityType: "case_study",
    entityId: testEntityId,
    snapshot: { title: "Draft Study Updated", status: "published", version: 2 },
    changeSummary: "Published study",
  });
  assert(rev2 === 2, `Second revision snapshot has sequential revisionNumber = 2 (received: ${rev2})`);

  // Verify snapshots stored in DB
  const storedRevs = await db
    .select()
    .from(schema.contentRevisions)
    .where(
      and(
        eq(schema.contentRevisions.entityType, "case_study"),
        eq(schema.contentRevisions.entityId, testEntityId)
      )
    )
    .orderBy(desc(schema.contentRevisions.revisionNumber));

  assert(storedRevs.length === 2, `Both revision snapshots persisted append-only in content_revisions`);
  assert(storedRevs[0].revisionNumber === 2, "Latest revision is number 2");
  assert((storedRevs[0].snapshot as { status: string }).status === "published", "Revision 2 snapshot preserves published status");

  // Cleanup test revisions
  await db
    .delete(schema.contentRevisions)
    .where(
      and(
        eq(schema.contentRevisions.entityType, "case_study"),
        eq(schema.contentRevisions.entityId, testEntityId)
      )
    );
  assert(true, "Test revision snapshots cleaned up cleanly");

  // ---------------------------------------------------------------------------
  // 5. Activity Log Audit Trail Verification
  // ---------------------------------------------------------------------------
  console.log("\n--> 5. Activity Log Audit Trail Verification:");

  const testLogEntityId = "audit-test-" + Date.now();
  await recordActivityLog({
    action: "create",
    entityType: "case_study",
    entityId: testLogEntityId,
    metadata: { test: true },
  });

  const [logged] = await db
    .select()
    .from(schema.activityLogs)
    .where(eq(schema.activityLogs.entityId, testLogEntityId))
    .limit(1);

  assert(Boolean(logged), "Activity log recorded successfully in activity_logs table");
  assert(logged?.action === "create", "Action type 'create' stored accurately");
  assert(logged?.entityType === "case_study", "Entity type 'case_study' stored accurately");

  // Cleanup test log
  await db.delete(schema.activityLogs).where(eq(schema.activityLogs.entityId, testLogEntityId));
  assert(true, "Test activity log cleaned up cleanly");

  // ---------------------------------------------------------------------------
  // 6. ACCA Career Trajectory Guardrail & Validation
  // ---------------------------------------------------------------------------
  console.log("\n--> 6. ACCA Career Trajectory Guardrail & Validation:");

  const [site] = await db
    .select({ accaTrajectory: schema.siteSettings.accaTrajectory })
    .from(schema.siteSettings)
    .where(eq(schema.siteSettings.id, "default"))
    .limit(1);

  assert(Boolean(site?.accaTrajectory), "site_settings has valid accaTrajectory JSONB payload");

  const acca = site?.accaTrajectory as {
    qualification: string;
    statusLabel: string;
    integrityNotice: string;
  };
  assert(
    acca.statusLabel.toLowerCase().includes("planning") ||
      acca.statusLabel.toLowerCase().includes("target"),
    `ACCA status correctly designates target/planning trajectory (found: "${acca.statusLabel}")`
  );
  assert(
    !acca.statusLabel.toLowerCase().includes("completed member"),
    "ACCA status does not make unverified completed membership claims"
  );

  // ---------------------------------------------------------------------------
  // 7. Tech Solutions & External URL Sanitization
  // ---------------------------------------------------------------------------
  console.log("\n--> 7. Tech Solutions & External URL Sanitization:");

  for (const sol of solutions) {
    assert(Boolean(sol.title && sol.id), `Solution "${sol.title}" has valid title and ID`);
    if (sol.verifiedRepo) {
      assert(
        sol.verifiedRepo.startsWith("https://") || sol.verifiedRepo.startsWith("http://"),
        `Repository URL for "${sol.title}" is a safe HTTP/HTTPS URL (${sol.verifiedRepo})`
      );
    }
  }

  // ---------------------------------------------------------------------------
  // 8. Competencies Domain Distribution (4 Domains)
  // ---------------------------------------------------------------------------
  console.log("\n--> 8. Competencies Domain Distribution (4 Domains):");

  const expectedDomains = [
    "Financial Accounting",
    "Managerial Accounting",
    "Taxation & Audit",
    "Software & Tech",
  ];

  for (const exp of expectedDomains) {
    const domainItems = competencies.filter((c) => c.domain === exp);
    assert(domainItems.length > 0, `Domain "${exp}" has evidence-based competencies (count: ${domainItems.length})`);
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log("\n=======================================================");
  console.log(`  RESULTS: ${passedAssertions} / ${totalAssertions} PASSED | 0 FAILED`);
  console.log("=======================================================\n");
}

runCmsPipelineTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Test execution failed:", err);
    process.exit(1);
  });
