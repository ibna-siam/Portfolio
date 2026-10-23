import { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { AccaTrajectoryEditor } from "@/components/admin/acca-trajectory-editor";

export const metadata: Metadata = {
  title: "Edit ACCA Trajectory | Portfolio CMS",
  description: "Edit ACCA career pathway roadmap and paper targets.",
  robots: { index: false, follow: false },
};

export default async function EditAccaTrajectoryPage() {
  const session = await requireAdmin();
  const db = getDb();

  const [settings] = await db
    .select({ accaTrajectory: schema.siteSettings.accaTrajectory })
    .from(schema.siteSettings)
    .where(eq(schema.siteSettings.id, "default"))
    .limit(1);

  if (!settings || !settings.accaTrajectory) {
    notFound();
  }

  return (
    <AdminShell
      userEmail={session.user?.email}
      userName={session.user?.name}
      title="Edit ACCA Career Trajectory"
      breadcrumbs={[
        { label: "Academic Journey", href: "/admin/academic-journey" },
        { label: "ACCA Trajectory" },
      ]}
    >
      <AccaTrajectoryEditor initialData={settings.accaTrajectory} />
    </AdminShell>
  );
}
