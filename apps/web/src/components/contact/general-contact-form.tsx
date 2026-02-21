"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { useId } from "react";
import type { TenantWithPlan } from "@/lib/tenant";

const contactSchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre completo"),
  email: z.string().email("Ingresá un email válido"),
  phone: z.string().optional(),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface GeneralContactFormProps {
  tenant: TenantWithPlan;
}

export function GeneralContactForm({ tenant }: GeneralContactFormProps) {
  const id = useId();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          tenantId: tenant.id,
          source: "contact-page",
        }),
      });

      if (res.ok) {
        toast.success("¡Mensaje enviado!", {
          description: "Recibimos tu consulta. Te contactaremos a la brevedad.",
        });
        reset();
      } else {
        toast.error("Error al enviar el mensaje");
      }
    } catch {
      toast.error("Error de conexión. Intentá de nuevo.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="mb-1.5 block text-sm font-medium text-foreground">
            Nombre completo *
          </label>
          <input
            id={`${id}-name`}
            {...register("name")}
            className="h-11 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="mb-1.5 block text-sm font-medium text-foreground">
            Email *
          </label>
          <input
            id={`${id}-email`}
            {...register("email")}
            type="email"
            className="h-11 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-phone`} className="mb-1.5 block text-sm font-medium text-foreground">
          Teléfono
        </label>
        <input
          id={`${id}-phone`}
          {...register("phone")}
          type="tel"
          className="h-11 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label htmlFor={`${id}-message`} className="mb-1.5 block text-sm font-medium text-foreground">
          Mensaje *
        </label>
        <textarea
          id={`${id}-message`}
          {...register("message")}
          rows={5}
          placeholder="Contanos qué estás buscando..."
          className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: tenant.primaryColor }}
      >
        <Send className="h-4 w-4" />
        {isSubmitting ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
