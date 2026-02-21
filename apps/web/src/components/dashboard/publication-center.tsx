"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Trash2, Loader2, ToggleLeft, ToggleRight, ExternalLink,
  Upload, Pause, CheckCircle2, AlertCircle, XCircle, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { ICON_COLORS } from "@app-inmobiliaria/ui";

const PORTALS = [
  { slug: "ZONAPROP", name: "ZonaProp", icon: "🏠", color: "blue" as const },
  { slug: "MERCADOLIBRE", name: "MercadoLibre", icon: "📦", color: "amber" as const },
  { slug: "ARGENPROP", name: "ArgenProp", icon: "🏢", color: "emerald" as const },
];

interface Channel {
  id: string;
  portal: string;
  isActive: boolean;
  _count: { publications: number };
}

interface Publication {
  id: string;
  status: string;
  externalId: string | null;
  lastSyncAt: string | null;
  errorMessage: string | null;
  property: { id: string; title: string; slug: string; status: string };
  channel: { portal: string; isActive: boolean };
}

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; label: string; class: string }> = {
  PUBLISHED: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: "Publicado", class: "text-emerald-600 dark:text-emerald-400" },
  DRAFT: { icon: <AlertCircle className="h-3.5 w-3.5" />, label: "Borrador", class: "text-amber-600 dark:text-amber-400" },
  PAUSED: { icon: <Pause className="h-3.5 w-3.5" />, label: "Pausado", class: "text-muted-foreground" },
  ERROR: { icon: <XCircle className="h-3.5 w-3.5" />, label: "Error", class: "text-red-600 dark:text-red-400" },
};

async function fetchPortalData(): Promise<{ channels: Channel[]; publications: Publication[] }> {
  const [chRes, pubRes] = await Promise.all([
    fetch("/api/portals"),
    fetch("/api/portals/publications"),
  ]);
  return {
    channels: chRes.ok ? await chRes.json() : [],
    publications: pubRes.ok ? await pubRes.json() : [],
  };
}

