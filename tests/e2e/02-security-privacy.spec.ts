import { test, expect } from "@playwright/test";

test.describe("Security, Privacy & Authorization Boundaries E2E", () => {
  const SENSITIVE_PHONE_PATTERNS = [
    "+880 1841-380687",
    "+8801841380687",
    "01841-380687",
    "01841380687",
    "1841-380687",
    "1841380687",
  ];

  test("Privacy Guardrail VAL-07: Private phone number is strictly absent from Homepage DOM and payloads", async ({
    page,
  }) => {
    await page.goto("/");
    const content = await page.content();

    for (const pattern of SENSITIVE_PHONE_PATTERNS) {
      expect(content).not.toContain(pattern);
    }
  });

  test("Privacy Guardrail VAL-07: Private phone number is strictly absent from Case Studies collection", async ({
    page,
  }) => {
    await page.goto("/case-studies");
    const content = await page.content();

    for (const pattern of SENSITIVE_PHONE_PATTERNS) {
      expect(content).not.toContain(pattern);
    }
  });

  test("Privacy Guardrail VAL-07: Private phone number is strictly absent from Case Study detail page", async ({
    page,
  }) => {
    await page.goto("/case-studies/individual-income-tax-return-ay2023-24");
    const content = await page.content();

    for (const pattern of SENSITIVE_PHONE_PATTERNS) {
      expect(content).not.toContain(pattern);
    }
  });

  test("Secret Confidentiality: Server environment secrets are never rendered in public HTML or scripts", async ({
    page,
  }) => {
    await page.goto("/");
    const content = await page.content();

    // Check for sensitive database strings or internal secrets
    expect(content).not.toContain("neondb_owner");
    expect(content).not.toContain("ep-fancy-bar");
    expect(content).not.toContain("npg_yk54ncGDwxLE");
    expect(content).not.toContain("CLOUDINARY_API_SECRET");
    expect(content).not.toContain("AUTH_SECRET");
  });

  test("Protected Admin Boundary: Unauthenticated visits to /admin redirect to /admin/login", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.locator("h1")).toContainText(/Executive Console/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("Protected Admin Boundary: Unauthenticated visits to submodules redirect to /admin/login", async ({
    page,
  }) => {
    const modules = [
      "/admin/case-studies",
      "/admin/competencies",
      "/admin/academic-journey",
      "/admin/tech-solutions",
      "/admin/media",
    ];

    for (const mod of modules) {
      await page.goto(mod);
      await expect(page).toHaveURL(/\/admin\/login/);
    }
  });

  test("Draft Mode Boundary: Unauthenticated requests to /api/draft/enable are rejected", async ({
    request,
  }) => {
    const response = await request.get("/api/draft/enable?redirect=/case-studies");
    // Should be unauthorized (401) or redirected to login (302/307)
    expect([401, 302, 307]).toContain(response.status());
  });

  test("Draft Mode Open-Redirect Protection: Rejects external URLs and protocol-relative targets", async ({
    request,
  }) => {
    const maliciousTargets = [
      "https://evil.com",
      "http://attacker.com",
      "//evil.com/hack",
      "/\\attacker.com",
      "javascript:alert(1)",
    ];

    for (const target of maliciousTargets) {
      const response = await request.get(`/api/draft/enable?redirect=${encodeURIComponent(target)}`);
      // Must not redirect to the evil domain; should be rejected or redirected to login
      const location = response.headers()["location"] || "";
      expect(location).not.toContain("evil.com");
      expect(location).not.toContain("attacker.com");
    }
  });

  test("Draft Mode Disable: /api/draft/disable executes cleanly", async ({ request }) => {
    const response = await request.get("/api/draft/disable", { maxRedirects: 0 });
    // Returns 307 redirect to /
    expect([302, 307]).toContain(response.status());
    expect(response.headers()["location"]).toMatch(/\/$/);
  });
});
