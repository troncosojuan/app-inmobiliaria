"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Settings, Palette, Phone, Globe, Crown, Save, Loader2, ExternalLink,
  Link2, CheckCircle2, AlertCircle, XCircle,
} from "lucide-react";
import { FormInput, FormLabel, ICON_COLORS } from "@app-inmobiliaria/ui";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { toast } from "sonner";
import type { TenantBase } from "@app-inmobiliaria/types";

interface TenantConfigFormProps {
  tenant: TenantBase;
}

export function TenantConfigForm({ tenant }: TenantConfigFormProps) {
  const { submit, isSubmitting: isSaving } = useFormSubmit({
    url: "/api/tenant",
    method: "PATCH",
    successMessage: "Configuración guardada",
  });

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      name: tenant.name,
      primaryColor: tenant.primaryColor,
      secondaryColor: tenant.secondaryColor,
      accentColor: tenant.accentColor,
      email: tenant.email,
      phone: tenant.phone || "",
      whatsapp: tenant.whatsapp || "",
      address: tenant.address || "",
      city: tenant.city || "",
      state: tenant.state || "",
      instagram: tenant.instagram || "",
      facebook: tenant.facebook || "",
    },
  });

  const watchPrimary = watch("primaryColor");
  const watchSecondary = watch("secondaryColor");
  const watchAccent = watch("accentColor");

  const plan = tenant.plan;

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className={`rounded-lg ${ICON_COLORS.blue.bg} p-2`}>
            <Settings className={`h-5 w-5 ${ICON_COLORS.blue.text}`} />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Identidad</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FormLabel htmlFor="cfg-name">Nombre de la inmobiliaria</FormLabel>
            <FormInput id="cfg-name" {...register("name")} />
          </div>
          <div>
            <FormLabel>Slug (URL)</FormLabel>
            <div className="flex h-10 items-center rounded-lg border border-input bg-muted/50 px-3 text-sm text-muted-foreground">
              {tenant.slug}.tudominio.com
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className={`rounded-lg ${ICON_COLORS.violet.bg} p-2`}>
            <Palette className={`h-5 w-5 ${ICON_COLORS.violet.text}`} />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Colores del sitio</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {([
            { id: "primaryColor", label: "Color primario", watch: watchPrimary },
            { id: "secondaryColor", label: "Color secundario", watch: watchSecondary },
            { id: "accentColor", label: "Color acento", watch: watchAccent },
          ] as const).map((color) => (
            <div key={color.id}>
              <FormLabel htmlFor={`cfg-${color.id}`}>{color.label}</FormLabel>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id={`cfg-${color.id}`}
                  {...register(color.id)}
                  className="h-10 w-12 cursor-pointer rounded-lg border border-input p-1"
                />
                <FormInput
                  type="text"
                  value={color.watch}
                  readOnly
                  variant="muted"
                  className="flex-1 font-mono text-muted-foreground"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-10 flex-1 rounded-lg" style={{ backgroundColor: watchPrimary }} />
          <div className="h-10 flex-1 rounded-lg" style={{ backgroundColor: watchSecondary }} />
          <div className="h-10 flex-1 rounded-lg" style={{ backgroundColor: watchAccent }} />
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className={`rounded-lg ${ICON_COLORS.emerald.bg} p-2`}>
            <Phone className={`h-5 w-5 ${ICON_COLORS.emerald.text}`} />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Contacto</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FormLabel htmlFor="cfg-email">Email</FormLabel>
            <FormInput id="cfg-email" type="email" {...register("email")} />
          </div>
          <div>
            <FormLabel htmlFor="cfg-phone">Teléfono</FormLabel>
            <FormInput id="cfg-phone" {...register("phone")} placeholder="+54 11 1234-5678" />
          </div>
          <div>
            <FormLabel htmlFor="cfg-whatsapp">WhatsApp</FormLabel>
            <FormInput id="cfg-whatsapp" {...register("whatsapp")} placeholder="+5411123456789" />
          </div>
          <div>
            <FormLabel htmlFor="cfg-address">Dirección</FormLabel>
            <FormInput id="cfg-address" {...register("address")} />
          </div>
          <div>
            <FormLabel htmlFor="cfg-city">Ciudad</FormLabel>
            <FormInput id="cfg-city" {...register("city")} />
          </div>
          <div>
            <FormLabel htmlFor="cfg-state">Provincia</FormLabel>
            <FormInput id="cfg-state" {...register("state")} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className={`rounded-lg ${ICON_COLORS.pink.bg} p-2`}>
            <Globe className={`h-5 w-5 ${ICON_COLORS.pink.text}`} />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Redes sociales</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FormLabel htmlFor="cfg-ig">Instagram</FormLabel>
            <FormInput id="cfg-ig" {...register("instagram")} placeholder="https://instagram.com/tu_inmobiliaria" />
          </div>
          <div>
            <FormLabel htmlFor="cfg-fb">Facebook</FormLabel>
            <FormInput id="cfg-fb" {...register("facebook")} placeholder="https://facebook.com/tu_inmobiliaria" />
          </div>
        </div>
      </div>

      <CustomDomainSection
        currentDomain={tenant.customDomain}
        enabled={tenant.plan.customDomain}
      />

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className={`rounded-lg ${ICON_COLORS.amber.bg} p-2`}>
            <Crown className={`h-5 w-5 ${ICON_COLORS.amber.text}`} />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Mi plan</h2>
        </div>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex justify-between rounded-lg bg-muted/50 px-4 py-3">
              <span className="text-muted-foreground">Plan actual</span>
              <span className="font-semibold text-foreground">{plan.name}</span>
            </div>
            <div className="flex justify-between rounded-lg bg-muted/50 px-4 py-3">
              <span className="text-muted-foreground">Propiedades</span>
              <span className="text-foreground">
                {plan.maxProperties === -1 ? "Ilimitadas" : `Hasta ${plan.maxProperties}`}
              </span>
            </div>
            <div className="flex justify-between rounded-lg bg-muted/50 px-4 py-3">
              <span className="text-muted-foreground">Usuarios</span>
              <span className="text-foreground">
                {plan.maxUsers === -1 ? "Ilimitados" : `Hasta ${plan.maxUsers}`}
              </span>
            </div>
            <div className="flex justify-between rounded-lg bg-muted/50 px-4 py-3">
              <span className="text-muted-foreground">Dominio personalizado</span>
              <span className="text-foreground">{plan.customDomain ? "Incluido" : "No incluido"}</span>
            </div>
            <div className="flex justify-between rounded-lg bg-muted/50 px-4 py-3">
              <span className="text-muted-foreground">Analytics</span>
              <span className="text-foreground">{plan.analytics ? "Incluido" : "No incluido"}</span>
            </div>
            <div className="flex justify-between rounded-lg bg-muted/50 px-4 py-3">
              <span className="text-muted-foreground">CRM avanzado</span>
              <span className="text-foreground">{plan.crm ? "Incluido" : "No incluido"}</span>
            </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ExternalLink className="h-4 w-4" /> Ver mi sitio web
        </a>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar cambios
        </button>
      </div>
    </form>
  );
}

function CustomDomainSection({ currentDomain, enabled }: { currentDomain: string | null; enabled: boolean }) {
  const [domain, setDomain] = useState(currentDomain || "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "verified" | "unverified" | "error">("idle");

  async function handleSave() {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/tenant/domain", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Error al guardar dominio");
        setStatus("error");
      } else {
        toast.success("Dominio actualizado");
        setStatus(data.dnsVerified ? "verified" : "unverified");
      }
    } catch {
      toast.error("Error de conexión");
      setStatus("error");
    }
    setSaving(false);
  }

  if (!enabled) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm opacity-60">
        <div className="mb-5 flex items-center gap-3">
          <div className={`rounded-lg ${ICON_COLORS.cyan.bg} p-2`}>
            <Link2 className={`h-5 w-5 ${ICON_COLORS.cyan.text}`} />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Dominio personalizado</h2>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Plan superior requerido
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Mejorá tu plan para conectar tu propio dominio (ej: www.tuinmobiliaria.com.ar).
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className={`rounded-lg ${ICON_COLORS.cyan.bg} p-2`}>
          <Link2 className={`h-5 w-5 ${ICON_COLORS.cyan.text}`} />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Dominio personalizado</h2>
      </div>

      <div className="space-y-4">
        <div>
          <FormLabel htmlFor="custom-domain">Tu dominio</FormLabel>
          <div className="flex gap-2">
            <FormInput
              id="custom-domain"
              value={domain}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDomain(e.target.value)}
              placeholder="www.tuinmobiliaria.com.ar"
              className="flex-1"
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Guardar
            </button>
          </div>
        </div>

        {status === "verified" && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            DNS verificado correctamente. Tu dominio está activo.
          </div>
        )}
        {status === "unverified" && (
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Dominio guardado pero el DNS aún no apunta correctamente. Configurá el CNAME como se indica abajo.
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
            <XCircle className="h-4 w-4 shrink-0" />
            Error al verificar el dominio. Revisá que sea válido.
          </div>
        )}

        <div className="rounded-lg bg-muted/50 p-4 text-sm">
          <p className="mb-2 font-medium text-foreground">Instrucciones de configuración DNS:</p>
          <ol className="list-inside list-decimal space-y-1 text-muted-foreground">
            <li>Ingresá al panel de tu proveedor de dominio (ej: NIC Argentina, GoDaddy, Namecheap)</li>
            <li>Creá un registro <strong>CNAME</strong> apuntando tu dominio a <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">app.inmoplatform.com</code></li>
            <li>Esperá hasta 24hs para la propagación DNS</li>
            <li>Volvé acá y guardá para verificar</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
