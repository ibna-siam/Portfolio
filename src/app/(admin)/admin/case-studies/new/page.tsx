import { Metadata } from "next";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { AdminNav } from "@/components/admin/admin-nav";
import { CaseStudyEditor } from "@/components/admin/case-study-editor";

export const metadata: Metadata = {
  title: "New Case Study | Portfolio CMS Admin",
  description: "Create an academic accounting or finance case study.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewCaseStudyPage() {
  const session = await requireAdmin();
  const db = getDb();

  // Load available media assets for picker
  const rawMedia = await db
    .select({
      id: schema.mediaAssets.id,
      publicId: schema.mediaAssets.publicId,
      secureUrl: schema.mediaAssets.secureUrl,
      format: schema.mediaAssets.format,
      width: schema.mediaAssets.width,
      height: schema.mediaAssets.height,
      bytes: schema.mediaAssets.bytes,
      altText: schema.mediaAssets.altText,
    })
    .from(schema.mediaAssets)
    .orderBy(desc(schema.mediaAssets.createdAt));

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100 font-body">
      <AdminNav userEmail={session.user?.email} userName={session.user?.name} />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-up">
        <CaseStudyEditor availableMediaAssets={rawMedia} />
      </main>
    </div>
  );
}
