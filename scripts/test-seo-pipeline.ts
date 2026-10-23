import "dotenv/config";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import {
  siteConfig,
  getPersonStructuredData,
  getWebSiteStructuredData,
  getArticleStructuredData,
} from "../src/lib/seo-config";
import {
  getPublicSiteSettings,
  getPublicCaseStudies,
  getCaseStudyBySlug,
} from "../src/lib/public-data";
import fs from "fs";
import path from "path";

async function runSeoTests() {
  console.log("=== Phase 11 SEO & Content Quality Pipeline Test ===\n");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Robots.txt Validation
  console.log("\n--- Checking robots.ts rules ---");
  const robotsConfig = robots();
  const rules = Array.isArray(robotsConfig.rules)
    ? robotsConfig.rules[0]
    : robotsConfig.rules;

  assert(rules?.userAgent === "*", "Robots rule targets userAgent '*'");
  assert(
    Array.isArray(rules?.disallow) &&
      rules.disallow.includes("/admin") &&
      rules.disallow.includes("/admin/*") &&
      rules.disallow.includes("/api/*"),
    "Robots strictly disallows /admin, /admin/*, and /api/*"
  );
  assert(
    robotsConfig.sitemap === "https://ibnasiam.vercel.app/sitemap.xml",
    "Robots points to canonical sitemap.xml"
  );

  // 2. Sitemap.xml Validation
  console.log("\n--- Checking sitemap.ts generation ---");
  const sitemapEntries = await sitemap();
  console.log(`Generated ${sitemapEntries.length} sitemap entries.`);

  const homeEntry = sitemapEntries.find((e) => e.url === "https://ibnasiam.vercel.app");
  assert(
    Boolean(homeEntry && homeEntry.priority === 1.0),
    "Sitemap includes root '/' with priority 1.0"
  );

  const catalogEntry = sitemapEntries.find(
    (e) => e.url === "https://ibnasiam.vercel.app/case-studies"
  );
  assert(
    Boolean(catalogEntry && catalogEntry.priority === 0.8),
    "Sitemap includes '/case-studies' with priority 0.8"
  );

  const adminEntries = sitemapEntries.filter((e) => e.url.includes("/admin"));
  assert(adminEntries.length === 0, "Sitemap strictly contains ZERO admin routes");

  const apiEntries = sitemapEntries.filter((e) => e.url.includes("/api"));
  assert(apiEntries.length === 0, "Sitemap strictly contains ZERO api routes");

  const studiesInSitemap = sitemapEntries.filter((e) => e.url.includes("/case-studies/"));
  console.log(`Found ${studiesInSitemap.length} case study entries in sitemap:`);
  studiesInSitemap.forEach((s) =>
    console.log(` - ${s.url} (lastModified: ${s.lastModified})`)
  );
  assert(studiesInSitemap.length >= 8, "Sitemap contains published case studies (>= 8)");

  // 3. Centralized SiteConfig & MetadataBase
  console.log("\n--- Checking Centralized SEO Configuration ---");
  assert(
    siteConfig.url === "https://ibnasiam.vercel.app",
    "siteConfig canonical URL is https://ibnasiam.vercel.app"
  );
  assert(siteConfig.name === "Md Ibna Siam", "siteConfig author name is 'Md Ibna Siam'");
  assert(
    siteConfig.academic.institution === "Daffodil International University",
    "Academic institution is Daffodil International University"
  );
  assert(
    siteConfig.academic.degree === "BBA in Accounting",
    "Degree is BBA in Accounting"
  );
  assert(
    siteConfig.social.linkedin === "https://www.linkedin.com/in/ibnasiam/",
    "LinkedIn points to verified profile"
  );
  assert(
    siteConfig.social.github === "https://github.com/ibna-siam",
    "GitHub points to verified profile"
  );
  assert(
    siteConfig.description.length >= 140 && siteConfig.description.length <= 160,
    `siteConfig description length (${siteConfig.description.length} chars) complies with seo-meta-optimizer SERP rules (140-160 chars)`
  );

  // 4. File-level Static Audit (Layout, Page, Admin)
  console.log("\n--- Checking Static Metadata Declarations ---");
  const rootLayoutCode = fs.readFileSync(
    path.join(process.cwd(), "src/app/layout.tsx"),
    "utf-8"
  );
  assert(
    rootLayoutCode.includes("metadataBase: new URL(siteConfig.url)"),
    "Root layout declares metadataBase"
  );
  assert(
    rootLayoutCode.includes("index: true") && rootLayoutCode.includes("follow: true"),
    "Root layout allows indexing and following"
  );

  const adminLayoutCode = fs.readFileSync(
    path.join(process.cwd(), "src/app/(admin)/layout.tsx"),
    "utf-8"
  );
  assert(
    adminLayoutCode.includes("index: false") && adminLayoutCode.includes("follow: false"),
    "Admin layout blocks indexing and following"
  );
  assert(adminLayoutCode.includes("nocache: true"), "Admin layout specifies nocache");

  const homePageCode = fs.readFileSync(
    path.join(process.cwd(), "src/app/page.tsx"),
    "utf-8"
  );
  assert(homePageCode.includes('canonical: "/"'), "HomePage specifies canonical '/'");
  assert(homePageCode.includes("application/ld+json"), "HomePage injects JSON-LD script");

  const caseStudiesCode = fs.readFileSync(
    path.join(process.cwd(), "src/app/case-studies/page.tsx"),
    "utf-8"
  );
  assert(
    caseStudiesCode.includes('canonical: "/case-studies"'),
    "Case studies collection specifies canonical '/case-studies'"
  );

  const caseStudyDetailCode = fs.readFileSync(
    path.join(process.cwd(), "src/app/case-studies/[slug]/page.tsx"),
    "utf-8"
  );
  assert(
    caseStudyDetailCode.includes("canonical: `/case-studies/${study.slug}`"),
    "Case study detail specifies dynamic canonical URL"
  );
  assert(
    caseStudyDetailCode.includes('type: "article"'),
    "Case study detail specifies OpenGraph article type"
  );

  // 5. Schema.org JSON-LD Generation
  console.log("\n--- Checking Schema.org Structured Data Helpers ---");
  const personLd = getPersonStructuredData({
    linkedin: "https://www.linkedin.com/in/ibnasiam/",
    github: "https://github.com/ibna-siam",
  });
  assert(personLd["@type"] === "Person", "Person schema has @type 'Person'");
  assert(personLd.name === "Md Ibna Siam", "Person schema name is 'Md Ibna Siam'");
  assert(
    personLd.sameAs.includes("https://www.linkedin.com/in/ibnasiam/") &&
      personLd.sameAs.includes("https://github.com/ibna-siam"),
    "Person schema includes verified LinkedIn and GitHub sameAs links"
  );
  assert(
    !JSON.stringify(personLd).includes("phone") &&
      !JSON.stringify(personLd).includes("01"),
    "Person schema contains ZERO phone numbers (VAL-07)"
  );
  assert(
    !JSON.stringify(personLd).includes("Member of ACCA") &&
      !JSON.stringify(personLd).includes("FCCA"),
    "Person schema makes no false claims of completed ACCA qualification"
  );

  const websiteLd = getWebSiteStructuredData();
  assert(websiteLd["@type"] === "WebSite", "WebSite schema has @type 'WebSite'");
  assert(
    websiteLd.url === "https://ibnasiam.vercel.app",
    "WebSite schema URL is canonical"
  );

  const sampleStudy = await getCaseStudyBySlug(
    "square-pharmaceuticals-financial-analysis"
  );
  assert(
    sampleStudy !== null,
    "Found sample case study 'square-pharmaceuticals-financial-analysis'"
  );
  if (sampleStudy) {
    const articleLd = getArticleStructuredData(sampleStudy);
    assert(articleLd["@type"] === "Article", "Article schema has @type 'Article'");
    assert(
      articleLd.headline === sampleStudy.title,
      "Article headline matches case study title"
    );
    assert(
      articleLd.url === `https://ibnasiam.vercel.app/case-studies/${sampleStudy.slug}`,
      "Article URL matches canonical case study URL"
    );
    assert(
      (articleLd.author as { name: string }).name === "Md Ibna Siam",
      "Article author is 'Md Ibna Siam'"
    );
  }

  // 6. VAL-07 Privacy & Public Data Integrity
  console.log("\n--- Checking VAL-07 Phone Privacy & Public Data ---");
  const settings = await getPublicSiteSettings();
  assert(settings !== null, "Public site settings retrieved successfully");
  assert(
    !("privatePhone" in (settings as unknown as Record<string, unknown>)),
    "Strict VAL-07: privatePhone is NOT present in PublicSiteSettings"
  );

  const studies = await getPublicCaseStudies({ isDraftMode: false });
  assert(
    studies.every((s) => s.status === "published"),
    "All public case studies have status = 'published'"
  );
  assert(
    studies.every((s) => s.updatedAt instanceof Date),
    "All public case studies have valid updatedAt Date"
  );

  console.log(`\n========================================`);
  console.log(`Tests Completed: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runSeoTests().catch((err) => {
  console.error("Test execution failed with error:", err);
  process.exit(1);
});
