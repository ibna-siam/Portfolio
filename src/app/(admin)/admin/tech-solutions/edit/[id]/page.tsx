import { redirect } from "next/navigation";

interface EditAliasProps {
  params: Promise<{ id: string }>;
}

export default async function TechSolutionEditAliasPage({ params }: EditAliasProps) {
  const { id } = await params;
  redirect(`/admin/tech-solutions/${id}/edit`);
}
