import { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { MilestoneEditor } from "@/components/admin/milestone-editor";

interface EditMilestonePageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Milestone | Portfolio CMS",
  description: "Edit institutional degree milestone record.",
  robots: { index: false, follow: false },
};

export default async function EditMilestonePage({ params }: EditMilestonePageProps) {
  const session = await requireAdmin();
  const { id } = await params;
  const db = getDb();

  const [milestone] = await db
    .select()
    .from(schema.academicMilestones)
    .where(eq(schema.academicMilestones.id, id))
    .limit(1);

  if (!milestone) {
    notFound();
  }

  return (
    <AdminShell
      userEmail={session.user?.email}
      userName={session.user?.name}
      title={`Edit Milestone: ${milestone.degree}`}
      breadcrumbs={[
        { label: "Academic Journey", href: "/admin/academic-journey" },
        { label: milestone.degree },
      ]}
    >
      <MilestoneEditor
        initialData={{
          id: milestone.id,
          degree: milestone.degree,
          institution: milestone.institution,
          campus: milestone.campus,
          major: milestone.major,
          status: milestone.status,
          period: milestone.period,
          overview: milestone.overview,
          disciplines: milestone.disciplines,
          sortOrder: milestone.sortOrder,
        }}
      />
    </AdminShell>
  );
}
