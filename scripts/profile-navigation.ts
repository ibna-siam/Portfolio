import { chromium, Browser } from "@playwright/test";

interface TimingRecord {
  scenario: string;
  run: number;
  environment: "live-production" | "local-production";
  clickToVisibleMs: number;
  navigationDurationMs: number;
  requestCount: number;
  totalRequestBytes: number;
  consoleErrors: string[];
  failedRequests: string[];
}

async function profileRouteTransition(
  browser: Browser,
  baseUrl: string,
  env: "live-production" | "local-production",
  scenarioName: string,
  startUrl: string,
  clickSelector: string,
  destinationSelector: string,
  runs: number = 3
): Promise<TimingRecord[]> {
  const records: TimingRecord[] = [];

  for (let run = 1; run <= runs; run++) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();

    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];
    let requestCount = 0;
    let totalRequestBytes = 0;

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    page.on("requestfailed", (req) => {
      failedRequests.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
    });

    // Navigate to start URL
    await page.goto(`${baseUrl}${startUrl}`, { waitUntil: "networkidle" });

    // Wait a beat so initial load settles
    await page.waitForTimeout(500);

    // Track requests during the transition
    const requestListener = () => {
      requestCount++;
    };
    const responseListener = async (res: {
      headers: () => Record<string, string>;
      body: () => Promise<Buffer>;
    }) => {
      try {
        const cl = res.headers()["content-length"];
        if (cl) {
          totalRequestBytes += parseInt(cl, 10);
        }
      } catch (_e) {
        void _e;
      }
    };

    page.on("request", requestListener);
    page.on("response", responseListener);

    // Measure click to destination visible
    const clickTarget = page.locator(clickSelector).first();
    await clickTarget.waitFor({ state: "visible" });

    const startTime = performance.now();
    await clickTarget.click();

    // Wait for the unique destination element to become visible
    const destTarget = page.locator(destinationSelector).first();
    await destTarget.waitFor({ state: "visible", timeout: 15000 });
    const endTime = performance.now();

    const clickToVisibleMs = Math.round(endTime - startTime);

    // Wait for network to settle
    await page.waitForLoadState("networkidle");
    const navigationDurationMs = Math.round(performance.now() - startTime);

    records.push({
      scenario: scenarioName,
      run,
      environment: env,
      clickToVisibleMs,
      navigationDurationMs,
      requestCount,
      totalRequestBytes,
      consoleErrors,
      failedRequests,
    });

    await context.close();
  }

  return records;
}

