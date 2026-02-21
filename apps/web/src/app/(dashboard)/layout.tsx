import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getTenant } from "@/lib/tenant";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { CommandPalette } from "@/components/dashboard/command-palette";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, tenant] = await Promise.all([
    getCurrentUser(),
    getTenant(),
  ]);

  if (!user || !user.tenant || !tenant) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        tenantName={tenant.name}
        tenantSlug={tenant.slug}
        userName={user.name || user.email}
        primaryColor={tenant.primaryColor}
      />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-6 pt-16 lg:pt-6">
          {children}
        </div>
      </main>
      <CommandPalette />
    </div>
  );
}
