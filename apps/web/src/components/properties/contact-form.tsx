"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send, Phone, MessageCircle } from "lucide-react";
import { useId } from "react";
import type { TenantWithPlan } from "@/lib/tenant";
import type { Property } from "@app-inmobiliaria/db";

const contactSchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre"),
  email: z.string().email("Ingresá un email válido"),
  phone: z.string().optional(),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  property: Property;
  tenant: TenantWithPlan;
}

export function ContactForm({ property, tenant }: ContactFormProps) {
  const formId = useId();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      message: `Hola, estoy interesado/a en "${property.title}". Me gustaría recibir más información.`,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          propertyId: property.id,
          tenantId: property.tenantId,
        }),
      });

      if (res.ok) {
        toast.success("¡Consulta enviada!", {
          description: "Te contactaremos a la brevedad.",
        });
        reset();
      } else {
        toast.error("Error al enviar la consulta");
      }
    } catch {
      toast.error("Error de conexión. Intentá de nuevo.");
    }
  };

  const whatsappUrl = tenant.whatsapp
    ? `https://wa.me/${tenant.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `Hola! Estoy interesado en: ${property.title}`
      )}`
    : null;

  return (
    <div className="space-y-4">
        <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-5">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Consultar por esta propiedad</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label htmlFor={`${formId}-name`} className="sr-only">Nombre</label>
            <input
              id={`${formId}-name`}
              {...register("name")}
              placeholder="Tu nombre *"
              className="h-10 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor={`${formId}-email`} className="sr-only">Email</label>
            <input
              id={`${formId}-email`}
              {...register("email")}
              type="email"
              placeholder="Tu email *"
              className="h-10 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor={`${formId}-phone`} className="sr-only">Teléfono</label>
            <input
              id={`${formId}-phone`}
              {...register("phone")}
              type="tel"
              placeholder="Tu teléfono"
              className="h-10 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor={`${formId}-message`} className="sr-only">Mensaje</label>
            <textarea
              id={`${formId}-message`}
              {...register("message")}
              rows={4}
              placeholder="Mensaje"
              className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: tenant.primaryColor }}
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Enviando..." : "Enviar consulta"}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        {tenant.phone && (
          <a
            href={`tel:${tenant.phone}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Phone className="h-4 w-4" />
            Llamar
          </a>
        )}
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
