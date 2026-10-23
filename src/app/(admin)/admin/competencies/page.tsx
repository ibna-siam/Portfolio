import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { CompetenciesClient, CompetencyItem } from "./competencies-client";

export const metadata: Metadata = {
  title: "Competencies CMS | Md Ibna Siam Admin",
  description: "Manage accounting and finance competencies matrix.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminCompetenciesPage() {
  const session = await requireAdmin();
  const db = getDb();

  const rawCompetencies = await db
    .select()
    .from(schema.competencies)
    .orderBy(schema.competencies.sortOrder);

  const competencies: CompetencyItem[] = rawCompetencies.map((c) => ({
    id: c.id,
    name: c.name,
    domain: c.domain,
    category: c.category,
    evidenceLabel: c.evidenceLabel,
    description: c.description,
    frameworkTags: c.frameworkTags || [],
    relatedProject: c.relatedProject,
    sortOrder: c.sortOrder,
    status: c.status,
  }));

  return (
    <AdminShell
      userEmail={session.user?.email}
      userName={session.user?.name}
      title="Competencies Matrix"
      description="Accounting, audit, taxation, and financial technology capabilities across 4 core domains."
      breadcrumbs={[{ label: "Overview", href: "/admin" }, { label: "Competencies" }]}
    >
      <CompetenciesClient initialCompetencies={competencies} />
    </AdminShell>
  );
}
