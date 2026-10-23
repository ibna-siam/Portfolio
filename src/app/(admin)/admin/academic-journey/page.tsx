import { Metadata } from "next";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
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

  // Retrieve academic milestones and site settings concurrently
  const [rawMilestones, [site]] = await Promise.all([
    db
      .select()
      .from(schema.academicMilestones)
      .orderBy(schema.academicMilestones.sortOrder),
    db
      .select({ accaTrajectory: schema.siteSettings.accaTrajectory })
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.id, "default"))
      .limit(1),
  ]);

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
    <AdminShell
      userEmail={session.user?.email}
      userName={session.user?.name}
      title="Academic Journey & Trajectory"
      description="Manage educational degrees, institutional milestones, and verified ACCA professional qualification trajectory."
      breadcrumbs={[{ label: "Overview", href: "/admin" }, { label: "Academic Journey" }]}
    >
      <JourneyClient initialMilestones={milestones} initialAcca={acca} />
    </AdminShell>
  );
}
