import { requireAuth } from "@/lib/auth";
import { CrmService, FeatureGateService, UserService } from "@app-inmobiliaria/api";
import { PageHeader, FeatureGate } from "@app-inmobiliaria/ui";
import { TasksManager } from "@/components/dashboard/tasks-manager";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const user = await requireAuth();

  const [tasks, taskStats, hasCrm, users] = await Promise.all([
    CrmService.getTasksByTenant(user.tenantId),
    CrmService.getTaskStats(user.tenantId),
    FeatureGateService.checkFeature(user.tenantId, "crm"),
    UserService.getByTenant(user.tenantId),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tareas"
        description={`${taskStats.pending} pendientes · ${taskStats.overdue} vencidas`}
      />
      <FeatureGate enabled={hasCrm} featureName="CRM completo">
        <TasksManager
          tasks={tasks as any[]}
          stats={taskStats}
          users={users as any[]}
          currentUserId={user.id}
        />
      </FeatureGate>
    </div>
  );
}
