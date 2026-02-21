import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTenant } from "@/lib/tenant";
import { CustomPageService } from "@app-inmobiliaria/api";

interface Props {
  params: Promise<{ pageSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageSlug } = await params;
  const tenant = await getTenant();
  if (!tenant) return {};

  const page = await CustomPageService.getBySlug(tenant.id, pageSlug);
  if (!page || !page.isPublished) return {};

  return {
    title: `${page.title} | ${tenant.name}`,
    description: page.content.replace(/<[^>]*>/g, "").slice(0, 160),
    alternates: { canonical: `/${pageSlug}` },
  };
}

export default async function CustomPageRoute({ params }: Props) {
  const { pageSlug } = await params;
  const tenant = await getTenant();
  if (!tenant) return notFound();

  const page = await CustomPageService.getBySlug(tenant.id, pageSlug);
  if (!page || !page.isPublished) return notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-foreground md:text-4xl">{page.title}</h1>
      <div
        className="prose prose-slate max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-blue-600 prose-blockquote:border-blue-500 prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}
