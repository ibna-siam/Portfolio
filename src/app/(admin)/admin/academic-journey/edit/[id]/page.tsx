import { redirect } from "next/navigation";

interface EditAliasProps {
  params: Promise<{ id: string }>;
}

export default async function MilestoneEditAliasPage({ params }: EditAliasProps) {
  const { id } = await params;
  redirect(`/admin/academic-journey/${id}/edit`);
}
