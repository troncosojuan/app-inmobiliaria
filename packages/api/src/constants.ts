export const DEFAULTS = {
  TENANT: {
    PRIMARY_COLOR: "#1e40af",
    SECONDARY_COLOR: "#f59e0b",
    ACCENT_COLOR: "#10b981",
  },
  PROPERTY: {
    STATUS: "DRAFT" as const,
    CURRENCY: "USD" as const,
    LEAD_SOURCE: "website" as const,
  },
  SMTP: {
    HOST: "smtp.ethereal.email",
    PORT: 587,
    FROM: "noreply@plataformainmobiliaria.com",
  },
  BCRYPT_ROUNDS: 10,
  PAGINATION: {
    DEFAULT_LIMIT: 100,
    DEFAULT_PAGE_SIZE: 12,
  },
} as const;

export const PROPERTY_STATUSES = ["ACTIVE", "PAUSED", "SOLD", "RENTED", "DRAFT"] as const;
export type PropertyStatus = typeof PROPERTY_STATUSES[number];

export const LEAD_STATUSES = ["NEW", "CONTACTED", "IN_VISIT", "OFFER", "CONVERTED", "LOST"] as const;
export type LeadStatus = typeof LEAD_STATUSES[number];

export const PROPERTY_TYPES = [
  "HOUSE", "APARTMENT", "LAND", "OFFICE",
  "COMMERCIAL", "WAREHOUSE", "PH", "COUNTRY_HOUSE", "FARM",
] as const;
export type PropertyType = typeof PROPERTY_TYPES[number];

export const OPERATION_TYPES = ["SALE", "RENT", "TEMPORARY"] as const;
export type OperationType = typeof OPERATION_TYPES[number];

export const USER_ROLES = ["SUPER_ADMIN", "TENANT_ADMIN", "AGENT"] as const;
export type UserRole = typeof USER_ROLES[number];
