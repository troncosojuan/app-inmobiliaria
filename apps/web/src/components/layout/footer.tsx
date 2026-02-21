import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import type { TenantWithPlan } from "@/lib/tenant";

interface FooterProps {
  tenant: TenantWithPlan | null;
}

export function Footer({ tenant }: FooterProps) {
  const name = tenant?.name || "Inmobiliaria";
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {tenant?.logo ? (
                <Image src={tenant.logo} alt={name} width={40} height={40} className="h-10 w-auto brightness-0 invert" />
              ) : (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold text-lg"
                  style={{ backgroundColor: tenant?.primaryColor || "#1e40af" }}
                >
                  {name.charAt(0)}
                </div>
              )}
              <span className="text-xl font-bold text-white">{name}</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tu inmobiliaria de confianza. Encontrá la propiedad ideal para vos.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Navegación</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/propiedades" className="hover:text-white transition-colors">Propiedades</Link></li>
              <li><Link href="/venta" className="hover:text-white transition-colors">Venta</Link></li>
              <li><Link href="/alquiler" className="hover:text-white transition-colors">Alquiler</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Propiedades</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/propiedades?type=APARTMENT" className="hover:text-white transition-colors">Departamentos</Link></li>
              <li><Link href="/propiedades?type=HOUSE" className="hover:text-white transition-colors">Casas</Link></li>
              <li><Link href="/propiedades?type=PH" className="hover:text-white transition-colors">PH</Link></li>
              <li><Link href="/propiedades?type=OFFICE" className="hover:text-white transition-colors">Oficinas</Link></li>
              <li><Link href="/propiedades?type=LAND" className="hover:text-white transition-colors">Terrenos</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contacto</h3>
            <ul className="space-y-3 text-sm">
              {tenant?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{tenant.address}{tenant.city ? `, ${tenant.city}` : ""}</span>
                </li>
              )}
              {tenant?.phone && (
                <li>
                  <a href={`tel:${tenant.phone}`} className="flex items-center gap-2 hover:text-white transition-colors">
                    <Phone className="h-4 w-4" />
                    {tenant.phone}
                  </a>
                </li>
              )}
              {tenant?.email && (
                <li>
                  <a href={`mailto:${tenant.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                    <Mail className="h-4 w-4" />
                    {tenant.email}
                  </a>
                </li>
              )}
            </ul>
            <div className="mt-4 flex gap-3">
              {tenant?.instagram && (
                <a href={tenant.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {tenant?.facebook && (
                <a href={tenant.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-4 text-center text-xs text-muted-foreground sm:mt-10 sm:pt-6">
          <p>&copy; {year} {name}. Todos los derechos reservados.</p>
          {!(tenant?.plan as { hidePlatformBranding?: boolean })?.hidePlatformBranding && (
            <p className="mt-1">
              Powered by{" "}
              <Link href="/platform" className="text-muted-foreground hover:text-white transition-colors">
                InmoPlatform
              </Link>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
