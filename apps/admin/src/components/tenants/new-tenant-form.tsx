"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Building2, User, Palette, Loader2, Save } from "lucide-react";
import { FormInput, FormLabel, FormSelect, ICON_COLORS } from "@app-inmobiliaria/ui";

interface Plan {
  id: string;
  name: string;
  slug: string;
  price: number;
  maxProperties: number;
}

interface FormValues {
  name: string;
  slug: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  planId: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

export function NewTenantForm({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: "",
      slug: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      planId: plans[0]?.id || "",
      primaryColor: "#1e40af",
      secondaryColor: "#f59e0b",
      accentColor: "#10b981",
      adminName: "",
      adminEmail: "",
      adminPassword: "",
    },
  });

  const watchName = watch("name");
  const generateSlug = () => {
    const slug = watchName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    setValue("slug", slug);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al crear");
      }

      toast.success("Inmobiliaria creada correctamente");
      router.push("/tenants");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear");
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
            <FormLabel htmlFor="nt-name">Nombre</FormLabel>
            <FormInput
              id="nt-name"
              {...register("name", { required: true, minLength: 2 })}
              variant="default"
              onBlur={generateSlug}
            />
          </div>
          <div>
            <FormLabel htmlFor="nt-slug">Slug (URL)</FormLabel>
            <FormInput id="nt-slug" {...register("slug", { required: true })} variant="default" />
          </div>
          <div>
            <FormLabel htmlFor="nt-email">Email de contacto</FormLabel>
            <FormInput id="nt-email" type="email" {...register("email", { required: true })} variant="default" />
          </div>
          <div>
            <FormLabel htmlFor="nt-phone">Teléfono</FormLabel>
            <FormInput id="nt-phone" {...register("phone")} variant="default" />
          </div>
          <div>
            <FormLabel htmlFor="nt-city">Ciudad</FormLabel>
            <FormInput id="nt-city" {...register("city")} variant="default" />
          </div>
          <div>
            <FormLabel htmlFor="nt-state">Provincia</FormLabel>
            <FormInput id="nt-state" {...register("state")} variant="default" />
          </div>
          <div className="sm:col-span-2">
            <FormLabel htmlFor="nt-plan">Plan</FormLabel>
            <FormSelect id="nt-plan" {...register("planId", { required: true })} variant="default">
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - ${plan.price.toLocaleString("es-AR")}/mes ({plan.maxProperties === -1 ? "ilimitadas" : `${plan.maxProperties} props`})
                </option>
              ))}
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
              <FormLabel htmlFor={`nt-${color.id}`}>{color.label}</FormLabel>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id={`nt-${color.id}`}
                  {...register(color.id)}
                  className="h-10 w-12 cursor-pointer rounded-lg border border-input p-1"
                />
                <input
                  type="text"
                  value={watch(color.id)}
                  readOnly
                  className="h-10 flex-1 rounded-lg border border-input bg-muted px-3 font-mono text-sm text-muted-foreground"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className={`rounded-lg ${ICON_COLORS.emerald.bg} p-2`}>
            <User className={`h-5 w-5 ${ICON_COLORS.emerald.text}`} />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Usuario administrador</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FormLabel htmlFor="nt-admin-name">Nombre</FormLabel>
            <FormInput id="nt-admin-name" {...register("adminName")} variant="default" />
          </div>
          <div>
            <FormLabel htmlFor="nt-admin-email">Email</FormLabel>
            <FormInput id="nt-admin-email" type="email" {...register("adminEmail", { required: true })} variant="default" />
          </div>
          <div className="sm:col-span-2">
            <FormLabel htmlFor="nt-admin-pw">Contraseña</FormLabel>
            <FormInput id="nt-admin-pw" type="password" {...register("adminPassword", { required: true, minLength: 6 })} variant="default" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Crear inmobiliaria
        </button>
      </div>
    </form>
  );
}
