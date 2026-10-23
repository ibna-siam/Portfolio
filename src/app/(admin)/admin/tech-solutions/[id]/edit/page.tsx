import { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { TechSolutionEditor } from "@/components/admin/tech-solution-editor";

interface EditTechSolutionPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Tech Solution | Portfolio CMS",
  description:
    "Edit financial software architecture and problem-solution specifications.",
  robots: { index: false, follow: false },
};

export default async function EditTechSolutionPage({
  params,
}: EditTechSolutionPageProps) {
  const session = await requireAdmin();
  const { id } = await params;
  const db = getDb();

  const [solution] = await db
    .select()
    .from(schema.techSolutions)
    .where(eq(schema.techSolutions.id, id))
    .limit(1);

  if (!solution) {
    notFound();
  }

  return (
    <AdminShell
      userEmail={session.user?.email}
      userName={session.user?.name}
      title={`Edit Solution: ${solution.title}`}
      breadcrumbs={[
        { label: "Tech Solutions", href: "/admin/tech-solutions" },
        { label: solution.title },
      ]}
    >
      <TechSolutionEditor
        initialData={{
          id: solution.id,
          title: solution.title,
          category: solution.category,
          status: solution.status,
          statusTheme: solution.statusTheme,
          problem: solution.problem,
          solution: solution.solution,
          userRole: solution.userRole,
          techStack: solution.techStack,
          features: solution.features,
          verifiedRepo: solution.verifiedRepo,
          verifiedDemo: solution.verifiedDemo,
          linkText: solution.linkText,
          sortOrder: solution.sortOrder,
          contentStatus: solution.contentStatus,
        }}
        isNew={false}
      />
    </AdminShell>
  );
}
