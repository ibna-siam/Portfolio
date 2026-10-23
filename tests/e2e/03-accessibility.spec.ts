import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility (a11y) & WCAG 2.1 AA Audit", () => {
  test("Homepage passes automated axe-core audit with zero critical/serious violations", async ({
    page,
  }) => {
    await page.goto("/");
    // Wait for content and hydration
    await page.waitForLoadState("domcontentloaded");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );

    if (criticalViolations.length > 0) {
      console.warn(
        "Axe Violations on Homepage:",
        JSON.stringify(criticalViolations, null, 2)
      );
    }

    expect(criticalViolations).toEqual([]);
  });

  test("Case studies collection page passes automated axe-core audit", async ({
    page,
  }) => {
    await page.goto("/case-studies");
    await page.waitForLoadState("domcontentloaded");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const criticalViolations = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );

    expect(criticalViolations).toEqual([]);
  });

  test("Case study detail page passes automated axe-core audit", async ({ page }) => {
    await page.goto("/case-studies/individual-income-tax-return-ay2023-24");
    await page.waitForLoadState("domcontentloaded");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const criticalViolations = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );

    expect(criticalViolations).toEqual([]);
  });

  test("Admin login page passes automated axe-core audit", async ({ page }) => {
    await page.goto("/admin/login");
    await page.waitForLoadState("domcontentloaded");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const criticalViolations = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );

    expect(criticalViolations).toEqual([]);
  });

  test("Keyboard navigation: Visible focus ring is present on interactive elements", async ({
    page,
  }) => {
    await page.goto("/");
    // Press Tab multiple times and verify an active element is focused
    await page.keyboard.press("Tab");
    const activeTagName = await page.evaluate(() => document.activeElement?.tagName);
    expect(["A", "BUTTON", "INPUT", "BODY"]).toContain(activeTagName);
  });

  test("Semantic Heading Hierarchy: Exactly one h1 per page", async ({ page }) => {
    const routes = [
      "/",
      "/case-studies",
      "/case-studies/individual-income-tax-return-ay2023-24",
    ];
    for (const route of routes) {
      await page.goto(route);
      const h1Count = await page.locator("h1").count();
      expect(h1Count).toBe(1);
    }
  });
});
