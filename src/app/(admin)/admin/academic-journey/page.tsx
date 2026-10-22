import { Metadata } from "next";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { AdminNav } from "@/components/admin/admin-nav";
import { JourneyClient, MilestoneItem } from "./journey-client";
import { AccaTrajectoryFormData } from "./actions";

export const metadata: Metadata = {
  title: "Academic Journey CMS | Md Ibna Siam Admin",
  description: "Manage education milestones and ACCA trajectory.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminAcademicJourneyPage() {
  const session = await requireAdmin();
  const db = getDb();

  const rawMilestones = await db
    .select()
    .from(schema.academicMilestones)
    .orderBy(schema.academicMilestones.sortOrder);

  const [site] = await db
    .select({ accaTrajectory: schema.siteSettings.accaTrajectory })
    .from(schema.siteSettings)
    .where(eq(schema.siteSettings.id, "default"))
    .limit(1);

  const milestones: MilestoneItem[] = rawMilestones.map((m) => ({
    id: m.id,
    institution: m.institution,
    campus: m.campus,
    degree: m.degree,
    major: m.major,
    status: m.status,
    period: m.period,
    overview: m.overview,
    disciplines: m.disciplines || [],
    sortOrder: m.sortOrder,
  }));

  const defaultAcca: AccaTrajectoryFormData = {
    qualification: "ACCA Qualification",
    credentialBody: "Association of Chartered Certified Accountants (UK)",
    trajectoryType: "Career Trajectory in Planning",
    statusLabel: "Target Professional Credential",
    integrityNotice:
      "Status is designated strictly as a planned career target. No completed exams or registration claims are made prior to formal institutional verification.",
    strategicFocus: [
      "Financial Reporting (FR / DipIFR)",
      "Audit & Assurance (AA)",
      "Strategic Business Leader (SBL)",
    ],
  };

  const acca = (site?.accaTrajectory as AccaTrajectoryFormData) || defaultAcca;

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100 font-body">
      <AdminNav userEmail={session.user?.email} userName={session.user?.name} />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-up">
        <JourneyClient initialMilestones={milestones} initialAcca={acca} />
      </main>
    </div>
  );
}
