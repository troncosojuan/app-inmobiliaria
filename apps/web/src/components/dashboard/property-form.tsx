"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ChevronLeft, ChevronRight, Check, Loader2, Upload, X, GripVertical,
} from "lucide-react";
import {
  PROPERTY_TYPE_LABELS, OPERATION_TYPE_LABELS, ARGENTINA_PROVINCES,
} from "@app-inmobiliaria/types";
import { FormInput, FormLabel, FormSelect, FormTextarea } from "@app-inmobiliaria/ui";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(5, "Mínimo 5 caracteres").max(200),
  description: z.string().min(20, "Mínimo 20 caracteres"),
  type: z.string().min(1, "Seleccioná un tipo"),
  operation: z.string().min(1, "Seleccioná una operación"),
  price: z.coerce.number().positive("El precio debe ser mayor a 0"),
  currency: z.string().default("USD"),
  expenses: z.coerce.number().min(0).optional().or(z.literal("")),
  address: z.string().min(3, "Dirección requerida"),
  city: z.string().min(2, "Ciudad requerida"),
  state: z.string().min(2, "Provincia requerida"),
  neighborhood: z.string().optional(),
  totalArea: z.coerce.number().min(0).optional().or(z.literal("")),
  coveredArea: z.coerce.number().min(0).optional().or(z.literal("")),
  rooms: z.coerce.number().int().min(0).optional().or(z.literal("")),
  bedrooms: z.coerce.number().int().min(0).optional().or(z.literal("")),
  bathrooms: z.coerce.number().int().min(0).optional().or(z.literal("")),
  garages: z.coerce.number().int().min(0).optional().or(z.literal("")),
  floor: z.coerce.number().int().optional().or(z.literal("")),
  yearBuilt: z.coerce.number().int().min(1800).max(2100).optional().or(z.literal("")),
  amenities: z.string().optional(),
  status: z.string().default("DRAFT"),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().max(70, "Máximo 70 caracteres").optional().or(z.literal("")),
  metaDescription: z.string().max(160, "Máximo 160 caracteres").optional().or(z.literal("")),
  virtualTourUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const STEPS = [
  { label: "Datos básicos", fields: ["title", "type", "operation", "price", "currency", "expenses"] },
  { label: "Ubicación", fields: ["address", "city", "state", "neighborhood"] },
  { label: "Características", fields: ["totalArea", "coveredArea", "rooms", "bedrooms", "bathrooms", "garages", "floor", "yearBuilt", "amenities"] },
  { label: "Imágenes", fields: [] },
  { label: "Publicar", fields: ["description", "status", "isFeatured", "metaTitle", "metaDescription", "virtualTourUrl"] },
];

interface ImagePreview {
  file: File;
  preview: string;
}