export async function runNavigationProfiling(
  targetEnv: "live" | "local" | "both" = "both"
) {
  console.log(
    "========================================================================="
  );
  console.log("  PHASE 12.1 EVIDENCE-BASED NAVIGATION PERFORMANCE PROFILER");
  console.log(
    "=========================================================================\n"
  );

  const browser = await chromium.launch({ headless: true });
  const allRecords: TimingRecord[] = [];

  const scenarios = [
    {
      name: "Homepage -> Catalog (Nav 'Case Studies')",
      startUrl: "/",
      clickSelector: "header nav a[href='/case-studies']",
      destinationSelector: "h1:has-text('Case Studies')",
    },
    {
      name: "Homepage -> Detail (Click first case study card)",
      startUrl: "/",
      clickSelector: "section#case-studies article a[href*='/case-studies/']",
      destinationSelector: "header h1, h1",
    },
    {
      name: "Catalog -> Detail (Click first case study card)",
      startUrl: "/case-studies",
      clickSelector: "article a[href*='/case-studies/']",
      destinationSelector: "header h1, h1",
    },
    {
      name: "Detail -> Catalog (Breadcrumb 'Case Studies')",
      startUrl: "/case-studies/square-pharmaceuticals-financial-analysis",
      clickSelector: "nav[aria-label='Breadcrumb'] a[href='/case-studies']",
      destinationSelector: "h1:has-text('Case Studies')",
    },
    {
      name: "Detail -> Homepage (Breadcrumb 'Home')",
      startUrl: "/case-studies/square-pharmaceuticals-financial-analysis",
      clickSelector: "nav[aria-label='Breadcrumb'] a[href='/']",
      destinationSelector: "section#hero, h1:has-text('Md Ibna Siam')",
    },
  ];

  if (targetEnv === "live" || targetEnv === "both") {
    console.log(
      "--> Testing LIVE PRODUCTION Deployment (https://ibnasiam.vercel.app)...\n"
    );
    for (const sc of scenarios) {
      process.stdout.write(`Profiling: ${sc.name} (Live)... `);
      try {
        const records = await profileRouteTransition(
          browser,
          "https://ibnasiam.vercel.app",
          "live-production",
          sc.name,
          sc.startUrl,
          sc.clickSelector,
          sc.destinationSelector,
          3
        );
        allRecords.push(...records);
        const cold = records[0].clickToVisibleMs;
        const warmAvg = Math.round(
          (records[1].clickToVisibleMs + records[2].clickToVisibleMs) / 2
        );
        console.log(`Cold: ${cold}ms | Warm Avg: ${warmAvg}ms`);
      } catch (err: unknown) {
        console.log(`FAILED: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    console.log("");
  }

  if (targetEnv === "local" || targetEnv === "both") {
    console.log("--> Testing LOCAL PRODUCTION Build (http://localhost:3000)...\n");
    for (const sc of scenarios) {
      process.stdout.write(`Profiling: ${sc.name} (Local)... `);
      try {
        const records = await profileRouteTransition(
          browser,
          "http://localhost:3000",
          "local-production",
          sc.name,
          sc.startUrl,
          sc.clickSelector,
          sc.destinationSelector,
          3
        );
        allRecords.push(...records);
        const cold = records[0].clickToVisibleMs;
        const warmAvg = Math.round(
          (records[1].clickToVisibleMs + records[2].clickToVisibleMs) / 2
        );
        console.log(`Cold: ${cold}ms | Warm Avg: ${warmAvg}ms`);
      } catch (err: unknown) {
        console.log(`FAILED: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    console.log("");
  }

  await browser.close();

  // Print Summary Table
  console.log(
    "-------------------------------------------------------------------------------------------------------------------"
  );
  console.log(
    "Scenario".padEnd(50) +
      "Env".padEnd(18) +
      "Run 1 (Cold)".padStart(14) +
      "Run 2 (Warm)".padStart(14) +
      "Run 3 (Warm)".padStart(14) +
      "Warm Avg".padStart(12)
  );
  console.log(
    "-------------------------------------------------------------------------------------------------------------------"
  );

  const grouped = new Map<string, TimingRecord[]>();
  for (const r of allRecords) {
    const key = `${r.scenario}::${r.environment}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(r);
  }

  for (const [key, records] of grouped) {
    const [scenario, env] = key.split("::");
    const r1 = records[0]?.clickToVisibleMs ?? 0;
    const r2 = records[1]?.clickToVisibleMs ?? 0;
    const r3 = records[2]?.clickToVisibleMs ?? 0;
    const warmAvg = Math.round((r2 + r3) / 2);

    console.log(
      scenario.padEnd(50) +
        env.padEnd(18) +
        `${r1}ms`.padStart(14) +
        `${r2}ms`.padStart(14) +
        `${r3}ms`.padStart(14) +
        `${warmAvg}ms`.padStart(12)
    );
  }
  console.log(
    "-------------------------------------------------------------------------------------------------------------------\n"
  );

  return allRecords;
}

if (process.argv[1]?.endsWith("profile-navigation.ts")) {
  const envArg = process.argv.includes("--live-only")
    ? "live"
    : process.argv.includes("--local-only")
      ? "local"
      : "both";
  runNavigationProfiling(envArg).catch(console.error);
}
