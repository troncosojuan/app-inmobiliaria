"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Building2, Users, Calculator,
  Settings, ExternalLink, LogOut, Menu, X, ChevronRight, UserCog, BarChart3, FileText, CheckSquare, CreditCard, Palette, Share2,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@app-inmobiliaria/ui";

interface DashboardSidebarProps {
  tenantName: string;
  tenantSlug: string;
  userName: string;
  primaryColor: string;
}

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/dashboard/propiedades", label: "Propiedades", icon: Building2 },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/equipo", label: "Equipo", icon: UserCog },
  { href: "/dashboard/tareas", label: "Tareas", icon: CheckSquare },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/paginas", label: "Páginas", icon: FileText },
  { href: "/dashboard/herramientas", label: "Herramientas", icon: Calculator },
  { href: "/dashboard/publicaciones", label: "Publicaciones", icon: Share2 },
  { href: "/dashboard/billing", label: "Facturación", icon: CreditCard },
  { href: "/dashboard/configuracion/plantilla", label: "Plantilla", icon: Palette },
  { href: "/dashboard/configuracion", label: "Configuración", icon: Settings },
];

export function DashboardSidebar({ tenantName, tenantSlug, userName, primaryColor }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b px-5 py-4">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
          style={{ backgroundColor: primaryColor }}
        >
          {tenantName.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-foreground">{tenantName}</div>
          <div className="truncate text-xs text-muted-foreground">{userName}</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
              {active && <ChevronRight className="ml-auto h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3 space-y-1">
        <button
          onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true }))}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <span className="flex-1 text-left text-xs">Buscar...</span>
          <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">⌘K</kbd>
        </button>
        <div className="flex items-center justify-between px-3 py-1">
          <span className="text-xs text-muted-foreground">Tema</span>
          <ThemeToggle />
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          Ver mi sitio
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg border bg-card p-2 shadow-sm lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30" role="button" tabIndex={-1} aria-label="Cerrar menú" onClick={() => setIsOpen(false)} onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)} />
          <div className="relative h-full w-64 bg-card shadow-xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 rounded-lg p-1 text-muted-foreground hover:text-foreground"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      <aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
        {sidebar}
      </aside>
    </>
  );
}
