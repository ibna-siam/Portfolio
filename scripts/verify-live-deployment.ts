import "dotenv/config";

interface LiveCheckResult {
  url: string;
  status: number;
  statusText: string;
  contentType: string | null;
  contentLength: string | null;
  hasRobotsMeta?: string | null;
  hasCanonical?: string | null;
  hasJsonLd?: boolean;
  hasOpenGraph?: boolean;
  title?: string | null;
  description?: string | null;
  sampleBody?: string;
  error?: string;
}

async function fetchLive(url: string, options?: RequestInit): Promise<LiveCheckResult> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        ...(options?.headers || {}),
      },
    });

    const text = await res.text();
    const contentType = res.headers.get("content-type");
    const contentLength = res.headers.get("content-length") || String(text.length);

    // Extract title
    const titleMatch = text.match(/<title>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : null;

    // Extract meta description
    const descMatch = text.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i
    );
    const description = descMatch ? descMatch[1] : null;

    // Extract robots meta
    const robotsMatch = text.match(
      /<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i
    );
    const hasRobotsMeta = robotsMatch ? robotsMatch[1] : null;

    // Extract canonical
    const canonicalMatch = text.match(
      /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i
    );
    const hasCanonical = canonicalMatch ? canonicalMatch[1] : null;

    // Extract JSON-LD
    const hasJsonLd = text.includes("application/ld+json");

    // Extract OpenGraph
    const hasOpenGraph = text.includes('property="og:');

    return {
      url,
      status: res.status,
      statusText: res.statusText,
      contentType,
      contentLength,
      hasRobotsMeta,
      hasCanonical,
      hasJsonLd,
      hasOpenGraph,
      title,
      description,
      sampleBody: text.slice(0, 300),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      url,
      status: 0,
      statusText: "FETCH_ERROR",
      contentType: null,
      contentLength: null,
      error: message,
    };
  }
}

async function runLiveAudit() {
  console.log(
    "=== Phase 12 Live Production Site Audit (https://ibnasiam.vercel.app) ===\n"
  );
  const baseUrl = "https://ibnasiam.vercel.app";

  const targets = [
    { name: "Homepage", url: `${baseUrl}/` },
    { name: "Case Studies Catalog", url: `${baseUrl}/case-studies` },
    {
      name: "Case Study: Square Pharma",
      url: `${baseUrl}/case-studies/square-pharmaceuticals-financial-analysis`,
    },
    {
      name: "Case Study: Income Tax Return",
      url: `${baseUrl}/case-studies/individual-income-tax-return-ay2023-24`,
    },
    { name: "Robots Directives", url: `${baseUrl}/robots.txt` },
    { name: "XML Sitemap", url: `${baseUrl}/sitemap.xml` },
    {
      name: "Nonexistent Route (404 test)",
      url: `${baseUrl}/non-existent-route-for-testing`,
    },
    { name: "Protected Admin Dashboard", url: `${baseUrl}/admin` },
    { name: "Protected Admin Login", url: `${baseUrl}/admin/login` },
  ];

  for (const t of targets) {
    console.log(`Checking [${t.name}] -> ${t.url}...`);
    const res = await fetchLive(t.url, { redirect: "manual" });
    if (res.error) {
      console.log(`  ERROR: ${res.error}`);
    } else {
      console.log(`  Status: ${res.status} ${res.statusText}`);
      console.log(`  Content-Type: ${res.contentType}`);
      if (res.title) console.log(`  Title: ${res.title}`);
      if (res.description) console.log(`  Description: ${res.description}`);
      if (res.hasRobotsMeta) console.log(`  Meta Robots: ${res.hasRobotsMeta}`);
      if (res.hasCanonical) console.log(`  Canonical: ${res.hasCanonical}`);
      console.log(`  OpenGraph Present: ${res.hasOpenGraph}`);
      console.log(`  JSON-LD Present: ${res.hasJsonLd}`);
      if (t.url.endsWith("robots.txt") || t.url.endsWith("sitemap.xml")) {
        console.log(`  Body Preview:\n${res.sampleBody}\n`);
      }
    }
    console.log("--------------------------------------------------");
  }
}

runLiveAudit().catch(console.error);
