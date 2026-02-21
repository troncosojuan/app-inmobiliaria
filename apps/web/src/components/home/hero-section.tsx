"use client";

import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { FadeUp, FadeIn } from "@/components/motion";
import type { TenantWithPlan } from "@/lib/tenant";

interface HeroSectionProps {
  tenant: TenantWithPlan;
}

export function HeroSection({ tenant }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="h-1" style={{ background: `linear-gradient(90deg, ${tenant.primaryColor}, ${tenant.secondaryColor})` }} />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-28 lg:py-36">
        <div className="max-w-3xl">
          <FadeUp delay={0.1}>
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-white"
              style={{ backgroundColor: `${tenant.primaryColor}40` }}
            >
              <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: tenant.accentColor }} />
              {tenant.city ? `Propiedades en ${tenant.city}` : "Tu próxima propiedad te espera"}
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Encontrá tu{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(135deg, ${tenant.primaryColor}, ${tenant.secondaryColor})` }}
              >
                hogar ideal
              </span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.35}>
            <p className="mt-6 text-base leading-relaxed text-slate-300 sm:text-xl">
              {tenant.name} te ayuda a encontrar la propiedad perfecta.
              Casas, departamentos, oficinas y más en las mejores ubicaciones.
            </p>
          </FadeUp>

          <FadeUp delay={0.5}>
            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
              <Link
                href="/propiedades"
                className="group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: tenant.primaryColor }}
              >
                <Search className="h-5 w-5 transition-transform group-hover:rotate-12" />
                Ver propiedades
              </Link>
              <Link
                href="/contacto"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800/50 px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-slate-700/50"
              >
                Contactanos
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </FadeUp>
        </div>

        <FadeIn delay={0.3}>
          <div
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: tenant.primaryColor }}
          />
        </FadeIn>
        <FadeIn delay={0.5}>
          <div
            className="absolute -bottom-10 right-1/4 h-48 w-48 rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: tenant.secondaryColor }}
          />
        </FadeIn>
      </div>
    </section>
  );
}
