import { test, expect } from "@playwright/test";

test.describe("Public Portfolio & Executive Claymorphism E2E", () => {
  test("Homepage loads with full executive presentation", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    // Document title and metadata
    await expect(page).toHaveTitle(/Md Ibna Siam/i);

    // Main header / brand
    const brand = page.locator("nav").first();
    await expect(brand).toBeVisible();
    await expect(page.getByText(/Md Ibna Siam/i).first()).toBeVisible();
    await expect(page.getByText(/ACCA Pathway/i).first()).toBeVisible();

    // Hero section
    const heroHeading = page.locator("h1");
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).toContainText(/Accounting & Finance/i);

    // Verify Cloudinary portrait image is rendered
    const portraitImg = page.locator('img[alt*="Md Ibna Siam"]');
    await expect(portraitImg).toBeVisible();

    // Verify sections exist
    await expect(page.locator("#about")).toBeVisible();
    await expect(page.locator("#case-studies")).toBeVisible();
    await expect(page.locator("#competencies")).toBeVisible();
    await expect(page.locator("#academic-journey")).toBeVisible();
    await expect(page.locator("#tech-solutions")).toBeVisible();
    await expect(page.locator("#contact")).toBeVisible();

    // Contact form elements
    await expect(page.locator('form[action*="formspree.io"]')).toBeVisible();

    // Verify zero uncaught fatal console errors
    const fatalErrors = consoleErrors.filter(
      (err) => !err.includes("Download the React DevTools") && !err.includes("favicon")
    );
    expect(fatalErrors).toHaveLength(0);
  });

  test("Theme toggle toggles between light and dark themes", async ({ page }) => {
    await page.goto("/");
    const themeBtn = page.getByRole("button", { name: /switch to/i }).first();
    await expect(themeBtn).toBeVisible();

    // Initial state check
    const initialHtmlClass = await page.locator("html").getAttribute("class");

    // Click theme toggle
    await themeBtn.click();

    // State should flip
    const newHtmlClass = await page.locator("html").getAttribute("class");
    expect(newHtmlClass).not.toBe(initialHtmlClass);
  });

  test("Case studies collection page displays published studies and filter buttons", async ({
    page,
  }) => {
    const response = await page.goto("/case-studies");
    expect(response?.status()).toBe(200);

    await expect(page.locator("h1")).toContainText(/Case Studies/i);

    // Filter tabs exist
    const allTab = page.getByRole("tab", { name: "All Studies" });
    const appliedTab = page.getByRole("tab", { name: "Applied Accounting" });
    const macroTab = page.getByRole("tab", { name: "Macroeconomic Research" });

    await expect(allTab).toBeVisible();
    await expect(appliedTab).toBeVisible();
    await expect(macroTab).toBeVisible();

    // Check published cards
    const cards = page.locator("article");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Active discrepancy badges are displayed on flagged studies
    const discrepancyBadges = page.getByText(/Discrepancy Disclosed/i);
    expect(await discrepancyBadges.count()).toBeGreaterThanOrEqual(1);
  });

  test("Published case study detail page renders narrative, tabular schedule, and disclosure (VAL-09)", async ({
    page,
  }) => {
    const response = await page.goto(
      "/case-studies/individual-income-tax-return-ay2023-24"
    );
    expect(response?.status()).toBe(200);

    // Title and metadata
    await expect(page.locator("h1")).toContainText(/Individual Income Tax Return/i);

    // Discrepancy Notice (VAL-09)
    const discrepancyCard = page.locator('[data-testid="discrepancy-notice"]');
    await expect(discrepancyCard).toBeVisible();
    await expect(discrepancyCard).toContainText(/Calculation Under Review/i);
    await expect(discrepancyCard).toContainText(/11,750/);

    // Tabular financial schedule with .tabular-nums
    const scheduleTable = page.locator("table");
    await expect(scheduleTable.first()).toBeVisible();

    const tabularNumsCells = page.locator(".tabular-nums");
    expect(await tabularNumsCells.count()).toBeGreaterThanOrEqual(1);
  });

  test("StyleTex RMG Costing case study renders contribution margin disclosure (VAL-10)", async ({
    page,
  }) => {
    const response = await page.goto("/case-studies/styletex-rmg-costing-cvp-analysis");
    expect(response?.status()).toBe(200);

    // Discrepancy Notice (VAL-10)
    const discrepancyCard = page.locator('[data-testid="discrepancy-notice"]');
    await expect(discrepancyCard).toBeVisible();
    await expect(discrepancyCard).toContainText(/Contribution Margin/i);
    await expect(discrepancyCard).toContainText(/380/);
  });

  test("FIFA World Cup case study renders macroeconomic impact disclosure (VAL-11)", async ({
    page,
  }) => {
    const response = await page.goto("/case-studies/fifa-world-cup-macroeconomic-impact");
    expect(response?.status()).toBe(200);

    // Discrepancy Notice (VAL-11)
    const discrepancyCard = page.locator('[data-testid="discrepancy-notice"]');
    await expect(discrepancyCard).toBeVisible();
    await expect(discrepancyCard).toContainText(
      /Macroeconomic Data Definition Divergence/i
    );
  });

  test("Square Pharmaceuticals case study frames 8% overhead saving as academic proposal (VAL-08)", async ({
    page,
  }) => {
    const response = await page.goto(
      "/case-studies/square-pharmaceuticals-financial-analysis"
    );
    expect(response?.status()).toBe(200);

    const pageContent = await page.content();
    expect(
      pageContent.toLowerCase().includes("academic proposal") ||
        pageContent.toLowerCase().includes("academic estimate")
    ).toBe(true);
  });

  test("Non-existent case study slug returns 404 experience", async ({ page }) => {
    const response = await page.goto("/case-studies/non-existent-case-study-slug-xyz");
    expect(response?.status()).toBe(404);
    await expect(page.getByText(/not found|page not found|404/i).first()).toBeVisible();
  });

  test("All external links have rel='noopener noreferrer'", async ({ page }) => {
    await page.goto("/");
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const rel = await externalLinks.nth(i).getAttribute("rel");
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
    }
  });
});
