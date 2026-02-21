"use client";

import { Building2, Users, MapPin, Award } from "lucide-react";
import { ScrollReveal, AnimatedCounter, StaggerList, StaggerItem } from "@/components/motion";
import type { TenantWithPlan } from "@/lib/tenant";

interface StatsSectionProps {
  tenant: TenantWithPlan;
}

const stats = [
  { icon: Building2, value: 500, label: "Propiedades", suffix: "+" },
  { icon: Users, value: 1200, label: "Clientes satisfechos", suffix: "+" },
  { icon: MapPin, value: 50, label: "Barrios", suffix: "+" },
  { icon: Award, value: 15, label: "Años de experiencia", suffix: "+" },
];

export function StatsSection({ tenant }: StatsSectionProps) {
  return (
    <section className="bg-muted/50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <StaggerList className="grid grid-cols-2 gap-8 lg:grid-cols-4" slow>
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <ScrollReveal>
                <div className="text-center">
                  <div
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform hover:scale-110"
                    style={{ backgroundColor: `${tenant.primaryColor}15` }}
                  >
                    <stat.icon className="h-7 w-7" style={{ color: tenant.primaryColor }} />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2} />
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </ScrollReveal>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}
