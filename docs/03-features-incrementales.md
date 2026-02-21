# Features Incrementales

Roadmap de features ordenado por prioridad. Cada sección indica el estado actual.

> **Última actualización**: 2026-02-20

---

## Fase 1 - MVP ✅ Completado

- [x] Monorepo con Turborepo + pnpm
- [x] Schema de base de datos completo (Prisma) con campos extendidos
- [x] Sistema multi-tenant (middleware + resolución de tenant)
- [x] Sitio público: Home, Listado, Detalle de propiedad, Contacto
- [x] Buscador con filtros (tipo, operación, ubicación, precio, dormitorios)
- [x] Formularios de contacto con validación (React Hook Form + Zod)
- [x] API de leads completa
- [x] Panel admin: Dashboard, listado de tenants, propiedades y leads
- [x] Design system modular con colores dinámicos por tenant
- [x] Seed con datos de demo realistas
- [x] Integración WhatsApp en contacto
- [x] **Autenticación**: Auth.js v5 con credentials + JWT, roles, middleware protector
- [x] **Dashboard del tenant**: Panel completo con métricas, accesos rápidos, sidebar
- [x] **CRUD de propiedades**: Crear, editar, pausar, eliminar desde el dashboard
- [x] **Upload de imágenes**: Subida con resize automático (sharp), conversión a WebP, thumbnails
- [x] **Pipeline de leads**: Vista Kanban + tabla, cambio de estado, notas, asignación a agentes
- [x] **Herramientas financieras**: Calculadora de comisiones, rendimiento de alquiler, ajuste IPC
- [x] **Configuración del tenant**: Colores, logo, datos de contacto, redes sociales
- [x] **Dark mode**: Toggle light/dark/system con persistencia en localStorage
- [x] **Perceived performance**: Top loader global, skeletons por página, fetch paralelo
- [x] **Feature gating**: Control de features por plan (servicio + componentes visuales)
- [x] **Formularios reutilizables**: FormInput/FormSelect/FormLabel/FormTextarea en packages/ui
- [x] **Color schemes centralizados**: ICON_COLORS y BADGE_COLORS compartidos
- [x] **DataTable compartido**: Tablas del admin refactorizadas a componentes reutilizables
- [x] **Backend robusto**: UserService, PlanService, validadores completos, API routes estandarizados
- [x] **Anti-FOUC**: Script de dark mode en head para evitar flash en carga
- [x] **SEO**: Sitemap dinámico, Open Graph tags, structured data JSON-LD, robots.txt
- [x] **Responsive completo**: Mobile-first en todas las páginas, tablas, formularios, navegación
- [x] **Gestión de equipo**: Página de usuarios/agentes con CRUD, roles, límites por plan

---

## Fase 2 - Plan Profesional

### ✅ Completado
- [x] **Pipeline de leads (CRM simple)**: Estado de leads, notas, asignación (hecho en Fase 1)
- [x] **Ajuste por IPC**: Calculadora implementada en herramientas
- [x] **Analytics básico**: Dashboard de analytics con vistas por propiedad, leads por período, tasa de conversión, gráficos (Recharts), propiedades top, leads por estado, selector de período
- [x] **Galería mejorada**: Lightbox fullscreen con zoom + pan, navegación teclado, drag-and-drop para reordenar imágenes, endpoint de reordenamiento
- [x] **Notificaciones email**: Nodemailer con templates HTML, notificación al agente por lead nuevo + confirmación al visitante
- [x] **Carga masiva**: Importación de propiedades vía CSV con papaparse, vista previa, validación fila por fila, reporte de resultados, plantilla descargable

### ✅ Completado (UX/DX)
- [x] **framer-motion**: Animaciones de entrada (FadeUp, StaggerList, ScrollReveal), counters animados en dashboards
- [x] **Atropos 3D**: Efecto parallax tilt en cards de propiedades destacadas del home
- [x] **auto-animate**: Animaciones automáticas en kanban de leads al mover cards
- [x] **Command Palette (⌘K)**: Navegación rápida en el dashboard con cmdk, búsqueda de rutas y acciones
- [x] **Micro-interacciones**: Hover effects en botones (rotate, translate), active:scale en CTAs, image zoom suave

### ✅ Completado (UX Visitante)
- [x] **Favoritos + comparador**: Sistema de guardado en localStorage, página /favoritos, comparador lado a lado (hasta 3 propiedades), indicador en navbar con contador
- [x] **Propiedades similares**: Carousel de propiedades relacionadas al final del detalle (mismo tipo/operación/zona), con badges y botón de favoritos
- [x] **Badges dinámicos**: "Nueva" (< 7 días), "Destacada", "Precio reducido", timestamp relativo. Aplicados en listados, cards y detalle
- [x] **SEO avanzado**: Campos metaTitle/metaDescription editables en formulario de creación/edición, canonical URLs en todas las páginas, sitemap expandido con rutas de venta/alquiler

