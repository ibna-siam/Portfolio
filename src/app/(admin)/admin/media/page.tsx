import { Metadata } from "next";
import { desc } from "drizzle-orm";

import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { getCloudinaryStatus } from "@/lib/cloudinary";
import { AdminShell } from "@/components/admin/admin-shell";
import { MediaClient } from "./media-client";

export const metadata: Metadata = {
  title: "Media Library | Portfolio CMS Admin",
  description: "Cloudinary media storage and PostgreSQL asset register for Md Ibna Siam CMS.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminMediaPage() {
  // Server-side boundary check: strictly restricts access to authenticated administrators
  const session = await requireAdmin();

  // Retrieve current Cloudinary configuration status
  const configStatus = getCloudinaryStatus();

  // Retrieve registered media assets from PostgreSQL
  const db = getDb();
  const rawAssets = await db
    .select()
    .from(schema.mediaAssets)
    .orderBy(desc(schema.mediaAssets.createdAt));

  // Serialize date fields for client component consumption
  const assets = rawAssets.map((asset) => ({
    id: asset.id,
    publicId: asset.publicId,
    secureUrl: asset.secureUrl,
    format: asset.format,
    width: asset.width,
    height: asset.height,
    bytes: asset.bytes,
    altText: asset.altText,
    folder: asset.folder,
    createdAt: asset.createdAt,
    updatedAt: asset.updatedAt,
  }));

  return (
    <AdminShell
      userEmail={session.user?.email}
      userName={session.user?.name}
      title="Media Library"
      description="Cloudinary asset storage, document figures, and verified credential attachments."
      breadcrumbs={[
        { label: "Overview", href: "/admin" },
        { label: "Media Library" },
      ]}
    >
      <MediaClient initialAssets={assets} configStatus={configStatus} />
    </AdminShell>
  );
}
