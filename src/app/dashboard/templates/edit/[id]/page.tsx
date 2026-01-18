import NotificationTemplateBuilder from "@/components/notifications/templates/TemplateBuilder";
import { notFound } from "next/navigation";

export default async function UpdateTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  ) {
    notFound();
  }

  return <NotificationTemplateBuilder id={id} />;
}