### ✅ Completado (Backend - Refactorización)
- [x] **Type-safety en servicios**: `PropertyService.create()` tipado con `CreatePropertyInput` (Zod), eliminados todos los `as` casts inseguros. `update()` tipado con `Partial<CreatePropertyInput>`
- [x] **Validación de enums**: `PropertyService.changeStatus()` y `LeadService.updateStatus()` validan contra enums antes de actualizar la DB
- [x] **Serialización completa**: `LeadService.create()` ahora usa `serialize()` para evitar retornar `Decimal` sin serializar
- [x] **ensureExists() tipado**: Eliminado `as any`, nuevo tipo `PrismaDelegate`, ampliado a 6 modelos (`property`, `lead`, `tenant`, `user`, `plan`, `propertyView`)
- [x] **AuthService tipado**: Interface `AuthUser` exportable, función `toAuthUser()` extraída para eliminar duplicación, validación de input vacío
- [x] **Constantes centralizadas**: Archivo `constants.ts` con `DEFAULTS` (colores tenant, SMTP, bcrypt rounds, paginación), enums (`PROPERTY_STATUSES`, `LEAD_STATUSES`, `PROPERTY_TYPES`, `OPERATION_TYPES`, `USER_ROLES`) y tipos asociados. Consumido por `tenant.service`, `email.service`, `lead.service`
- [x] **Cleanup de API routes**: Eliminados casts innecesarios `as Record<string, unknown>` en rutas de propiedades

### ✅ Completado (Bloque A - Core)
- [x] **Páginas custom**: Editor WYSIWYG de páginas estáticas por tenant (Nosotros, Servicios, etc.). CRUD completo con `CustomPageService`, validadores Zod, slugs reservados, publicar/despublicar. Ruta pública dinámica `[pageSlug]` con prose styling (`@tailwindcss/typography`). Links automáticos en navbar (desktop + mobile). Gated por plan (`customPages`)
- [x] **Búsqueda por mapa**: Página `/mapa` con Leaflet + OpenStreetMap (sin API key). Markers dinámicos con popup interactivo (imagen, precio, detalles, link a propiedad). Filtros por tipo y operación. Centrado automático en propiedades. `PropertyService.getMapMarkers()` endpoint liviano. Link en navbar + sitemap
- [x] **Reportes exportables**: Botones de export Excel (xlsx) y CSV en el dashboard de analytics. Genera archivo con 2 hojas: Propiedades (con leads y vistas) + Leads del período. Labels en español, BOM para caracteres especiales. `AnalyticsService.getExportData()` endpoint dedicado

### 🔲 Pendiente
- [ ] **Dominio custom**: Configuración de dominio propio por tenant

---

## Fase 3 - Plan Premium

### ✅ Completado
- [x] **Chatbot de búsqueda de propiedades**: Widget flotante con parser NLP en español, búsqueda inteligente por tipo/operación/zona/precio/ambientes, property cards inline, sugerencias, gated por plan (aiFeatures)

### ✅ Completado (Bloque B - Diferenciadores)
- [x] **CRM completo**: Modelos `Task` y `Activity` en DB. `CrmService` con CRUD de tareas (prioridad, fecha límite, asignación), historial de actividades por lead (notas, llamadas, emails, visitas, cambios de estado), estadísticas de tareas (pendientes, en progreso, completadas, vencidas). Página `/dashboard/tareas` con filtros, formulario de creación, cards interactivas con menú de estados. Actividades auto-logueadas al crear/completar tareas vinculadas a leads. Gated por plan (`crm`). **Validators Zod** para tasks, activities y API keys (`crm.validators.ts`)
- [x] **API pública REST**: Endpoints `GET /api/v1/properties` y `GET /api/v1/properties/[slug]` autenticados con API keys (`Authorization: Bearer immo_xxx`). `ApiKeyService` para crear, revocar y validar keys con tracking de último uso. Sistema de API key management en `/api/keys`. Formato de respuesta estandarizado con `data` + `pagination`. Uso de `ensureExists()` en revoke/delete
- [x] **Tours virtuales**: Campo `virtualTourUrl` en modelo Property. Soporte para Matterport, YouTube 360°, y cualquier tour embeddable. Iframe responsive en detalle de propiedad. Campo en formulario de creación **y edición** con validación de URL. Agregado a `UPDATABLE_FIELDS` y schema Zod

### ✅ Auditoría post-Bloque B (2026-02-19)
- [x] **virtualTourUrl en edición**: Agregado al `property-edit-form.tsx` (faltaba, solo estaba en creación)
- [x] **Validators Zod faltantes**: `crm.validators.ts` con schemas para tasks, activities y API keys. API routes actualizadas para usar `validateBody()`
- [x] **serialize() faltante**: Agregado en `analytics.service.trackView()` para consistencia
- [x] **Loading skeletons**: Agregados para `/dashboard/tareas`, `/dashboard/paginas`, `/dashboard/herramientas`
- [x] **ensureExists() consistente**: `api-key.service.ts` refactorizado para usar el helper centralizado

