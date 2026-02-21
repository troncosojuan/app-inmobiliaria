"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Building2, Users, FileText, Settings,
  CreditCard, MessageSquare, BarChart3, Boxes,
} from "lucide-react";
import { ThemeToggle } from "@app-inmobiliaria/ui";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tenants", label: "Inmobiliarias", icon: Building2 },
  { href: "/properties", label: "Propiedades", icon: Boxes },
  { href: "/users", label: "Usuarios", icon: Users },
  { href: "/leads", label: "Consultas", icon: MessageSquare },
  { href: "/plans", label: "Planes", icon: CreditCard },
  { href: "/analytics", label: "Analíticas", icon: BarChart3 },
  { href: "/pages", label: "Páginas", icon: FileText },
  { href: "/settings", label: "Configuración", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            PI
          </div>
          <span className="text-sm font-bold text-foreground">Plataforma Inmobiliaria</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3 space-y-1">
        <div className="flex items-center justify-between px-3 py-1">
          <span className="text-xs text-muted-foreground">Tema</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            A
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-foreground">Admin</div>
            <div className="truncate text-xs text-muted-foreground">admin@platform.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
