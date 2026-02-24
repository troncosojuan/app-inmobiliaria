import { notFound } from "next/navigation";
import { getTenant } from "@/lib/tenant";
import { FeatureGateService, CustomPageService } from "@app-inmobiliaria/api";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ChatWidget } from "@/components/chat/chat-widget";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await getTenant();
  if (!tenant) return notFound();
  const templateSlug = (tenant as { templateSlug?: string }).templateSlug || "modern";

  const [hasChat, customPages] = await Promise.all([
    FeatureGateService.checkFeature(tenant.id, "aiFeatures"),
    CustomPageService.getPublishedByTenant(tenant.id),
  ]);

  return (
    <div className={`flex min-h-screen flex-col template-${templateSlug}`}>
      <Navbar tenant={tenant} customPages={customPages} templateSlug={templateSlug} />
      <main className="flex-1">{children}</main>
      <Footer tenant={tenant} templateSlug={templateSlug} />
      {hasChat && (
        <ChatWidget
          tenantName={tenant.name}
          primaryColor={tenant.primaryColor}
        />
      )}
    </div>
  );
}
