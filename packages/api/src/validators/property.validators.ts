import { z } from "zod";

export const propertyFiltersSchema = z.object({
  type: z.enum([
    "HOUSE", "APARTMENT", "LAND", "OFFICE",
    "COMMERCIAL", "WAREHOUSE", "PH", "COUNTRY_HOUSE", "FARM",
  ]).optional(),
  operation: z.enum(["SALE", "RENT", "TEMPORARY"]).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  garages: z.coerce.number().int().min(0).optional(),
  search: z.string().max(200).optional(),
  page: z.coerce.number().int().min(1).default(1),
});

export type PropertyFilters = z.infer<typeof propertyFiltersSchema>;

export const createPropertySchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres").max(200),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres"),
  type: z.enum([
    "HOUSE", "APARTMENT", "LAND", "OFFICE",
    "COMMERCIAL", "WAREHOUSE", "PH", "COUNTRY_HOUSE", "FARM",
  ]),
  operation: z.enum(["SALE", "RENT", "TEMPORARY"]),
  price: z.coerce.number().positive("El precio debe ser mayor a 0"),
  currency: z.enum(["USD", "ARS"]).default("USD"),
  expenses: z.coerce.number().min(0).optional().nullable(),
  address: z.string().min(3, "Ingresá una dirección válida"),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().optional().nullable(),
  neighborhood: z.string().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  totalArea: z.coerce.number().positive().optional().nullable(),
  coveredArea: z.coerce.number().positive().optional().nullable(),
  rooms: z.coerce.number().int().min(0).optional().nullable(),
  bedrooms: z.coerce.number().int().min(0).optional().nullable(),
  bathrooms: z.coerce.number().int().min(0).optional().nullable(),
  garages: z.coerce.number().int().min(0).optional().nullable(),
  floor: z.coerce.number().int().optional().nullable(),
  yearBuilt: z.coerce.number().int().min(1800).max(2100).optional().nullable(),
  orientation: z.string().optional().nullable(),
  amenities: z.array(z.string()).optional().nullable(),
  virtualTourUrl: z.string().url("URL inválida").optional().nullable().or(z.literal("")),
  isFeatured: z.boolean().default(false),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;

export const updatePropertySchema = createPropertySchema.partial().extend({
  status: z.enum(["ACTIVE", "PAUSED", "SOLD", "RENTED", "DRAFT"]).optional(),
});
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;

export const changePropertyStatusSchema = z.object({
  status: z.enum(["ACTIVE", "PAUSED", "SOLD", "RENTED", "DRAFT"]),
});
export type ChangePropertyStatusInput = z.infer<typeof changePropertyStatusSchema>;
