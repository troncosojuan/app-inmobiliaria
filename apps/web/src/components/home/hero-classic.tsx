"use client";

import Link from "next/link";
import { Search, MapPin, Home } from "lucide-react";
import { FadeUp } from "@/components/motion";
import type { TenantWithPlan } from "@/lib/tenant";

interface HeroClassicProps {
  tenant: TenantWithPlan;
}

export function HeroClassic({ tenant }: HeroClassicProps) {
  return (
    <section className="relative bg-white dark:bg-slate-950">
      <div
        className="h-1.5"
        style={{ background: `linear-gradient(90deg, ${tenant.primaryColor}, ${tenant.secondaryColor})` }}
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24 lg:py-32">
        <div className="text-center">
          <FadeUp delay={0.1}>
            <div className="mx-auto mb-6 flex items-center justify-center gap-3">
              <Home className="h-8 w-8" style={{ color: tenant.primaryColor }} />
              <span className="text-lg font-semibold text-muted-foreground tracking-widest uppercase">
                {tenant.name}
              </span>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Encontrá tu próximo hogar
            </h1>
          </FadeUp>

          <FadeUp delay={0.35}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Más de {tenant.city ? `las mejores propiedades en ${tenant.city}` : "cientos de propiedades"} esperándote.
              Casas, departamentos y más.
            </p>
          </FadeUp>

          <FadeUp delay={0.5}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/propiedades"
                className="inline-flex items-center gap-2 rounded-lg px-8 py-4 text-lg font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110"
                style={{ backgroundColor: tenant.primaryColor }}
              >
                <Search className="h-5 w-5" />
                Buscar propiedades
              </Link>
              <Link
                href="/mapa"
                className="inline-flex items-center gap-2 rounded-lg border-2 px-8 py-4 text-lg font-semibold transition-colors hover:bg-muted/50"
                style={{ borderColor: tenant.primaryColor, color: tenant.primaryColor }}
              >
                <MapPin className="h-5 w-5" />
                Ver en mapa
              </Link>
            </div>
          </FadeUp>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
    </section>
  );
}
