import { redirect } from "next/navigation";

interface EditAliasProps {
  params: Promise<{ id: string }>;
}

export default async function CompetencyEditAliasPage({ params }: EditAliasProps) {
  const { id } = await params;
  redirect(`/admin/competencies/${id}/edit`);
}
