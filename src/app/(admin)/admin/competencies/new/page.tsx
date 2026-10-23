import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { CompetencyEditor } from "@/components/admin/competency-editor";

export const metadata: Metadata = {
  title: "New Competency | Portfolio CMS",
  description: "Create a new accounting or analytical competency record.",
  robots: { index: false, follow: false },
};

export default async function NewCompetencyPage() {
  const session = await requireAdmin();

  return (
    <AdminShell
      userEmail={session.user?.email}
      userName={session.user?.name}
      title="New Competency"
      breadcrumbs={[
        { label: "Competencies", href: "/admin/competencies" },
        { label: "New" },
      ]}
    >
      <CompetencyEditor isNew={true} />
    </AdminShell>
  );
}
