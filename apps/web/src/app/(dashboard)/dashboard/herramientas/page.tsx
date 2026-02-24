import { TrendingUp, Percent, BarChart3, MapPin } from "lucide-react";
import Link from "next/link";
import { ICON_COLORS, type ColorKey } from "@app-inmobiliaria/ui";

const tools = [
  {
    title: "Calculadora IPC",
    description: "Calculá el ajuste de alquiler según el índice IPC del BCRA",
    icon: TrendingUp,
    href: "/dashboard/herramientas/ipc",
    color: "blue" as ColorKey,
  },
  {
    title: "Comisiones",
    description: "Calculá honorarios de venta y alquiler según normativa vigente",
    icon: Percent,
    href: "/dashboard/herramientas/comisiones",
    color: "emerald" as ColorKey,
  },
  {
    title: "Rendimiento",
    description: "Evaluá la rentabilidad de una propiedad como inversión",
    icon: BarChart3,
    href: "/dashboard/herramientas/rendimiento",
    color: "violet" as ColorKey,
  },
  {
    title: "Geocodificar propiedades",
    description: "Asigná coordenadas automáticas a tus propiedades para que aparezcan en el mapa",
    icon: MapPin,
    href: "/dashboard/herramientas/geocodificacion",
    color: "emerald" as ColorKey,
  },
];

export default function HerramientasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Herramientas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Calculadoras y utilidades para tu día a día
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const colors = ICON_COLORS[tool.color];
          return (
            <Link
              key={tool.title}
              href={tool.href}
              className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className={`mb-4 inline-flex rounded-xl p-3 ${colors.bg}`}>
                <tool.icon className={`h-6 w-6 ${colors.text}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {tool.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
