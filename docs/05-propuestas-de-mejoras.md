# Propuestas de Mejoras

Mejoras concretas al código y arquitectura actual, priorizadas por impacto.

---

## Alta prioridad

### 1. Migrar a PostgreSQL para desarrollo
**Estado**: Pendiente
**Problema**: SQLite no soporta `mode: "insensitive"` en Prisma, no tiene PostGIS, y la resolución de paths en Windows es frágil.
**Propuesta**: Docker Desktop + `docker-compose.yml` existente. Cambiar provider a `postgresql`.
**Esfuerzo**: Bajo (1 hora).

### 2. UI de gestión de equipo
**Estado**: Backend listo, falta UI
**Contexto**: `UserService` con CRUD completo ya existe, API routes creadas (`/api/users`, `/api/users/[id]`, `/api/users/[id]/password`).
**Propuesta**: Crear página `/dashboard/equipo` con:
- Listado de agentes/usuarios del tenant con stats (propiedades, leads asignados)
- Crear/editar usuarios con validación de límite del plan
- Toggle activo/inactivo
- Cambio de contraseña
**Esfuerzo**: Medio (3-4 horas).

### 3. SEO completo
**Estado**: Pendiente
**Mejoras**:
- Sitemap dinámico por tenant (`/sitemap.xml`)
- JSON-LD structured data para propiedades (schema.org/RealEstateListing)
- Open Graph images generadas dinámicamente con `@vercel/og`
- Robots.txt dinámico
- Canonical URLs con dominio custom
**Esfuerzo**: Medio (3-4 horas).

### 4. Responsive completo
**Estado**: Parcialmente hecho
**Propuesta**: Audit y ajuste de todas las vistas en mobile (360px-768px). Particularmente:
- Dashboard sidebar: convertir a drawer/bottom nav en mobile
- Tablas: horizontal scroll o cards en mobile
- Formularios de propiedades: stack vertical en mobile
- Pipeline Kanban: horizontal scroll con snap
**Esfuerzo**: Medio (3-4 horas).

---

## Media prioridad

### 5. Performance y caching
**Estado**: Mejoras básicas implementadas (top loader, skeletons, Promise.all)
**Mejoras adicionales**:
- ISR para páginas de propiedades
- `unstable_cache` de Next.js para datos que no cambian seguido (tenant config, planes)
- Prefetch inteligente de rutas de propiedades
- Image optimization con `next/image` en todos los componentes
**Esfuerzo**: Medio (3-4 horas).

### 6. Testing
**Estado**: No hay tests
**Propuesta**:
- **Vitest** para unit tests de servicios y validadores
- **Playwright** para E2E tests de flujos críticos
- Tests de los schemas Zod con datos válidos e inválidos
- CI con GitHub Actions
**Esfuerzo**: Medio (4-6 horas para setup + tests iniciales).

### 7. Notificaciones email
**Estado**: Pendiente
**Propuesta**:
- Resend o Nodemailer + React Email para templates
- Aviso al agente cuando llega un lead nuevo
- Confirmación al visitante de que se recibió su consulta
- Email de bienvenida al crear cuenta
**Esfuerzo**: Medio (3-4 horas).

### 8. Galería de propiedades mejorada
**Estado**: Galería básica con navegación
**Mejoras**:
- Lightbox fullscreen con zoom
- Thumbnails de preview
- Drag-and-drop para reordenar imágenes en el dashboard
- Lazy loading de imágenes en el listado
**Esfuerzo**: Medio (3-4 horas).

---

## Baja prioridad (pero valiosas)

### 9. Logging y error handling avanzado
**Estado**: `ApiError` + `apiHandler` implementados para error handling centralizado
**Mejoras**:
- Logging estructurado (pino)
- Error boundaries de React en layouts
- Página de error 500 custom
- Rate limiting en API routes
**Esfuerzo**: Medio (3-4 horas).

### 10. Internacionalización del código
**Estado**: Textos hardcodeados en español
**Propuesta**: Extraer textos a archivos de traducción (`next-intl`). No para multi-idioma inmediato, sino para que las inmobiliarias puedan customizar textos.
**Esfuerzo**: Medio (3-4 horas).

