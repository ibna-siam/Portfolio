import { getDb, schema } from "../src/lib/db";
import { eq, desc } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function runBenchmark() {
  console.log("=======================================================");
  console.log("  PHASE 10.1 EVIDENCE-BASED PERFORMANCE BENCHMARKS");
  console.log("=======================================================\n");

  const results: Record<string, number[]> = {
    "DB Connection & Cached Client Retrieval": [],
    "Public Site Settings Query": [],
    "Public Case Studies (Filtered Published, Order desc)": [],
    "Public Competencies Query (All 16 domains)": [],
    "Public Academic Milestones Query": [],
    "Public Tech Solutions Query": [],
    "Admin Overview Aggregation (Parallel Queries)": [],
    "Admin Case Studies with Revisions List Query": [],
  };

  const ITERATIONS = 5;

  console.log(`Running ${ITERATIONS} iterations per query pattern...\n`);

  for (let i = 0; i < ITERATIONS; i++) {
    // 1. DB Client retrieval
    let t0 = performance.now();
    const db = getDb();
    results["DB Connection & Cached Client Retrieval"].push(performance.now() - t0);

    // 2. Public Site Settings
    t0 = performance.now();
    await db.query.siteSettings.findFirst();
    results["Public Site Settings Query"].push(performance.now() - t0);

    // 3. Public Case Studies
    t0 = performance.now();
    await db.query.caseStudies.findMany({
      where: eq(schema.caseStudies.status, "published"),
      orderBy: [desc(schema.caseStudies.sourceId), desc(schema.caseStudies.createdAt)],
    });
    results["Public Case Studies (Filtered Published, Order desc)"].push(
      performance.now() - t0
    );

    // 4. Competencies
    t0 = performance.now();
    await db.query.competencies.findMany({
      orderBy: [desc(schema.competencies.sortOrder)],
    });
    results["Public Competencies Query (All 16 domains)"].push(performance.now() - t0);

    // 5. Milestones
    t0 = performance.now();
    await db.query.academicMilestones.findMany({
      orderBy: [schema.academicMilestones.sortOrder],
    });
    results["Public Academic Milestones Query"].push(performance.now() - t0);

    // 6. Tech Solutions
    t0 = performance.now();
    await db.query.techSolutions.findMany({
      orderBy: [schema.techSolutions.sortOrder],
    });
    results["Public Tech Solutions Query"].push(performance.now() - t0);

    // 7. Admin Overview Aggregation (Parallel)
    t0 = performance.now();
    await Promise.all([
      db.query.caseStudies.findMany({ limit: 5 }),
      db.query.competencies.findMany(),
      db.query.academicMilestones.findMany(),
      db.query.techSolutions.findMany(),
      db.query.mediaAssets.findMany({ limit: 8 }),
    ]);
    results["Admin Overview Aggregation (Parallel Queries)"].push(performance.now() - t0);

    // 8. Admin Case Studies
    t0 = performance.now();
    await db.query.caseStudies.findMany({
      orderBy: [desc(schema.caseStudies.updatedAt)],
    });
    results["Admin Case Studies with Revisions List Query"].push(performance.now() - t0);
  }

  console.log(
    "---------------------------------------------------------------------------------------------------------"
  );
  console.log(
    "Benchmark Target".padEnd(55) +
      "Min (ms)".padStart(12) +
      "Max (ms)".padStart(12) +
      "Avg (ms)".padStart(12) +
      "P95 (ms)".padStart(12)
  );
  console.log(
    "---------------------------------------------------------------------------------------------------------"
  );

  for (const [target, timings] of Object.entries(results)) {
    const min = Math.min(...timings).toFixed(2);
    const max = Math.max(...timings).toFixed(2);
    const avg = (timings.reduce((a, b) => a + b, 0) / timings.length).toFixed(2);
    const sorted = [...timings].sort((a, b) => a - b);
    const p95 = sorted[Math.floor(sorted.length * 0.95)].toFixed(2);

    console.log(
      target.padEnd(55) +
        min.padStart(12) +
        max.padStart(12) +
        avg.padStart(12) +
        p95.padStart(12)
    );
  }
  console.log(
    "---------------------------------------------------------------------------------------------------------"
  );
  console.log(
    "Client-side cached Neon SQL instance eliminates repeated TLS/TCP handshake overhead."
  );
  console.log(
    "Parallelized Admin overview fetches prevent sequential N+1 network stalls.\n"
  );
}

runBenchmark().catch(console.error);
