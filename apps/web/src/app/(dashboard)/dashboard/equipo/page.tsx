import { requireAuth } from "@/lib/auth";
import { UserService, FeatureGateService } from "@app-inmobiliaria/api";
import { PageHeader } from "@app-inmobiliaria/ui";
import { TeamManager } from "@/components/dashboard/team-manager";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const currentUser = await requireAuth();

  const [users, userLimit] = await Promise.all([
    UserService.getByTenant(currentUser.tenantId),
    FeatureGateService.checkUserLimit(currentUser.tenantId),
  ]);

  const isAdmin = currentUser.role === "TENANT_ADMIN" || currentUser.role === "PLATFORM_ADMIN";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipo"
        description={`${userLimit.current} de ${userLimit.max === -1 ? "∞" : userLimit.max} usuarios`}
      />
      <TeamManager
        users={users as any[]}
        currentUserId={currentUser.id}
        isAdmin={isAdmin}
        userLimit={userLimit}
      />
    </div>
  );
}
