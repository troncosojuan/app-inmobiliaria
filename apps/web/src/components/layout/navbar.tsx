"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, Mail, Heart } from "lucide-react";
import { FavoritesNavIndicator } from "@/components/properties/favorites-nav-indicator";
import type { TenantWithPlan } from "@/lib/tenant";

interface NavPage {
  id: string;
  title: string;
  slug: string;
}

interface NavbarProps {
  tenant: TenantWithPlan | null;
  customPages?: NavPage[];
}

const EMPTY_PAGES: NavPage[] = [];

export function Navbar({ tenant, customPages = EMPTY_PAGES }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const name = tenant?.name || "Inmobiliaria";

  return (
    <header className="sticky top-0 z-50 w-full">
      {tenant && (
        <div className="hidden border-b bg-slate-900 text-white sm:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs">
            <div className="flex items-center gap-4">
              {tenant.phone && (
                <a href={`tel:${tenant.phone}`} className="flex items-center gap-1 hover:text-blue-300 transition-colors">
                  <Phone className="h-3 w-3" />
                  {tenant.phone}
                </a>
              )}
              {tenant.email && (
                <a href={`mailto:${tenant.email}`} className="flex items-center gap-1 hover:text-blue-300 transition-colors">
                  <Mail className="h-3 w-3" />
                  {tenant.email}
                </a>
              )}
            </div>
            {tenant.address && (
              <span className="text-muted-foreground">{tenant.address}, {tenant.city}</span>
            )}
          </div>
        </div>
      )}

      <nav className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            {tenant?.logo ? (
              <Image src={tenant.logo} alt={name} width={40} height={40} className="h-10 w-auto" />
            ) : (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold text-lg"
                style={{ backgroundColor: tenant?.primaryColor || "#1e40af" }}
              >
                {name.charAt(0)}
              </div>
            )}
            <span className="text-base font-bold text-foreground sm:text-xl">{name}</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <NavLink href="/">Inicio</NavLink>
            <NavLink href="/propiedades">Propiedades</NavLink>
            <NavLink href="/venta">Venta</NavLink>
            <NavLink href="/alquiler">Alquiler</NavLink>
            <NavLink href="/mapa">Mapa</NavLink>
            {customPages.map((p) => (
              <NavLink key={p.id} href={`/${p.slug}`}>{p.title}</NavLink>
            ))}
            <NavLink href="/contacto">Contacto</NavLink>
            <FavoritesNavIndicator />
            {tenant?.whatsapp && (
              <a
                href={`https://wa.me/${tenant.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: "#25D366" }}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-foreground hover:bg-muted md:hidden"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="border-t bg-card md:hidden">
            <div className="space-y-1 px-4 py-3">
              <MobileNavLink href="/" onClick={() => setIsOpen(false)}>Inicio</MobileNavLink>
              <MobileNavLink href="/propiedades" onClick={() => setIsOpen(false)}>Propiedades</MobileNavLink>
              <MobileNavLink href="/venta" onClick={() => setIsOpen(false)}>Venta</MobileNavLink>
              <MobileNavLink href="/alquiler" onClick={() => setIsOpen(false)}>Alquiler</MobileNavLink>
              <MobileNavLink href="/mapa" onClick={() => setIsOpen(false)}>Mapa</MobileNavLink>
              {customPages.map((p) => (
                <MobileNavLink key={p.id} href={`/${p.slug}`} onClick={() => setIsOpen(false)}>{p.title}</MobileNavLink>
              ))}
              <MobileNavLink href="/contacto" onClick={() => setIsOpen(false)}>Contacto</MobileNavLink>
              <MobileNavLink href="/favoritos" onClick={() => setIsOpen(false)}>
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Favoritos
                </span>
              </MobileNavLink>
              {tenant?.whatsapp && (
                <a
                  href={`https://wa.me/${tenant.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: "#25D366" }}
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="block rounded-lg px-3 py-2.5 text-base font-medium text-foreground hover:bg-muted">
      {children}
    </Link>
  );
}
