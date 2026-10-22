import { test, expect } from "@playwright/test";

test.describe("Performance & Runtime Validation", () => {
  test("Homepage loads within acceptable lab performance thresholds", async ({ page }) => {
    const failedRequests: string[] = [];
    page.on("requestfailed", (req) => {
      // Ignore external analytics/speed insights or favicon failures
      if (!req.url().includes("vercel-insights") && !req.url().includes("favicon.ico")) {
        failedRequests.push(`${req.method()} ${req.url()}: ${req.failure()?.errorText}`);
      }
    });

    const startTime = Date.now();
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    const loadDuration = Date.now() - startTime;

    expect(response?.status()).toBe(200);

    // Performance timing extraction from browser
    const performanceMetrics = await page.evaluate(() => {
      const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType("paint");
      const fcp = paintEntries.find((entry) => entry.name === "first-contentful-paint")?.startTime || 0;

      return {
        domContentLoaded: navEntry ? navEntry.domContentLoadedEventEnd - navEntry.startTime : 0,
        loadComplete: navEntry ? navEntry.loadEventEnd - navEntry.startTime : 0,
        fcp,
      };
    });

    console.log("--> Lab Performance Metrics (Homepage):", {
      wallClockDurationMs: loadDuration,
      fcpMs: Math.round(performanceMetrics.fcp),
      domContentLoadedMs: Math.round(performanceMetrics.domContentLoaded),
      loadCompleteMs: Math.round(performanceMetrics.loadComplete),
    });

    // In dev mode, compilation adds initial overhead, but domContentLoaded should be reasonable
    expect(performanceMetrics.domContentLoaded).toBeLessThan(10000);
    expect(failedRequests).toHaveLength(0);
  });

  test("Case studies collection loads cleanly with zero asset failures", async ({ page }) => {
    const failedRequests: string[] = [];
    page.on("requestfailed", (req) => {
      if (!req.url().includes("vercel-insights") && !req.url().includes("favicon.ico")) {
        failedRequests.push(`${req.method()} ${req.url()}: ${req.failure()?.errorText}`);
      }
    });

    const response = await page.goto("/case-studies", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    expect(failedRequests).toHaveLength(0);
  });

  test("Case study detail page loads cleanly with zero asset failures", async ({ page }) => {
    const failedRequests: string[] = [];
    page.on("requestfailed", (req) => {
      if (!req.url().includes("vercel-insights") && !req.url().includes("favicon.ico")) {
        failedRequests.push(`${req.method()} ${req.url()}: ${req.failure()?.errorText}`);
      }
    });

    const response = await page.goto(
      "/case-studies/individual-income-tax-return-ay2023-24",
      { waitUntil: "domcontentloaded" }
    );
    expect(response?.status()).toBe(200);
    expect(failedRequests).toHaveLength(0);
  });
});
