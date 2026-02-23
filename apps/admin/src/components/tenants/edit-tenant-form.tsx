"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Building2, Palette, Loader2, Save } from "lucide-react";
import { FormInput, FormLabel, FormSelect, ICON_COLORS } from "@app-inmobiliaria/ui";

interface Plan {
  id: string;
  name: string;
  slug: string;
  price: number;
  maxProperties: number;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  planId: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  isActive: boolean;
}

interface FormValues {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  planId: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  isActive: string;
}

export function EditTenantForm({ tenant, plans }: { tenant: Tenant; plans: Plan[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone || "",
      city: tenant.city || "",
      state: tenant.state || "",
      planId: tenant.planId,
      primaryColor: tenant.primaryColor,
      secondaryColor: tenant.secondaryColor,
      accentColor: tenant.accentColor,
      isActive: tenant.isActive ? "true" : "false",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/tenants/${tenant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          isActive: data.isActive === "true",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al guardar");
      }

      toast.success("Inmobiliaria actualizada");
      router.push("/tenants");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Datos de la inmobiliaria</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FormLabel htmlFor="et-name">Nombre</FormLabel>
            <FormInput id="et-name" {...register("name", { required: true })} variant="default" />
          </div>
          <div>
            <FormLabel htmlFor="et-slug">Slug (URL)</FormLabel>
            <FormInput id="et-slug" value={tenant.slug} disabled variant="default" className="opacity-60" />
            <p className="mt-1 text-xs text-muted-foreground">El slug no se puede modificar</p>
          </div>
          <div>
            <FormLabel htmlFor="et-email">Email de contacto</FormLabel>
            <FormInput id="et-email" type="email" {...register("email", { required: true })} variant="default" />
          </div>
          <div>
            <FormLabel htmlFor="et-phone">Teléfono</FormLabel>
            <FormInput id="et-phone" {...register("phone")} variant="default" />
          </div>
          <div>
            <FormLabel htmlFor="et-city">Ciudad</FormLabel>
            <FormInput id="et-city" {...register("city")} variant="default" />
          </div>
          <div>
            <FormLabel htmlFor="et-state">Provincia</FormLabel>
            <FormInput id="et-state" {...register("state")} variant="default" />
          </div>
          <div>
            <FormLabel htmlFor="et-plan">Plan</FormLabel>
            <FormSelect id="et-plan" {...register("planId")} variant="default">
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} — ${plan.price.toLocaleString("es-AR")}/mes
                </option>
              ))}
            </FormSelect>
          </div>
          <div>
            <FormLabel htmlFor="et-active">Estado</FormLabel>
            <FormSelect id="et-active" {...register("isActive")} variant="default">
              <option value="true">Activa</option>
              <option value="false">Inactiva</option>
            </FormSelect>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className={`rounded-lg ${ICON_COLORS.violet.bg} p-2`}>
            <Palette className={`h-5 w-5 ${ICON_COLORS.violet.text}`} />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Colores de marca</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { id: "primaryColor" as const, label: "Primario" },
            { id: "secondaryColor" as const, label: "Secundario" },
            { id: "accentColor" as const, label: "Acento" },
          ].map((color) => (
            <div key={color.id}>
              <FormLabel htmlFor={`et-${color.id}-text`}>{color.label}</FormLabel>
              <div className="flex items-center gap-2">
                <label
                  htmlFor={`et-${color.id}`}
                  className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-input overflow-hidden"
                  style={{ backgroundColor: watch(color.id) }}
                >
                  <input
                    type="color"
                    id={`et-${color.id}`}
                    {...register(color.id)}
                    className="sr-only"
                  />
                </label>
                <input
                  id={`et-${color.id}-text`}
                  type="text"
                  value={watch(color.id)}
                  onChange={(e) => setValue(color.id, e.target.value)}
                  onBlur={(e) => {
                    if (!/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                      setValue(color.id, watch(color.id));
                    }
                  }}
                  placeholder="#000000"
                  className="h-10 flex-1 rounded-lg border border-input bg-background px-3 font-mono text-sm"
                  maxLength={7}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar cambios
        </button>
      </div>
    </form>
  );
}
