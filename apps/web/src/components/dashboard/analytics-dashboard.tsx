"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  Eye, Users, TrendingUp, Target, ArrowUpRight, ArrowDownRight,
  Calendar,
} from "lucide-react";
import { StatCard, ICON_COLORS, PageHeader } from "@app-inmobiliaria/ui";
import { ReportExporter } from "./report-exporter";

interface AnalyticsData {
  totalViews: number;
  totalLeads: number;
  conversionRate: number;
  viewsChange: number;
  leadsChange: number;
  viewsByDay: { date: string; count: number }[];
  leadsByDay: { date: string; count: number }[];
  topProperties: {
    propertyId: string;
    views: number;
    title?: string;
    slug?: string;
    city?: string;
    _count?: { leads: number };
  }[];
  leadsByStatus: { status: string; count: number }[];
}

const STATUS_LABELS: Record<string, string> = {
  NEW: "Nuevos",
  CONTACTED: "Contactados",
  IN_VISIT: "En visita",
  OFFER: "En oferta",
  CONVERTED: "Convertidos",
  LOST: "Perdidos",
};

const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#06b6d4", "#ef4444"];

const PERIOD_OPTIONS = [
  { value: 7, label: "7 días" },
  { value: 15, label: "15 días" },
  { value: 30, label: "30 días" },
  { value: 90, label: "90 días" },
];

function ChangeIndicator({ value }: { value: number }) {
  if (value === 0) return <span className="text-xs text-muted-foreground">Sin cambios</span>;
  const isPositive = value > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
      {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {Math.abs(value)}% vs período anterior
    </span>
  );
}

function formatDate(dateStr: unknown) {
  const d = new Date(String(dateStr) + "T12:00:00");
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
}

async function fetchAnalytics(days: number): Promise<AnalyticsData> {
  const res = await fetch(`/api/analytics?days=${days}`);
  if (!res.ok) throw new Error("Error al cargar analytics");
  return res.json();
}

export function AnalyticsDashboard() {
  const [days, setDays] = useState(30);

  const { data, isLoading } = useQuery({
    queryKey: ["analytics", days],
    queryFn: () => fetchAnalytics(days),
  });

  if (isLoading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Analytics" description="Métricas de rendimiento de tu inmobiliaria" />
        <div className="flex items-center gap-3">
          <ReportExporter days={days} />
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex rounded-lg border bg-card p-0.5">
              {PERIOD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDays(opt.value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    days === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <StatCard
            label="Visitas"
            value={data.totalViews.toLocaleString("es-AR")}
            icon={<Eye className="h-5 w-5" />}
            colorScheme="blue"
          />
          <div className="mt-2 px-1"><ChangeIndicator value={data.viewsChange} /></div>
        </div>
        <div>
          <StatCard
            label="Leads"
            value={data.totalLeads.toLocaleString("es-AR")}
            icon={<Users className="h-5 w-5" />}
            colorScheme="violet"
          />
          <div className="mt-2 px-1"><ChangeIndicator value={data.leadsChange} /></div>
        </div>
        <StatCard
          label="Tasa de conversión"
          value={`${data.conversionRate}%`}
          subtitle="visitas → leads"
          icon={<Target className="h-5 w-5" />}
          colorScheme="emerald"
        />
        <StatCard
          label="Propiedades top"
          value={data.topProperties.length}
          subtitle="con más visitas"
          icon={<TrendingUp className="h-5 w-5" />}
          colorScheme="amber"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Visitas por día</h3>
          {data.viewsByDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data.viewsByDay}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e5e7eb)" />
                <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground, #9ca3af)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground, #9ca3af)" allowDecimals={false} />
                <Tooltip
                  labelFormatter={formatDate}
                  contentStyle={{ backgroundColor: "var(--color-card, #fff)", border: "1px solid var(--color-border, #e5e7eb)", borderRadius: "8px", fontSize: 12 }}
                />
                <Area type="monotone" dataKey="count" name="Visitas" stroke="#3b82f6" fillOpacity={1} fill="url(#viewsGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
              Sin datos de visitas aún
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Leads por día</h3>
          {data.leadsByDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.leadsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e5e7eb)" />
                <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground, #9ca3af)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground, #9ca3af)" allowDecimals={false} />
                <Tooltip
                  labelFormatter={formatDate}
                  contentStyle={{ backgroundColor: "var(--color-card, #fff)", border: "1px solid var(--color-border, #e5e7eb)", borderRadius: "8px", fontSize: 12 }}
                />
                <Bar dataKey="count" name="Leads" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
              Sin leads en este período
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Propiedades más visitadas</h3>
          {data.topProperties.length > 0 ? (
            <div className="space-y-3">
              {data.topProperties.map((prop, i) => (
                <div key={prop.propertyId} className="flex items-center gap-3">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${ICON_COLORS[i === 0 ? "amber" : i === 1 ? "blue" : "slate"].bg} ${ICON_COLORS[i === 0 ? "amber" : i === 1 ? "blue" : "slate"].text}`}>
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{prop.title || "Sin título"}</div>
                    {prop.city && <div className="text-xs text-muted-foreground">{prop.city}</div>}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground">{prop.views}</div>
                    <div className="text-xs text-muted-foreground">visitas</div>
                  </div>
                  {prop._count && (
                    <div className="text-right">
                      <div className="text-sm font-semibold text-foreground">{prop._count.leads}</div>
                      <div className="text-xs text-muted-foreground">leads</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              Sin visitas registradas aún
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Leads por estado</h3>
          {data.leadsByStatus.length > 0 ? (
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={data.leadsByStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%" cy="50%"
                    innerRadius={45} outerRadius={80}
                    paddingAngle={2}
                  >
                    {data.leadsByStatus.map((entry, i) => (
                      <Cell key={entry.status} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {data.leadsByStatus.map((item, i) => (
                  <div key={item.status} className="flex items-center gap-2">
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="flex-1 text-sm text-foreground">{STATUS_LABELS[item.status] || item.status}</span>
                    <span className="text-sm font-semibold text-foreground">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              Sin leads registrados
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
