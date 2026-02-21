"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeUp } from "@/components/motion";
import type { TenantWithPlan } from "@/lib/tenant";

interface HeroMinimalProps {
  tenant: TenantWithPlan;
}

export function HeroMinimal({ tenant }: HeroMinimalProps) {
  return (
    <section className="relative min-h-[60vh] flex items-center">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(${tenant.primaryColor} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 py-20 sm:py-32">
        <FadeUp delay={0.15}>
          <p
            className="mb-4 text-sm font-semibold uppercase tracking-[0.2em]"
            style={{ color: tenant.primaryColor }}
          >
            {tenant.name}
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <h1 className="text-5xl font-light tracking-tight text-foreground sm:text-7xl lg:text-8xl">
            Propiedades
            <br />
            <span className="font-bold" style={{ color: tenant.primaryColor }}>
              que inspiran.
            </span>
          </h1>
        </FadeUp>

        <FadeUp delay={0.5}>
          <div className="mt-12">
            <Link
              href="/propiedades"
              className="group inline-flex items-center gap-3 text-lg font-medium transition-colors hover:opacity-80"
              style={{ color: tenant.primaryColor }}
            >
              Explorar propiedades
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Link>
            <div
              className="mt-1 h-0.5 w-40 transition-all group-hover:w-48"
              style={{ backgroundColor: tenant.primaryColor }}
            />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
