import { TenantService, LeadService } from "@app-inmobiliaria/api";
import { Building2, Boxes, Users, MessageSquare } from "lucide-react";
import { StatCard } from "@app-inmobiliaria/ui";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STAT_CARDS = [
  { key: "tenants", label: "Inmobiliarias activas", icon: Building2, href: "/tenants", color: "blue" as const },
  { key: "properties", label: "Propiedades activas", icon: Boxes, href: "/properties", color: "emerald" as const },
  { key: "users", label: "Usuarios activas", icon: Users, href: "/users", color: "violet" as const },
  { key: "leads", label: "Consultas activas", icon: MessageSquare, href: "/leads", color: "amber" as const },
];

export default async function AdminDashboard() {
  const [stats, recentTenants, recentLeads] = await Promise.all([
    TenantService.getStats(),
    TenantService.getRecentTenants(),
    LeadService.getRecent(),
  ]);

  const statValues: Record<string, number> = {
    tenants: stats.tenants,
    properties: stats.properties,
    users: stats.users,
    leads: stats.leads,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Resumen general de la plataforma</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <Link key={card.key} href={card.href}>
            <StatCard
              label={card.label}
              value={statValues[card.key]}
              icon={<card.icon className="h-5 w-5" />}
              colorScheme={card.color}
              showArrow
            />
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Últimas inmobiliarias</h2>
            <Link href="/tenants" className="text-sm text-primary hover:underline">Ver todas</Link>
          </div>
          <div className="space-y-3">
            {recentTenants.map((tenant) => (
              <div key={tenant.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ backgroundColor: tenant.primaryColor }}>
                    {tenant.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{tenant.name}</div>
                    <div className="text-xs text-muted-foreground">Plan {tenant.plan.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{tenant._count.properties}</div>
                  <div className="text-xs text-muted-foreground">propiedades</div>
                </div>
              </div>
            ))}
            {recentTenants.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">Sin inmobiliarias aún</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Últimas consultas</h2>
            <Link href="/leads" className="text-sm text-primary hover:underline">Ver todas</Link>
          </div>
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-foreground">{lead.name}</div>
                  <div className="text-xs text-muted-foreground">{lead.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-foreground">{lead.tenant.name}</div>
                  {lead.property && (
                    <div className="text-xs text-muted-foreground truncate max-w-[150px]">{lead.property.title}</div>
                  )}
                </div>
              </div>
            ))}
            {recentLeads.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">Sin consultas aún</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
