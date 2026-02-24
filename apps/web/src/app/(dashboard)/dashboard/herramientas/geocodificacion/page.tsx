"use client";

import { useState } from "react";
import { MapPin, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GeocodificacionPage() {
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [result, setResult] = useState<{ geocoded: number; total: number } | null>(null);

  const handleRun = async () => {
    setState("running");
    try {
      const res = await fetch("/api/properties/geocode-batch", { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data);
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/herramientas"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Herramientas
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Geocodificar propiedades</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Asigna coordenadas geográficas a todas las propiedades que aún no las tienen, para que aparezcan en el mapa.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-violet-50 dark:bg-violet-950/30 p-3">
            <MapPin className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">¿Cómo funciona?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              El sistema busca la dirección de cada propiedad en el servicio de OpenStreetMap y guarda
              las coordenadas automáticamente. El proceso respeta el límite de 1 consulta por segundo,
              por lo que puede tardar algunos minutos si hay muchas propiedades.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Las propiedades que ya tienen coordenadas no se modifican.
            </p>
          </div>
        </div>

        {state === "idle" && (
          <button
            onClick={handleRun}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
          >
            <MapPin className="h-4 w-4" />
            Iniciar geocodificación
          </button>
        )}

        {state === "running" && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span>Geocodificando propiedades… esto puede tardar varios minutos. No cierres esta página.</span>
          </div>
        )}

        {state === "done" && result && (
          <div className="flex items-start gap-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 px-4 py-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                Geocodificación completada
              </p>
              <p className="mt-0.5 text-sm text-green-700 dark:text-green-300">
                {result.geocoded} de {result.total} propiedades geocodificadas correctamente.
                {result.total - result.geocoded > 0 && ` ${result.total - result.geocoded} no pudieron geocodificarse (dirección no encontrada).`}
              </p>
              {result.geocoded > 0 && (
                <Link
                  href="/mapa"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-300 underline underline-offset-2"
                >
                  Ver en el mapa →
                </Link>
              )}
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="flex items-start gap-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-4 py-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800 dark:text-red-200">Error al geocodificar</p>
              <p className="mt-0.5 text-sm text-red-700 dark:text-red-300">
                Ocurrió un error durante el proceso. Intentá de nuevo en unos minutos.
              </p>
              <button
                onClick={() => setState("idle")}
                className="mt-2 text-xs font-medium text-red-700 dark:text-red-300 underline underline-offset-2"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