### ✅ React Doctor + Code Quality (2026-02-20) — Score: 82 → 83/100, Warnings: 71 → 63
- [x] **`serializePlan()` centralizado**: Utilidad en `packages/api/src/utils/serialize-plan.ts` para eliminar duplicación de conversión Decimal→number en 6 archivos. Interface `SerializedPlan` exportable
- [x] **`useApiMutation` + `useApiFetch` hooks**: Hooks reutilizables en `hooks/use-api.ts` para fetch/mutación con manejo de errores y toast. Alternativa más simple a `useFormSubmit` para operaciones sin redirect
- [x] **`prefers-reduced-motion`**: `useReducedMotion()` de framer-motion integrado en `FadeUp`, `FadeIn`, `ScrollReveal`. Animaciones deshabilitadas automáticamente para usuarios con preferencia de movimiento reducido (WCAG 2.3.3)
- [x] **Suspense boundary para `useSearchParams`**: Login page wrapeada con `<Suspense>` para evitar client-side rendering bailout
- [x] **Analytics lazy loading**: `<Suspense>` con skeleton fallback en la página de analytics para code splitting de Recharts
- [x] **Accesibilidad mejorada**: `role="dialog"`, `aria-modal`, `aria-label` en overlays y modales. `htmlFor` en labels de tasks-manager. Keyboard handlers en overlays
- [x] **`FormSection` componente UI**: Nuevo componente reutilizable en `packages/ui` para secciones de formulario con título. Aplicado en `property-edit-form.tsx` (5 secciones refactorizadas)
- [x] **`LoadingSpinner` + `LoadingOverlay`**: Componentes centralizados en `packages/ui` para estados de carga consistentes
- [x] **Lazy `useState` initializer**: `useState(() => property.images.map(...))` en property-edit-form
- [x] **Default prop extraído**: `EMPTY_PAGES` constante de módulo en navbar para evitar nueva referencia en cada render

### 🔲 Pendiente
- [ ] **Valuación AI**: Estimación de precio basada en datos del mercado
- [ ] **Multi-idioma**: Español + Inglés (para propiedades premium/turísticas)

---

## Fase 4 - Plataforma

### ✅ Completado (Bloque C - Plataforma)
- [x] **Landing page**: Sitio de marketing profesional en `/platform` con hero, features grid (9 funcionalidades), sección "¿Por qué?", pricing dinámico desde la DB, FAQ con accordion, CTA, footer. Navbar responsive con menú mobile. Diseño blue/indigo con gradientes y efectos hover. Plans dinámicos con `buildFeatureList()` que lista features por plan
- [x] **Onboarding automatizado**: Wizard de registro multi-step en `/platform/register` con 4 pasos: (1) Selección de plan, (2) Datos de inmobiliaria con verificación de slug en tiempo real (`/platform/api/check-slug`), (3) Cuenta admin con validación de contraseña segura y medidor de fuerza, (4) Personalización de colores con color picker y preview en vivo. API `/platform/api/register` con validación Zod (`onboardingSchema`). Genera slug automático del nombre. Pantalla de éxito post-registro. `TenantService.create` crea tenant + admin en una transacción
- [x] **Billing y suscripciones**: Modelo `Subscription` en Prisma con relaciones a Tenant/Plan. Campos Stripe (`stripeCustomerId`, `stripeSubscriptionId`, `stripePriceId`) en Tenant y Plan. `BillingService` con CRUD de suscripciones, cambio de plan, cancelación, sync de webhooks Stripe, historial de billing. Página `/dashboard/billing` con estado de suscripción, indicadores de trial/cancelación, comparador de planes con upgrade/downgrade, notice de Stripe. API routes (`/api/billing`, `/api/billing/change-plan`, `/api/billing/cancel`, `/api/billing/history`). Loading skeleton. Link en sidebar

### 🔲 Pendiente
- [ ] **Marketplace de templates**: Distintos diseños de homepage para elegir
- [ ] **White-label completo**: Que no se vea "Powered by Plataforma Inmobiliaria"
- [ ] **Multi-país**: Expandir a Uruguay, Chile, etc.

---

## Próximo bloque planificado (Bloque D - Polish & Scale)

Pulido final y features de escalabilidad:

1. **Dominio custom** - Configuración de dominio propio por tenant
2. **Marketplace de templates** - Distintos diseños de homepage para elegir
3. **White-label completo** - Que no se vea "Powered by Plataforma Inmobiliaria"

---

## Ideas anotadas para futuro

- **Sindicación multi-portal**: Publicar propiedades en ZonaProp, MercadoLibre, ArgenProp, Properati desde el dashboard. Módulo de "Canales" con mapeo de campos por portal, estado por canal (activa/pausada por portal), analytics cruzado (vistas y leads por portal, costo por lead por canal). Dashboard unificado tipo "Centro de publicaciones".
- **Sistema de webhooks**: Permitir que los tenants registren webhooks para eventos (nuevo lead, propiedad publicada, etc.)
- **Chatbot para el dueño de la inmobiliaria**: Asistente técnico que ayude con configuración, reportes, y dudas de uso de la plataforma
- **Alertas de búsqueda**: Notificación por email cuando matchea una propiedad nueva
- **Guías de barrio**: Páginas por zona con data contextual (Compass Neighborhood Guides)
- **Búsqueda conversacional con LLM**: Integración con OpenAI/Anthropic para búsqueda natural avanzada
