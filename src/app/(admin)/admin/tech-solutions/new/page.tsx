import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { TechSolutionEditor } from "@/components/admin/tech-solution-editor";

export const metadata: Metadata = {
  title: "New Tech Solution | Portfolio CMS",
  description: "Create a new financial engineering or business automation system record.",
  robots: { index: false, follow: false },
};

export default async function NewTechSolutionPage() {
  const session = await requireAdmin();

  return (
    <AdminShell
      userEmail={session.user?.email}
      userName={session.user?.name}
      title="New Tech Solution"
      breadcrumbs={[
        { label: "Tech Solutions", href: "/admin/tech-solutions" },
        { label: "New" },
      ]}
    >
      <TechSolutionEditor isNew={true} />
    </AdminShell>
  );
}
