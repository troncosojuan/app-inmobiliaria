import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "InmoPlatform - El sistema operativo para inmobiliarias argentinas",
  description:
    "Creá tu sitio web inmobiliario profesional en minutos. CRM, analytics, leads, búsqueda por mapa y más. Planes desde gratis.",
  openGraph: {
    title: "InmoPlatform - El sistema operativo para inmobiliarias argentinas",
    description:
      "Creá tu sitio web inmobiliario profesional en minutos. CRM, analytics, leads, búsqueda por mapa y más.",
    type: "website",
  },
};

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      {children}
    </div>
  );
}
