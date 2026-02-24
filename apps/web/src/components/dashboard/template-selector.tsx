"use client";

import { useState } from "react";
import { Check, Loader2, Layout, Columns3, Type } from "lucide-react";
import { toast } from "sonner";
import { TEMPLATES, type TemplateSlug } from "@/components/home/template-resolver";

interface TemplateSelectorProps {
  currentTemplate: string;
  primaryColor: string;
  secondaryColor: string;
}

const TEMPLATE_ICONS: Record<TemplateSlug, React.ReactNode> = {
  modern: <Layout className="h-8 w-8" />,
  classic: <Columns3 className="h-8 w-8" />,
  minimal: <Type className="h-8 w-8" />,
};

function TemplatePreview({ slug, primary, secondary }: { slug: TemplateSlug; primary: string; secondary: string }) {
  if (slug === "modern") {
    return (
      <div className="h-32 rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
        <div className="h-1 rounded-full mb-3" style={{ background: `linear-gradient(90deg, ${primary}, ${secondary})` }} />
        <div className="space-y-2">
          <div className="h-3 w-3/4 rounded bg-white/20" />
          <div className="h-2 w-1/2 rounded bg-white/10" />
        </div>
        <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-30 blur-xl" style={{ backgroundColor: primary }} />
      </div>
    );
  }
  if (slug === "classic") {
    return (
      <div className="h-32 rounded-lg bg-white dark:bg-slate-950 border p-4">
        <div className="h-1.5 rounded-full mb-4" style={{ background: `linear-gradient(90deg, ${primary}, ${secondary})` }} />
        <div className="flex flex-col items-center space-y-2">
          <div className="h-3 w-1/3 rounded" style={{ backgroundColor: `${primary}30` }} />
          <div className="h-4 w-3/4 rounded bg-foreground/10" />
          <div className="h-2 w-1/2 rounded bg-muted-foreground/10" />
        </div>
      </div>
    );
  }
  return (
    <div className="h-32 rounded-lg bg-background border p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: `radial-gradient(${primary} 1px, transparent 1px)`, backgroundSize: "12px 12px" }}
      />
      <div className="relative space-y-3 pt-2">
        <div className="h-2 w-1/4 rounded" style={{ backgroundColor: primary }} />
        <div className="h-5 w-2/3 rounded bg-foreground/10" />
        <div className="h-4 w-1/3 rounded bg-foreground/5" />
      </div>
    </div>
  );
}

export function TemplateSelector({ currentTemplate, primaryColor, secondaryColor }: TemplateSelectorProps) {
  const [current, setCurrent] = useState(currentTemplate);
  const [selected, setSelected] = useState(currentTemplate);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (selected === current) return;
    setSaving(true);
    try {
      const res = await fetch("/api/tenant", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateSlug: selected }),
      });
      if (!res.ok) throw new Error();
      setCurrent(selected);
      toast.success("Plantilla actualizada. Recargá tu sitio para ver los cambios.");
    } catch {
      toast.error("Error al guardar la plantilla");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {TEMPLATES.map((tpl) => {
          const isActive = selected === tpl.slug;
          return (
            <button
              key={tpl.slug}
              type="button"
              onClick={() => setSelected(tpl.slug)}
              className={`group relative rounded-xl border-2 p-4 text-left transition-all ${
                isActive
                  ? "border-primary ring-2 ring-primary/20 shadow-lg"
                  : "border-border hover:border-muted-foreground/30 hover:shadow-md"
              }`}
            >
              {isActive && (
                <div className="absolute -right-2 -top-2 rounded-full bg-primary p-1 text-white shadow-sm">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}

              <TemplatePreview slug={tpl.slug} primary={primaryColor} secondary={secondaryColor} />

              <div className="mt-4 flex items-center gap-3">
                <div className={`rounded-lg p-2 ${isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {TEMPLATE_ICONS[tpl.slug]}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{tpl.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{tpl.description}</p>
                </div>
              </div>

              {current === tpl.slug && (
                <span className="mt-3 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  Actual
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || selected === current}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {selected === current ? "Sin cambios" : "Aplicar plantilla"}
        </button>
      </div>
    </div>
  );
}