export function PropertyForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "", description: "", type: "", operation: "",
      price: undefined as unknown as number, currency: "USD",
      address: "", city: "", state: "", neighborhood: "",
      status: "DRAFT", isFeatured: false, amenities: "",
    },
    mode: "onChange",
  });

  const { register, handleSubmit, formState: { errors }, watch, trigger, setValue } = form;

  const goNext = async () => {
    const currentFields = STEPS[step].fields;
    if (currentFields.length > 0) {
      const valid = await trigger(currentFields as (keyof FormValues)[]);
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goPrev = () => setStep((s) => Math.max(s - 1, 0));

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    addImages(files);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addImages(files);
    e.target.value = "";
  };

  const addImages = (files: File[]) => {
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const handleReorderDragStart = (idx: number) => setDragIdx(idx);

  const handleReorderDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
    setDragIdx(null);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      const amenities = data.amenities
        ? data.amenities.split(",").map((a) => a.trim()).filter(Boolean)
        : [];

      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          expenses: data.expenses || null,
          totalArea: data.totalArea || null,
          coveredArea: data.coveredArea || null,
          rooms: data.rooms || null,
          bedrooms: data.bedrooms || null,
          bathrooms: data.bathrooms || null,
          garages: data.garages || null,
          floor: data.floor || null,
          yearBuilt: data.yearBuilt || null,
          amenities,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error al crear la propiedad");
      }

      const property = await response.json();

      if (images.length > 0) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("propertyId", property.id);
        images.forEach((img) => formData.append("files", img.file));

        await fetch("/api/upload", { method: "POST", body: formData });
        setIsUploading(false);
      }

      toast.success("Propiedad creada exitosamente");
      router.push("/dashboard/propiedades");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear la propiedad");
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorCls = "mt-1 text-xs text-red-500";

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  i < step
                    ? "bg-primary text-white"
                    : i === step
                      ? "bg-blue-600/15 text-blue-600 dark:bg-blue-400/15 dark:text-blue-400 ring-2 ring-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </button>
              {i < STEPS.length - 1 && (
                <div className={`hidden h-0.5 w-8 sm:block ${i < step ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm font-medium text-foreground">{STEPS[step].label}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6">
          {step === 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormLabel htmlFor="title">Título</FormLabel>
                <FormInput id="title" {...register("title")} placeholder="Ej: Departamento 3 ambientes en Palermo" />
                {errors.title && <p className={errorCls}>{errors.title.message}</p>}
              </div>
              <div>
                <FormLabel htmlFor="type">Tipo de propiedad</FormLabel>
                <FormSelect id="type" {...register("type")}>
                  <option value="">Seleccionar...</option>
                  {Object.entries(PROPERTY_TYPE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </FormSelect>
                {errors.type && <p className={errorCls}>{errors.type.message}</p>}
              </div>
              <div>
                <FormLabel htmlFor="operation">Operación</FormLabel>
                <FormSelect id="operation" {...register("operation")}>
                  <option value="">Seleccionar...</option>
                  {Object.entries(OPERATION_TYPE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </FormSelect>
                {errors.operation && <p className={errorCls}>{errors.operation.message}</p>}
              </div>
              <div>
                <FormLabel htmlFor="price">Precio</FormLabel>
                <FormInput id="price" type="number" step="0.01" {...register("price")} placeholder="185000" />
                {errors.price && <p className={errorCls}>{errors.price.message}</p>}
              </div>
              <div>
                <FormLabel htmlFor="currency">Moneda</FormLabel>
                <FormSelect id="currency" {...register("currency")}>
                  <option value="USD">USD (Dólares)</option>
                  <option value="ARS">ARS (Pesos)</option>
                </FormSelect>
              </div>
              <div>
                <FormLabel htmlFor="expenses">Expensas (ARS)</FormLabel>
                <FormInput id="expenses" type="number" {...register("expenses")} placeholder="85000" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormLabel htmlFor="address">Dirección</FormLabel>
                <FormInput id="address" {...register("address")} placeholder="Av. Santa Fe 1234" />
                {errors.address && <p className={errorCls}>{errors.address.message}</p>}
              </div>
              <div>
                <FormLabel htmlFor="city">Ciudad</FormLabel>
                <FormInput id="city" {...register("city")} placeholder="Buenos Aires" />
                {errors.city && <p className={errorCls}>{errors.city.message}</p>}
              </div>
              <div>
                <FormLabel htmlFor="state">Provincia</FormLabel>
                <FormSelect id="state" {...register("state")}>
                  <option value="">Seleccionar...</option>
                  {ARGENTINA_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </FormSelect>
                {errors.state && <p className={errorCls}>{errors.state.message}</p>}
              </div>
              <div>
                <FormLabel htmlFor="neighborhood">Barrio</FormLabel>
                <FormInput id="neighborhood" {...register("neighborhood")} placeholder="Palermo" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <FormLabel htmlFor="totalArea">Superficie total (m²)</FormLabel>
                <FormInput id="totalArea" type="number" {...register("totalArea")} />
              </div>
              <div>
                <FormLabel htmlFor="coveredArea">Superficie cubierta (m²)</FormLabel>
                <FormInput id="coveredArea" type="number" {...register("coveredArea")} />
              </div>
              <div>
                <FormLabel htmlFor="rooms">Ambientes</FormLabel>
                <FormInput id="rooms" type="number" min="0" {...register("rooms")} />
              </div>
              <div>
                <FormLabel htmlFor="bedrooms">Dormitorios</FormLabel>
                <FormInput id="bedrooms" type="number" min="0" {...register("bedrooms")} />
              </div>
              <div>
                <FormLabel htmlFor="bathrooms">Baños</FormLabel>
                <FormInput id="bathrooms" type="number" min="0" {...register("bathrooms")} />
              </div>
              <div>
                <FormLabel htmlFor="garages">Cocheras</FormLabel>
                <FormInput id="garages" type="number" min="0" {...register("garages")} />
              </div>
              <div>
                <FormLabel htmlFor="floor">Piso</FormLabel>
                <FormInput id="floor" type="number" {...register("floor")} />
              </div>
              <div>
                <FormLabel htmlFor="yearBuilt">Año construcción</FormLabel>
                <FormInput id="yearBuilt" type="number" {...register("yearBuilt")} placeholder="2020" />
              </div>
              <div className="sm:col-span-2 md:col-span-3">
                <FormLabel htmlFor="amenities">Amenities (separados por coma)</FormLabel>
                <FormInput id="amenities" {...register("amenities")} placeholder="Pileta, SUM, Gimnasio, Laundry" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div
                onDrop={handleImageDrop}
                onDragOver={(e) => e.preventDefault()}
                className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-input bg-muted/50 p-8 text-center transition-colors hover:border-primary hover:bg-primary/5"
              >
                <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">
                  Arrastrá imágenes acá o hacé clic para seleccionar
                </p>
                <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, WEBP hasta 10MB</p>
                <label className="mt-4 cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
                  Seleccionar archivos
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {images.length > 0 && (
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">Arrastrá las imágenes para reordenarlas. La primera será la principal.</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {images.map((img, i) => (
                      <div
                        key={img.preview}
                        draggable
                        onDragStart={() => handleReorderDragStart(i)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleReorderDrop(i)}
                        className={`group relative aspect-[4/3] cursor-grab overflow-hidden rounded-lg border bg-muted active:cursor-grabbing ${
                          dragIdx === i ? "opacity-50 ring-2 ring-primary" : ""
                        }`}
                      >
                        <Image
                          src={img.preview}
                          alt={`Imagen ${i + 1}`}
                          fill
                          className="pointer-events-none object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div className="absolute left-1.5 top-1.5 flex items-center gap-1">
                          <GripVertical className="h-4 w-4 text-white drop-shadow-md" />
                          {i === 0 && (
                            <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                              Principal
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label="Eliminar imagen"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <FormLabel htmlFor="description">Descripción</FormLabel>
                <FormTextarea
                  id="description"
                  {...register("description")}
                  rows={5}
                  placeholder="Descripción detallada de la propiedad..."
                />
                {errors.description && <p className={errorCls}>{errors.description.message}</p>}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div>
                  <FormLabel htmlFor="status">Estado</FormLabel>
                  <FormSelect id="status" {...register("status")}>
                    <option value="DRAFT">Borrador</option>
                    <option value="ACTIVE">Activa (publicar ahora)</option>
                  </FormSelect>
                </div>
                <div className="pt-0 sm:pt-5">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" {...register("isFeatured")} className="h-4 w-4 rounded border-input text-primary" />
                    <span className="font-medium text-foreground">Destacar propiedad</span>
                  </label>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">SEO (opcional)</h4>
                <div className="space-y-3">
                  <div>
                    <FormLabel htmlFor="metaTitle">Título SEO</FormLabel>
                    <FormInput
                      id="metaTitle"
                      {...register("metaTitle")}
                      placeholder="Ej: Departamento 3 ambientes en Palermo — Venta"
                      maxLength={70}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">{(watch("metaTitle") || "").length}/70 caracteres</p>
                    {errors.metaTitle && <p className={errorCls}>{errors.metaTitle.message}</p>}
                  </div>
                  <div>
                    <FormLabel htmlFor="metaDescription">Descripción SEO</FormLabel>
                    <FormTextarea
                      id="metaDescription"
                      {...register("metaDescription")}
                      rows={2}
                      placeholder="Descripción corta para Google..."
                      maxLength={160}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">{(watch("metaDescription") || "").length}/160 caracteres</p>
                    {errors.metaDescription && <p className={errorCls}>{errors.metaDescription.message}</p>}
                  </div>
                  <div>
                    <FormLabel htmlFor="virtualTourUrl">Tour virtual (URL)</FormLabel>
                    <FormInput
                      id="virtualTourUrl"
                      {...register("virtualTourUrl")}
                      placeholder="https://my.matterport.com/show/?m=... o URL de YouTube 360°"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Pegá la URL de Matterport, YouTube 360°, o cualquier tour virtual</p>
                    {errors.virtualTourUrl && <p className={errorCls}>{errors.virtualTourUrl.message}</p>}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Resumen</h3>
                <div className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <div className="text-blue-700 dark:text-blue-400">Título:</div>
                  <div className="text-blue-900 dark:text-blue-300 font-medium">{watch("title") || "—"}</div>
                  <div className="text-blue-700 dark:text-blue-400">Operación:</div>
                  <div className="text-blue-900 dark:text-blue-300">{OPERATION_TYPE_LABELS[watch("operation") as keyof typeof OPERATION_TYPE_LABELS] || "—"}</div>
                  <div className="text-blue-700 dark:text-blue-400">Ubicación:</div>
                  <div className="text-blue-900 dark:text-blue-300">{[watch("city"), watch("state")].filter(Boolean).join(", ") || "—"}</div>
                  <div className="text-blue-700 dark:text-blue-400">Imágenes:</div>
                  <div className="text-blue-900 dark:text-blue-300">{images.length}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t px-6 py-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={step === 0}
            className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isUploading ? "Subiendo imágenes..." : "Creando..."}
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Crear propiedad
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
