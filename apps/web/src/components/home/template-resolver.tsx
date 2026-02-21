import type { TenantWithPlan } from "@/lib/tenant";
import { HeroSection } from "./hero-section";
import { HeroClassic } from "./hero-classic";
import { HeroMinimal } from "./hero-minimal";

export type TemplateSlug = "modern" | "classic" | "minimal";

interface TemplateResolverProps {
  tenant: TenantWithPlan;
  templateSlug: string;
}

export function HeroResolver({ tenant, templateSlug }: TemplateResolverProps) {
  switch (templateSlug) {
    case "classic":
      return <HeroClassic tenant={tenant} />;
    case "minimal":
      return <HeroMinimal tenant={tenant} />;
    case "modern":
    default:
      return <HeroSection tenant={tenant} />;
  }
}

export const TEMPLATES: { slug: TemplateSlug; name: string; description: string }[] = [
  {
    slug: "modern",
    name: "Moderno",
    description: "Diseño oscuro con gradientes y efectos de luz. Ideal para inmobiliarias premium.",
  },
  {
    slug: "classic",
    name: "Clásico",
    description: "Diseño limpio y centrado. Perfecto para una imagen profesional y sobria.",
  },
  {
    slug: "minimal",
    name: "Minimalista",
    description: "Tipografía grande y espaciado generoso. Para quienes buscan simplicidad.",
  },
];
