import { draftMode } from "next/headers";
import type { Metadata } from "next";
import {
  getPublicSiteSettings,
  getPublicCaseStudies,
  getPublicCompetencies,
  getPublicAcademicMilestones,
  getPublicTechSolutions,
} from "@/lib/public-data";
import { PublicNav } from "@/components/public/public-nav";
import { PublicHero } from "@/components/public/public-hero";
import { PublicAbout } from "@/components/public/public-about";
import { PublicCaseStudies } from "@/components/public/public-case-studies";
import { PublicCompetencies } from "@/components/public/public-competencies";
import { PublicAcademicJourney } from "@/components/public/public-academic-journey";
import { PublicTechSolutions } from "@/components/public/public-tech-solutions";
import { PublicContact } from "@/components/public/public-contact";
import { PublicFooter } from "@/components/public/public-footer";
import { DraftPreviewBanner } from "@/components/public/draft-preview-banner";

export const metadata: Metadata = {
  title: "Md Ibna Siam — Accounting & Finance Portfolio | ACCA Pathway",
  description:
    "Undergraduate accounting portfolio of Md Ibna Siam (Daffodil International University). Practical financial reporting, managerial costing, Bangladesh Income Tax Act 2023 compliance, and financial technology solutions.",
};

export default async function HomePage() {
  const { isEnabled } = await draftMode();

  const [settings, caseStudies, competencies, milestones, solutions] =
    await Promise.all([
      getPublicSiteSettings(),
      getPublicCaseStudies({ isDraftMode: isEnabled }),
      getPublicCompetencies(),
      getPublicAcademicMilestones(),
      getPublicTechSolutions(),
    ]);

  if (!settings) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-ink-950 text-white">
        <div className="text-center space-y-3 max-w-md">
          <h1 className="text-xl font-bold font-display">Portfolio Unavailable</h1>
          <p className="text-sm text-ink-400">
            Database site configuration is currently undergoing initialization.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-ink-100 transition-colors duration-300">
      {isEnabled && <DraftPreviewBanner currentPath="/" />}

      <PublicNav />

      <main className="flex-1">
        <PublicHero settings={settings} />
        <PublicAbout settings={settings} />
        <PublicCaseStudies caseStudies={caseStudies} />
        <PublicCompetencies competencies={competencies} />
        <PublicAcademicJourney
          milestones={milestones}
          accaTrajectory={settings.accaTrajectory}
        />
        <PublicTechSolutions solutions={solutions} />
        <PublicContact
          email={settings.publicEmail}
          location={settings.location}
          linkedinUrl={settings.socialLinks?.linkedin}
          githubUrl={settings.socialLinks?.github}
        />
      </main>

      <PublicFooter
        email={settings.publicEmail}
        linkedinUrl={settings.socialLinks?.linkedin}
        githubUrl={settings.socialLinks?.github}
      />
    </div>
  );
}
