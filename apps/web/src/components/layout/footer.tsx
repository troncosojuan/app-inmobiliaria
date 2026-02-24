import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import type { TenantWithPlan } from "@/lib/tenant";

interface FooterProps {
  tenant: TenantWithPlan | null;
  templateSlug?: string;
}

export function Footer({ tenant, templateSlug = "modern" }: FooterProps) {
  const name = tenant?.name || "Inmobiliaria";
  const year = new Date().getFullYear();
  const isClassic = templateSlug === "classic";
  const isMinimal = templateSlug === "minimal";
  const isModern = !isClassic && !isMinimal;

  const footerClass = isModern
    ? "border-t bg-slate-900 text-slate-300"
    : isClassic
      ? "border-t bg-slate-50 text-slate-600"
      : "border-t bg-background text-muted-foreground";
  const headingClass = isModern ? "text-white" : "text-foreground";
  const linkClass = isModern ? "hover:text-white" : "hover:text-foreground";
  const mutedTextClass = isModern ? "text-muted-foreground" : "text-slate-500";
  const iconButtonClass = isModern
    ? "bg-slate-800 hover:bg-slate-700 text-white"
    : "bg-muted hover:bg-muted/70 text-foreground";

  return (
    <footer className={footerClass}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {tenant?.logo ? (
                <Image
                  src={tenant.logo}
                  alt={name}
                  width={40}
                  height={40}
                  className={`h-10 w-auto ${isModern ? "brightness-0 invert" : ""}`}
                />
              ) : (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold text-lg"
                  style={{ backgroundColor: tenant?.primaryColor || "#1e40af" }}
                >
                  {name.charAt(0)}
                </div>
              )}
              <span className={`text-xl font-bold ${headingClass}`}>{name}</span>
            </div>
            <p className={`text-sm leading-relaxed ${mutedTextClass}`}>
              Tu inmobiliaria de confianza. Encontrá la propiedad ideal para vos.
            </p>
          </div>

          <div>
            <h3 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${headingClass}`}>Navegación</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className={`${linkClass} transition-colors`}>Inicio</Link></li>
              <li><Link href="/propiedades" className={`${linkClass} transition-colors`}>Propiedades</Link></li>
              <li><Link href="/venta" className={`${linkClass} transition-colors`}>Venta</Link></li>
              <li><Link href="/alquiler" className={`${linkClass} transition-colors`}>Alquiler</Link></li>
              <li><Link href="/contacto" className={`${linkClass} transition-colors`}>Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h3 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${headingClass}`}>Propiedades</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/propiedades?type=APARTMENT" className={`${linkClass} transition-colors`}>Departamentos</Link></li>
              <li><Link href="/propiedades?type=HOUSE" className={`${linkClass} transition-colors`}>Casas</Link></li>
              <li><Link href="/propiedades?type=PH" className={`${linkClass} transition-colors`}>PH</Link></li>
              <li><Link href="/propiedades?type=OFFICE" className={`${linkClass} transition-colors`}>Oficinas</Link></li>
              <li><Link href="/propiedades?type=LAND" className={`${linkClass} transition-colors`}>Terrenos</Link></li>
            </ul>
          </div>

          <div>
            <h3 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${headingClass}`}>Contacto</h3>
            <ul className="space-y-3 text-sm">
              {tenant?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{tenant.address}{tenant.city ? `, ${tenant.city}` : ""}</span>
                </li>
              )}
              {tenant?.phone && (
                <li>
                  <a href={`tel:${tenant.phone}`} className={`flex items-center gap-2 ${linkClass} transition-colors`}>
                    <Phone className="h-4 w-4" />
                    {tenant.phone}
                  </a>
                </li>
              )}
              {tenant?.email && (
                <li>
                  <a href={`mailto:${tenant.email}`} className={`flex items-center gap-2 ${linkClass} transition-colors`}>
                    <Mail className="h-4 w-4" />
                    {tenant.email}
                  </a>
                </li>
              )}
            </ul>
            <div className="mt-4 flex gap-3">
              {tenant?.instagram && (
                <a
                  href={tenant.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${iconButtonClass}`}
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {tenant?.facebook && (
                <a
                  href={tenant.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${iconButtonClass}`}
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className={`mt-8 border-t ${isModern ? "border-slate-800" : "border-border"} pt-4 text-center text-xs ${mutedTextClass} sm:mt-10 sm:pt-6`}>
          <p>&copy; {year} {name}. Todos los derechos reservados.</p>
          {!(tenant?.plan as { hidePlatformBranding?: boolean })?.hidePlatformBranding && (
            <p className="mt-1">
              Powered by{" "}
              <Link href="/platform" className={`${isModern ? "text-muted-foreground hover:text-white" : linkClass} transition-colors`}>
                InmoPlatform
              </Link>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
