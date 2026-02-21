"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Save, Trash2, Upload, GripVertical } from "lucide-react";
import {
  PROPERTY_TYPE_LABELS, OPERATION_TYPE_LABELS, ARGENTINA_PROVINCES,
} from "@app-inmobiliaria/types";
import { FormInput, FormLabel, FormSelect, FormTextarea, FormSection } from "@app-inmobiliaria/ui";
import Image from "next/image";
import { useFormSubmit } from "@/hooks/use-form-submit";

import type { PropertyBase } from "@app-inmobiliaria/types";

interface PropertyEditFormProps {
  property: PropertyBase & { _count?: { leads: number } };
}

export function PropertyEditForm({ property }: PropertyEditFormProps) {
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imageOrder, setImageOrder] = useState(() => property.images.map((img) => img.id));
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const reorderedImages = imageOrder
    .map((id) => property.images.find((img) => img.id === id))
    .filter(Boolean) as typeof property.images;

  const handleReorderDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    setImageOrder((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
    setDragIdx(null);
  };

  const { submit: saveProperty, isSubmitting: isSaving } = useFormSubmit({
    url: `/api/properties/${property.id}`,
    method: "PATCH",
    successMessage: "Propiedad actualizada",
    redirect: "/dashboard/propiedades",
    transform: (data) => {
      const d = data as Record<string, unknown>;
      const amenities = typeof d.amenities === "string"
        ? d.amenities.split(",").map((a: string) => a.trim()).filter(Boolean)
        : [];
      return { ...d, amenities };
    },
  });

  const { submit: deleteProperty, isSubmitting: isDeleting } = useFormSubmit({
    url: `/api/properties/${property.id}`,
    method: "DELETE",
    successMessage: "Propiedad eliminada",
    redirect: "/dashboard/propiedades",
  });

  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: property.title,
      description: property.description || "",
      type: property.type,
      operation: property.operation,
      price: property.price,
      currency: property.currency,
      expenses: property.expenses || undefined,
      address: property.address,
      city: property.city,
      state: property.state,
      neighborhood: property.neighborhood || "",
      totalArea: property.totalArea || undefined,
      coveredArea: property.coveredArea || undefined,
      rooms: property.rooms || undefined,
      bedrooms: property.bedrooms || undefined,
      bathrooms: property.bathrooms || undefined,
      garages: property.garages || undefined,
      floor: property.floor || undefined,
      yearBuilt: property.yearBuilt || undefined,
      amenities: (property.amenities || []).join(", "),
      status: property.status,
      isFeatured: property.isFeatured,
      metaTitle: property.metaTitle || "",
      metaDescription: property.metaDescription || "",
      virtualTourUrl: property.virtualTourUrl || "",
    },
  });

  const onSubmit = async (data: Record<string, unknown>) => {
    await saveProperty(data);

    const orderChanged = imageOrder.some((id, i) => property.images[i]?.id !== id);
    if (orderChanged) {
      await fetch(`/api/properties/${property.id}/images/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageIds: imageOrder }),
      });
    }

    if (newImages.length > 0) {
      const formData = new FormData();
      formData.append("propertyId", property.id);
      formData.append("startOrder", String(property.images.length));
      newImages.forEach((img) => formData.append("files", img));
      await fetch("/api/upload", { method: "POST", body: formData });
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Seguro que querés eliminar esta propiedad? Esta acción no se puede deshacer.")) return;
    await deleteProperty({});
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSection title="Datos básicos">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormLabel htmlFor="edit-title">Título</FormLabel>
            <FormInput id="edit-title" {...register("title")} />
          </div>
          <div className="sm:col-span-2">
            <FormLabel htmlFor="edit-desc">Descripción</FormLabel>
            <FormTextarea id="edit-desc" {...register("description")} rows={4} />
          </div>
          <div>
            <FormLabel htmlFor="edit-type">Tipo</FormLabel>
            <FormSelect id="edit-type" {...register("type")}>
              {Object.entries(PROPERTY_TYPE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </FormSelect>
          </div>
          <div>
            <FormLabel htmlFor="edit-op">Operación</FormLabel>
            <FormSelect id="edit-op" {...register("operation")}>
              {Object.entries(OPERATION_TYPE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </FormSelect>
          </div>
          <div>
            <FormLabel htmlFor="edit-price">Precio</FormLabel>
            <FormInput id="edit-price" type="number" step="0.01" {...register("price")} />
          </div>
          <div>
            <FormLabel htmlFor="edit-currency">Moneda</FormLabel>
            <FormSelect id="edit-currency" {...register("currency")}>
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
            </FormSelect>
          </div>
        </div>
      </FormSection>

      <FormSection title="Ubicación">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormLabel htmlFor="edit-addr">Dirección</FormLabel>
            <FormInput id="edit-addr" {...register("address")} />
          </div>
          <div>
            <FormLabel htmlFor="edit-city">Ciudad</FormLabel>
            <FormInput id="edit-city" {...register("city")} />
          </div>
          <div>
            <FormLabel htmlFor="edit-state">Provincia</FormLabel>
            <FormSelect id="edit-state" {...register("state")}>
              {ARGENTINA_PROVINCES.map((prov) => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </FormSelect>
          </div>
          <div>
            <FormLabel htmlFor="edit-nb">Barrio</FormLabel>
            <FormInput id="edit-nb" {...register("neighborhood")} />
          </div>
        </div>
      </FormSection>

      <FormSection title="Características">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div><FormLabel htmlFor="edit-ta">Sup. total (m²)</FormLabel><FormInput id="edit-ta" type="number" {...register("totalArea")} /></div>
          <div><FormLabel htmlFor="edit-ca">Sup. cubierta (m²)</FormLabel><FormInput id="edit-ca" type="number" {...register("coveredArea")} /></div>
          <div><FormLabel htmlFor="edit-rooms">Ambientes</FormLabel><FormInput id="edit-rooms" type="number" {...register("rooms")} /></div>
          <div><FormLabel htmlFor="edit-bed">Dormitorios</FormLabel><FormInput id="edit-bed" type="number" {...register("bedrooms")} /></div>
          <div><FormLabel htmlFor="edit-bath">Baños</FormLabel><FormInput id="edit-bath" type="number" {...register("bathrooms")} /></div>
          <div><FormLabel htmlFor="edit-garage">Cocheras</FormLabel><FormInput id="edit-garage" type="number" {...register("garages")} /></div>
          <div className="sm:col-span-2 md:col-span-3">
            <FormLabel htmlFor="edit-amen">Amenities</FormLabel>
            <FormInput id="edit-amen" {...register("amenities")} />
          </div>
        </div>
      </FormSection>

      <FormSection title="Imágenes actuales">
        {reorderedImages.length > 0 ? (
          <div>
            <p className="mb-2 text-xs text-muted-foreground">Arrastrá para reordenar. La primera será la principal.</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {reorderedImages.map((img, i) => (
                <div
                  key={img.id}
                  draggable
                  onDragStart={() => setDragIdx(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleReorderDrop(i)}
                  className={`group relative aspect-[4/3] cursor-grab overflow-hidden rounded-lg border active:cursor-grabbing ${
                    dragIdx === i ? "opacity-50 ring-2 ring-primary" : ""
                  }`}
                >
                  <Image src={img.url} alt={`Imagen ${i + 1}`} fill className="pointer-events-none object-cover" sizes="200px" />
                  <div className="absolute left-1.5 top-1.5 flex items-center gap-1">
                    <GripVertical className="h-4 w-4 text-white drop-shadow-md" />
                    {i === 0 && (
                      <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        Principal
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Sin imágenes</p>
        )}

        <div className="mt-4">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            <Upload className="h-4 w-4" />
            Agregar imágenes
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setNewImages(Array.from(e.target.files || []))}
              className="hidden"
            />
          </label>
          {newImages.length > 0 && (
            <span className="ml-2 text-sm text-muted-foreground">{newImages.length} nuevas</span>
          )}
        </div>
      </FormSection>

      <FormSection title="Publicación">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div>
            <FormLabel htmlFor="edit-status">Estado</FormLabel>
            <FormSelect id="edit-status" {...register("status")}>
              <option value="DRAFT">Borrador</option>
              <option value="ACTIVE">Activa</option>
              <option value="PAUSED">Pausada</option>
              <option value="SOLD">Vendida</option>
              <option value="RENTED">Alquilada</option>
            </FormSelect>
          </div>
          <div className="pt-0 sm:pt-5">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("isFeatured")} className="h-4 w-4 rounded border-input text-primary" />
              <span className="font-medium text-foreground">Destacar</span>
            </label>
          </div>
        </div>
      </FormSection>

      <FormSection title="SEO y tour virtual" className="border-border bg-muted/30">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FormLabel htmlFor="metaTitle">Título SEO</FormLabel>
            <FormInput id="metaTitle" {...register("metaTitle")} placeholder="Título para Google" maxLength={70} />
          </div>
          <div>
            <FormLabel htmlFor="metaDescription">Descripción SEO</FormLabel>
            <FormInput id="metaDescription" {...register("metaDescription")} placeholder="Descripción para Google" maxLength={160} />
          </div>
          <div className="sm:col-span-2">
            <FormLabel htmlFor="virtualTourUrl">Tour virtual (URL)</FormLabel>
            <FormInput id="virtualTourUrl" {...register("virtualTourUrl")} placeholder="https://my.matterport.com/show/?m=..." />
            <p className="mt-1 text-xs text-muted-foreground">URL de Matterport, YouTube 360°, o cualquier tour virtual</p>
          </div>
        </div>
      </FormSection>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:hover:bg-red-950/30"
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Eliminar
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar cambios
        </button>
      </div>
    </form>
  );
}
