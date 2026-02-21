// Services
export { AuthService } from "./services/auth.service";
export { DashboardService } from "./services/dashboard.service";
export { TenantService } from "./services/tenant.service";
export { PropertyService } from "./services/property.service";
export { LeadService } from "./services/lead.service";
export { UserService } from "./services/user.service";
export { PlanService } from "./services/plan.service";
export { AnalyticsService } from "./services/analytics.service";
export { ChatService } from "./services/chat.service";
export { EmailService } from "./services/email.service";
export { FeatureGateService, FEATURE_LABELS } from "./services/feature-gate.service";
export type { FeatureKey } from "./services/feature-gate.service";
export { CustomPageService } from "./services/custom-page.service";
export { CrmService } from "./services/crm.service";
export { ApiKeyService } from "./services/api-key.service";
export { WebhookService, WEBHOOK_EVENTS } from "./services/webhook.service";
export type { WebhookEvent } from "./services/webhook.service";
export { SearchAlertService } from "./services/search-alert.service";
export { PortalService, PORTALS } from "./services/portal.service";
export type { PortalSlug } from "./services/portal.service";

// Validators
export * from "./validators/property.validators";
export * from "./validators/lead.validators";
export * from "./validators/tenant.validators";
export * from "./validators/user.validators";
export * from "./validators/custom-page.validators";
export * from "./validators/crm.validators";
export * from "./validators/onboarding.validators";
export { BillingService } from "./services/billing.service";

// Auth
export { createAuthConfig } from "./auth/auth-config";

// Auth types
export type { AuthUser } from "./services/auth.service";

// Constants
export { DEFAULTS, PROPERTY_STATUSES, LEAD_STATUSES, PROPERTY_TYPES, OPERATION_TYPES, USER_ROLES } from "./constants";
export type { PropertyStatus, LeadStatus, PropertyType, OperationType, UserRole } from "./constants";

// Utils
export { ensureExists, pickFields } from "./utils/service-helpers";
export { serialize } from "./utils/serialize";
export { serializePlan, serializePlans } from "./utils/serialize-plan";
export type { SerializedPlan } from "./utils/serialize-plan";
