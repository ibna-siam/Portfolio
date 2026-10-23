import { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { CompetencyEditor } from "@/components/admin/competency-editor";

interface EditCompetencyPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Competency | Portfolio CMS",
  description: "Edit accounting and analytical competency record.",
  robots: { index: false, follow: false },
};

export default async function EditCompetencyPage({ params }: EditCompetencyPageProps) {
  const session = await requireAdmin();
  const { id } = await params;
  const db = getDb();

  let competency;
  try {
    const [found] = await db
      .select()
      .from(schema.competencies)
      .where(eq(schema.competencies.id, id))
      .limit(1);
    competency = found;
  } catch {
    // If id is not a valid UUID
    notFound();
  }

  if (!competency) {
    notFound();
  }

  return (
    <AdminShell
      userEmail={session.user?.email}
      userName={session.user?.name}
      title={`Edit Competency: ${competency.name}`}
      breadcrumbs={[
        { label: "Competencies", href: "/admin/competencies" },
        { label: competency.name },
      ]}
    >
      <CompetencyEditor
        initialData={{
          id: competency.id,
          name: competency.name,
          domain: competency.domain,
          category: competency.category,
          evidenceLabel: competency.evidenceLabel,
          description: competency.description,
          frameworkTags: competency.frameworkTags,
          relatedProject: competency.relatedProject,
          sortOrder: competency.sortOrder,
          status: competency.status,
        }}
        isNew={false}
      />
    </AdminShell>
  );
}
