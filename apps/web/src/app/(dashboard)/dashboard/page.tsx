import { requireAuth } from "@/lib/auth";
import { DashboardService } from "@app-inmobiliaria/api";
import Link from "next/link";
import {
  Phone, Mail, MessageCircle,
  Plus, Users, Calculator, Settings,
} from "lucide-react";
import { PageHeader, SectionCard, ICON_COLORS, type ColorKey } from "@app-inmobiliaria/ui";
import { AnimatedStats } from "@/components/dashboard/animated-stats";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireAuth();

  const [stats, recentLeads, topProperties] = await Promise.all([
    DashboardService.getTenantStats(user.tenantId),
    DashboardService.getRecentLeads(user.tenantId),
    DashboardService.getTopProperties(user.tenantId),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Hola, ${user.name?.split(" ")[0] || "Admin"}`}
        description="Resumen de tu inmobiliaria"
      />

      <AnimatedStats
        cards={[
          { label: "Propiedades activas", value: stats.activeProperties, iconName: "Building2", color: "blue", href: "/dashboard/propiedades" },
          { label: "Leads este mes", value: stats.leadsThisMonth, iconName: "Users", color: "emerald", href: "/dashboard/leads" },
          { label: "Tasa de conversión", value: stats.conversionRate, suffix: "%", iconName: "TrendingUp", color: "violet", href: "/dashboard/leads" },
          { label: "Destacadas", value: stats.featuredCount, iconName: "Star", color: "amber", href: "/dashboard/propiedades" },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {([
          { href: "/dashboard/propiedades/nueva", label: "Nueva propiedad", icon: Plus, colorKey: "blue" as ColorKey },
          { href: "/dashboard/leads", label: "Ver leads", icon: Users, colorKey: "emerald" as ColorKey },
          { href: "/dashboard/herramientas", label: "Calculadoras", icon: Calculator, colorKey: "amber" as ColorKey },
          { href: "/dashboard/configuracion", label: "Configuración", icon: Settings, colorKey: "violet" as ColorKey },
        ]).map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${ICON_COLORS[action.colorKey].bg} ${ICON_COLORS[action.colorKey].text}`}>
              <action.icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-foreground">{action.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Últimas consultas"
          action={<Link href="/dashboard/leads" className="text-sm text-primary hover:underline">Ver todas</Link>}
        >
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground">{lead.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{lead.email}</div>
                </div>
                <div className="flex items-center gap-1 ml-3">
                  {lead.phone && (
                    <a href={`tel:${lead.phone}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Llamar">
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <a href={`mailto:${lead.email}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Email">
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                  {lead.phone && (
                    <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="rounded-md p-1.5 text-muted-foreground hover:bg-green-100 hover:text-green-600" aria-label="WhatsApp">
                      <MessageCircle className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
            {recentLeads.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Aún no recibiste consultas. Compartí tu web para empezar.
              </p>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Propiedades con más consultas"
          action={<Link href="/dashboard/propiedades" className="text-sm text-primary hover:underline">Ver todas</Link>}
        >
          <div className="space-y-3">
            {topProperties.map((property) => (
              <div key={property.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground truncate">{property.title}</div>
                  <div className="text-xs text-muted-foreground">{property.city}</div>
                </div>
                <div className="ml-3 text-right">
                  <div className="text-sm font-semibold text-foreground">{property._count.leads}</div>
                  <div className="text-xs text-muted-foreground">consultas</div>
                </div>
              </div>
            ))}
            {topProperties.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Cargá tu primera propiedad para empezar.
              </p>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
