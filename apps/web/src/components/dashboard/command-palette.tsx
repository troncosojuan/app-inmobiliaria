"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  LayoutDashboard, Building2, Users, Calculator, Settings, BarChart3,
  UserCog, Plus, FileSpreadsheet, Search, ExternalLink,
} from "lucide-react";

const ROUTES = [
  { label: "Inicio", href: "/dashboard", icon: LayoutDashboard, group: "Navegación" },
  { label: "Propiedades", href: "/dashboard/propiedades", icon: Building2, group: "Navegación" },
  { label: "Leads", href: "/dashboard/leads", icon: Users, group: "Navegación" },
  { label: "Equipo", href: "/dashboard/equipo", icon: UserCog, group: "Navegación" },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3, group: "Navegación" },
  { label: "Herramientas", href: "/dashboard/herramientas", icon: Calculator, group: "Navegación" },
  { label: "Configuración", href: "/dashboard/configuracion", icon: Settings, group: "Navegación" },
  { label: "Nueva propiedad", href: "/dashboard/propiedades/nueva", icon: Plus, group: "Acciones" },
  { label: "Importar CSV", href: "/dashboard/propiedades/importar", icon: FileSpreadsheet, group: "Acciones" },
  { label: "Ver mi sitio", href: "/", icon: ExternalLink, group: "Acciones", external: true },
  { label: "Buscar propiedades", href: "/propiedades", icon: Search, group: "Acciones", external: true },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const runAction = useCallback(
    (href: string, external?: boolean) => {
      setOpen(false);
      if (external) {
        window.open(href, "_blank");
      } else {
        router.push(href);
      }
    },
    [router]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="flex min-h-full items-start justify-center px-4 pt-[15vh]">
        <Command
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border bg-card shadow-2xl"
          loop
        >
          <div className="flex items-center border-b px-4">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <Command.Input
              placeholder="¿Qué querés hacer?"
              className="h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <kbd className="ml-2 hidden shrink-0 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:block">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
              No se encontraron resultados
            </Command.Empty>

            {["Navegación", "Acciones"].map((group) => {
              const items = ROUTES.filter((r) => r.group === group);
              return (
                <Command.Group key={group} heading={group} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
                  {items.map((route) => (
                    <Command.Item
                      key={route.href}
                      value={`${route.label} ${route.group}`}
                      onSelect={() => runAction(route.href, route.external)}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors aria-selected:bg-primary/10 aria-selected:text-primary"
                    >
                      <route.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>{route.label}</span>
                      {route.external && (
                        <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground" />
                      )}
                    </Command.Item>
                  ))}
                </Command.Group>
              );
            })}
          </Command.List>

          <div className="flex items-center justify-between border-t px-4 py-2">
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px]">↑↓</kbd>
                navegar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px]">↵</kbd>
                seleccionar
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground/60">InmoPlatform</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