### 11. Monitoreo y observabilidad
**Propuesta**: Sentry para error tracking, Vercel Analytics, health check endpoint.
**Esfuerzo**: Bajo (2 horas).

### 12. CI/CD
**Propuesta**: GitHub Actions (lint → type-check → test → build en cada PR), deploy automático a Vercel, preview deployments.
**Esfuerzo**: Bajo-Medio (2-3 horas).

### 13. Página de edición de tenant en admin
**Estado**: Bug — da 404
**Problema**: `/tenants/[id]` no existe. El botón "Editar" en la lista de tenants lleva a una página inexistente.
**Propuesta**: Crear página con formulario para editar todos los campos del tenant: nombre, slug, email, teléfono, ciudad, provincia, plan, colores, estado activo/inactivo.
**Esfuerzo**: Medio (2-3 horas).

### 14. Inputs numéricos sin flechitas
**Estado**: Pendiente
**Problema**: Los inputs type="number" muestran flechitas arriba/abajo nativas del browser, se ven mal.
**Propuesta**: CSS global `input[type=number]::-webkit-inner-spin-button { display: none }`.
**Esfuerzo**: Bajo (5 minutos).

### 15. Formulario de propiedades mejorado (UX sin teclado)
**Estado**: Pendiente
**Feedback directo de inmobiliaria**: La carga tiene que ser casi sin teclado.
**Propuesta**:
- Dormitorios, baños, cocheras: componente NumberStepper (click +/-)
- Dirección: autocompletado con Google Maps Places API
- Amenities: buscador con checkboxes en vez de input libre
- SEO: botón de AI para pregenerar título/descripción editable
**Esfuerzo**: Alto (1-2 días).

### 16. Cotización del dólar en dashboard
**Estado**: Pendiente
**Propuesta**: Widget pequeño en el header/sidebar del dashboard con USD oficial, blue y MEP actualizado. API gratuita dolarapi.com, sin key requerida.
**Esfuerzo**: Bajo (2-3 horas).

### 17. Buscador y filtros en tablas del admin
**Estado**: Pendiente
**Propuesta**: Agregar input de búsqueda y filtros básicos en las tablas de propiedades, leads y usuarios del dashboard. Client-side filtering con los datos ya cargados.
**Esfuerzo**: Medio (3-4 horas).

### 18. Primer login fuerza cambio de contraseña
**Estado**: Pendiente
**Propuesta**: Flag `mustChangePassword` en modelo User. Al crear un usuario desde el admin, se activa. En el primer login redirige a `/cambiar-password` antes de entrar al dashboard.
**Esfuerzo**: Medio (2-3 horas).

### 19. Templates funcionales (hotplug global)
**Estado**: Bug — cambiar template no aplica ningún cambio visual
**Propuesta**: Revisar el sistema de templateSlug en el tenant. El template elegido debe aplicarse a nivel global en todo el layout público del tenant: navbar, hero, cards, footer. Implementar al menos 2-3 templates distintos.
**Esfuerzo**: Alto (2-3 días).

---

## ✅ Ya implementado (movido de pendiente)

Estas mejoras ya fueron implementadas:

- ~~Autenticación~~ → Auth.js v5 con credentials + JWT, roles, middleware
- ~~Dashboard del tenant~~ → Completo con métricas, accesos rápidos, sidebar
- ~~CRUD de propiedades~~ → Crear, editar, eliminar, cambiar estado
- ~~Upload de imágenes~~ → sharp + filesystem local, resize + WebP
- ~~Dark mode~~ → Toggle con persistencia, anti-FOUC, tokens semánticos
- ~~Skeleton loading~~ → loading.tsx en todas las páginas del dashboard
- ~~Feature flags~~ → FeatureGateService + componentes visuales de gating
- ~~Refactor del design system~~ → FormInput, color schemes centralizados, DataTable compartido
- ~~Error handling en API~~ → apiHandler, ApiError, validateBody en todas las routes
- ~~Monitoreo y observabilidad~~ → Sentry integrado en apps/web y apps/admin (2026-02-23)
- ~~Responsive mobile scroll~~ → Fix touch-action en StaggerList, StaggerItem y Atropos (2026-02-23)
