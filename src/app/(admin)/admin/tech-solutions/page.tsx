import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { AdminNav } from "@/components/admin/admin-nav";
import { SolutionsClient, TechSolutionItem } from "./solutions-client";

export const metadata: Metadata = {
  title: "Tech Solutions CMS | Md Ibna Siam Admin",
  description: "Manage business and technology problem solving solutions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminTechSolutionsPage() {
  const session = await requireAdmin();
  const db = getDb();

  const rawSolutions = await db
    .select()
    .from(schema.techSolutions)
    .orderBy(schema.techSolutions.sortOrder);

  const solutions: TechSolutionItem[] = rawSolutions.map((s) => ({
    id: s.id,
    title: s.title,
    category: s.category,
    status: s.status,
    statusTheme: s.statusTheme,
    problem: s.problem,
    solution: s.solution,
    userRole: s.userRole,
    techStack: s.techStack || [],
    features: s.features || [],
    verifiedRepo: s.verifiedRepo,
    verifiedDemo: s.verifiedDemo,
    linkText: s.linkText,
    sortOrder: s.sortOrder,
    contentStatus: s.contentStatus,
  }));

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100 font-body">
      <AdminNav userEmail={session.user?.email} userName={session.user?.name} />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-up">
        <SolutionsClient initialSolutions={solutions} />
      </main>
    </div>
  );
}