export function PublicationCenter() {
  const queryClient = useQueryClient();
  const { data, isLoading: loading } = useQuery({
    queryKey: ["portal-data"],
    queryFn: fetchPortalData,
  });
  const channels = data?.channels ?? [];
  const publications = data?.publications ?? [];
  const [activeTab, setActiveTab] = useState<"channels" | "publications">("channels");

  async function connectPortal(portal: string) {
    try {
      const res = await fetch("/api/portals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portal }),
      });
      if (res.ok) {
        toast.success("Portal conectado");
        queryClient.invalidateQueries({ queryKey: ["portal-data"] });
      } else {
        const data = await res.json();
        toast.error(data.error || "Error al conectar");
      }
    } catch { toast.error("Error de conexión"); }
  }

  async function togglePortal(portal: string) {
    try {
      const res = await fetch(`/api/portals/${portal}`, { method: "PATCH" });
      if (res.ok) {
        toast.success("Estado actualizado");
        queryClient.invalidateQueries({ queryKey: ["portal-data"] });
      }
    } catch { toast.error("Error al cambiar estado"); }
  }

  async function disconnectPortal(portal: string) {
    try {
      const res = await fetch(`/api/portals/${portal}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Portal desconectado");
        queryClient.invalidateQueries({ queryKey: ["portal-data"] });
      }
    } catch { toast.error("Error al desconectar"); }
  }

  async function publishAction(propertyId: string, portal: string, action: "publish" | "unpublish") {
    try {
      const res = await fetch("/api/portals/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, portal, action: action === "unpublish" ? "unpublish" : undefined }),
      });
      if (res.ok) {
        toast.success(action === "publish" ? "Publicado (simulado)" : "Despublicado");
        queryClient.invalidateQueries({ queryKey: ["portal-data"] });
      } else {
        const data = await res.json();
        toast.error(data.error || "Error");
      }
    } catch { toast.error("Error de conexión"); }
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const connectedPortals = channels.map((c) => c.portal);
  const availablePortals = PORTALS.filter((p) => !connectedPortals.includes(p.slug));

  return (
    <div className="space-y-6">
      <div className="flex gap-1 rounded-lg border bg-muted/50 p-1">
        {(["channels", "publications"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "channels" ? "Portales" : "Publicaciones"}
          </button>
        ))}
      </div>

      {activeTab === "channels" && (
        <div className="space-y-4">
          {channels.length > 0 && (
            <div className="space-y-3">
              {channels.map((ch) => {
                const portal = PORTALS.find((p) => p.slug === ch.portal);
                return (
                  <div key={ch.id} className="flex items-center justify-between rounded-xl border bg-card p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{portal?.icon || "🌐"}</span>
                      <div>
                        <h3 className="font-semibold text-foreground">{portal?.name || ch.portal}</h3>
                        <p className="text-xs text-muted-foreground">
                          {ch._count.publications} publicaciones · {ch.isActive ? "Activo" : "Inactivo"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => togglePortal(ch.portal)}
                        className="rounded-lg border p-2 text-muted-foreground hover:bg-muted transition-colors"
                        title={ch.isActive ? "Desactivar" : "Activar"}
                      >
                        {ch.isActive ? <ToggleRight className="h-4 w-4 text-emerald-500" /> : <ToggleLeft className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => disconnectPortal(ch.portal)}
                        className="rounded-lg border p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Desconectar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {availablePortals.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">Portales disponibles</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {availablePortals.map((portal) => (
                  <button
                    key={portal.slug}
                    type="button"
                    onClick={() => connectPortal(portal.slug)}
                    className="flex items-center gap-3 rounded-xl border border-dashed bg-card p-4 text-left transition-colors hover:border-primary hover:bg-muted/50"
                  >
                    <span className="text-2xl">{portal.icon}</span>
                    <div>
                      <span className="font-medium text-foreground">{portal.name}</span>
                      <p className="text-xs text-muted-foreground">Conectar portal</p>
                    </div>
                    <Plus className="ml-auto h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
            <p className="font-medium">Modo simulación</p>
            <p className="mt-1 text-xs opacity-80">
              Las publicaciones se simulan localmente. La integración real con las APIs de los portales
              requiere convenios comerciales. La estructura está preparada para cuando se activen.
            </p>
          </div>
        </div>
      )}

      {activeTab === "publications" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["portal-data"] })}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </button>
          </div>

          {publications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-12 text-center">
              <div className={`rounded-lg ${ICON_COLORS.blue.bg} p-3 mb-4`}>
                <Upload className={`h-6 w-6 ${ICON_COLORS.blue.text}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Sin publicaciones</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Conectá un portal y publicá tu primera propiedad.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {publications.map((pub) => {
                const statusCfg = STATUS_CONFIG[pub.status] || STATUS_CONFIG.DRAFT;
                const portal = PORTALS.find((p) => p.slug === pub.channel.portal);
                return (
                  <div key={pub.id} className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl shrink-0">{portal?.icon || "🌐"}</span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{pub.property.title}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`flex items-center gap-1 ${statusCfg.class}`}>
                            {statusCfg.icon} {statusCfg.label}
                          </span>
                          {pub.lastSyncAt && (
                            <span className="text-muted-foreground">
                              · {new Date(pub.lastSyncAt).toLocaleDateString("es-AR")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {pub.status === "PUBLISHED" ? (
                        <button
                          type="button"
                          onClick={() => publishAction(pub.property.id, pub.channel.portal, "unpublish")}
                          className="rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                        >
                          Pausar
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => publishAction(pub.property.id, pub.channel.portal, "publish")}
                          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 transition-colors"
                        >
                          Publicar
                        </button>
                      )}
                      {pub.externalId && (
                        <span
                          className="rounded-lg border p-1.5 text-muted-foreground cursor-default"
                          title={`ID externo: ${pub.externalId}`}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
