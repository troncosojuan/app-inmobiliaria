"use client";

import { useState } from "react";
import { Bell, BellRing, Loader2, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface SearchAlertButtonProps {
  tenantId: string;
  filters: Record<string, string | undefined>;
}

export function SearchAlertButton({ tenantId, filters }: SearchAlertButtonProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSaving(true);

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId,
          email,
          filters: Object.fromEntries(
            Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")
          ),
        }),
      });

      if (res.ok) {
        setSuccess(true);
        toast.success("¡Alerta creada! Te avisaremos cuando haya propiedades nuevas.");
      } else {
        const data = await res.json();
        toast.error(data.error || "Error al crear alerta");
      }
    } catch {
      toast.error("Error de conexión");
    }
    setSaving(false);
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
        Alerta activa: te avisaremos por email.
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-input bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Bell className="h-4 w-4" />
        Avisarme cuando haya propiedades
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border bg-card p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Crear alerta</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mb-3 text-xs text-muted-foreground">
            Recibí un email cuando se publique una propiedad que coincida con tu búsqueda actual.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="h-10 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={saving}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
              Activar alerta
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
