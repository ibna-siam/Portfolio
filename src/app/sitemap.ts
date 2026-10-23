import type { MetadataRoute } from "next";
import { getPublicCaseStudies } from "@/lib/public-data";
import { siteConfig } from "@/lib/seo-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static core public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Retrieve strictly published case studies
  // Note: getPublicCaseStudies({ isDraftMode: false }) guarantees unpublished/draft items are excluded
  try {
    const studies = await getPublicCaseStudies({ isDraftMode: false });
    const caseStudyRoutes: MetadataRoute.Sitemap = studies.map((study) => ({
      url: `${baseUrl}/case-studies/${study.slug}`,
      lastModified: study.updatedAt ? new Date(study.updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...caseStudyRoutes];
  } catch (error) {
    console.error("Error generating sitemap routes:", error);
    return staticRoutes;
  }
}
