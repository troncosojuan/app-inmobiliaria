"use client";

import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/motion";
import type { TenantWithPlan } from "@/lib/tenant";

interface CTASectionProps {
  tenant: TenantWithPlan;
}

export function CTASection({ tenant }: CTASectionProps) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <ScrollReveal>
          <div
            className="relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-16"
            style={{
              background: `linear-gradient(135deg, ${tenant.primaryColor}, ${tenant.primaryColor}dd)`,
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                }}
              />
            </div>

            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                ¿Buscás vender o alquilar tu propiedad?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
                Dejá tu propiedad en las mejores manos. Nuestro equipo de profesionales
                te asesora en todo el proceso.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/contacto"
                  className="group inline-flex items-center gap-2 rounded-xl bg-card px-6 py-3.5 text-base font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  style={{ color: tenant.primaryColor }}
                >
                  Contactanos
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                {tenant.phone && (
                  <a
                    href={`tel:${tenant.phone}`}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-card/10 active:scale-[0.98]"
                  >
                    <Phone className="h-4 w-4" />
                    {tenant.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
