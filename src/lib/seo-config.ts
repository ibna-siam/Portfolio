/**
 * Centralized SEO & Structured Data Configuration
 * Strictly adheres to verified credentials, canonical domain, and factual positioning.
 */

export const siteConfig = {
  name: "Md Ibna Siam",
  shortName: "Ibna Siam",
  title: "Md Ibna Siam — Accounting & Finance Portfolio | ACCA Pathway",
  titleTemplate: "%s | Md Ibna Siam",
  description:
    "Accounting and finance portfolio of Md Ibna Siam (DIU). Applied financial reporting, managerial costing, Bangladesh taxation compliance, and financial analysis.",
  url: "https://ibnasiam.vercel.app",
  social: {
    linkedin: "https://www.linkedin.com/in/ibnasiam/",
    github: "https://github.com/ibna-siam",
  },
  academic: {
    institution: "Daffodil International University",
    institutionUrl: "https://daffodilvarsity.edu.bd",
    degree: "BBA in Accounting",
    academicId: "252-58-083",
    status: "Undergraduate Student",
    futureGoal: "ACCA Qualification Candidate",
  },
  keywords: [
    "Md Ibna Siam",
    "Accounting",
    "Finance",
    "Financial Analysis",
    "Taxation",
    "Audit & Assurance",
    "Managerial Costing",
    "ACCA Pathway",
    "Daffodil International University",
    "Bangladesh",
  ],
};

export function getPersonStructuredData(socialLinks?: {
  linkedin?: string | null;
  github?: string | null;
}) {
  return {
    "@type": "Person",
    "@id": `${siteConfig.url}/#person`,
    name: siteConfig.name,
    jobTitle: "Accounting & Finance Student",
    url: siteConfig.url,
    sameAs: [
      socialLinks?.linkedin || siteConfig.social.linkedin,
      socialLinks?.github || siteConfig.social.github,
    ],
    affiliation: {
      "@type": "EducationalOrganization",
      name: siteConfig.academic.institution,
      url: siteConfig.academic.institutionUrl,
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: siteConfig.academic.institution,
    },
    knowsAbout: [
      "Financial Accounting & Reporting",
      "Managerial Cost Accounting",
      "Bangladesh Taxation (Income Tax Act 2023)",
      "Audit & Assurance",
      "Corporate Financial Analysis",
      "ACCA Pathway",
    ],
    description: `BBA in Accounting student at ${siteConfig.academic.institution} with an ACCA qualification goal and technical proficiency in financial systems.`,
  };
}

export function getWebSiteStructuredData() {
  return {
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.title,
    description: siteConfig.description,
    publisher: {
      "@id": `${siteConfig.url}/#person`,
    },
    inLanguage: "en-US",
  };
}

export function getArticleStructuredData(study: {
  title: string;
  description: string;
  slug: string;
  category: string;
  group?: string | null;
  updatedAt?: Date | string | null;
}) {
  const publishedDate = study.updatedAt
    ? new Date(study.updatedAt).toISOString()
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.description,
    url: `${siteConfig.url}/case-studies/${study.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/case-studies/${study.slug}`,
    },
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    datePublished: publishedDate,
    dateModified: publishedDate,
    about: study.category,
    articleSection: study.group || study.category,
  };
}
