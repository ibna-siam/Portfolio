import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { AdminNav } from "@/components/admin/admin-nav";
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
    <div className="min-h-screen bg-ink-950 text-ink-100 font-body">
      <AdminNav userEmail={session.user?.email} userName={session.user?.name} />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-up">
        <CompetenciesClient initialCompetencies={competencies} />
      </main>
    </div>
  );
}
