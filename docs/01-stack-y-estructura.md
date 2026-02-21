# Stack Tecnológico y Estructura del Proyecto

## Monorepo

El proyecto usa **Turborepo** con **pnpm workspaces**. Toda la lógica vive en un solo repositorio con separación clara de responsabilidades.

```
app-inmobiliaria/
├── apps/
│   ├── web/              → Sitio público + dashboard del tenant (Next.js 15, puerto 3000)
│   └── admin/            → Panel de administración de la plataforma (Next.js 15, puerto 3001)
├── packages/
│   ├── api/              → Lógica de negocio, servicios, validaciones Zod y auth config
│   ├── db/               → Prisma schema, cliente y seeds
│   ├── ui/               → Design system compartido (componentes, color schemes, theme)
│   └── types/            → Tipos TypeScript, constantes y helpers compartidos
├── docs/                 → Documentación del proyecto
├── docker-compose.yml    → PostgreSQL + Redis para producción
├── turbo.json            → Configuración de Turborepo
└── pnpm-workspace.yaml
```

## Stack principal

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|-----------|
| Framework | Next.js (App Router) | 15.x | SSR/ISR, Server Components, Server Actions |
| Lenguaje | TypeScript | 5.x | Type safety en todo el proyecto |
| Estilos | Tailwind CSS | 3.x | Utility-first CSS, temas dinámicos por tenant |
| Componentes | shadcn/ui style (custom) | - | Design system propio con tokens semánticos |
| ORM | Prisma | 6.x | Acceso type-safe a la DB, migraciones |
| DB desarrollo | SQLite | - | Base de datos local sin dependencias externas |
| DB producción | PostgreSQL + PostGIS | 16.x | Datos estructurados + búsqueda geoespacial |
| Auth | Auth.js v5 (NextAuth) | 5.x | Credentials + JWT, roles, middleware |
| Cache | Redis | 7.x | Cache de queries, sessions, rate limiting (futuro) |
| Monorepo | Turborepo | 2.x | Build system, cache, orquestación de tareas |
| Package manager | pnpm | 9.x | Workspaces, hoisting eficiente |

## Librerías de frontend

| Librería | Propósito | Dónde se usa |
|----------|-----------|-------------|
| **TanStack Query** (v5) | Server state, cache, mutations | Provider en layout, queries client-side |
| **React Hook Form** (v7) | Manejo de formularios | Property forms, tenant config, leads, login |
| **Zod** (v3) | Validación de schemas | `packages/api/src/validators/` - compartido front y back |
| **@hookform/resolvers** | Integración RHF + Zod | Validación en formularios |
| **Sonner** | Notificaciones toast | Feedback al usuario en toda la app |
| **nuqs** | URL state management | Filtros de propiedades sincronizados con query params |
| **Lucide React** | Iconos | Toda la UI |
| **nextjs-toploader** | Barra de progreso global | Feedback de navegación entre páginas |
| **sharp** | Procesamiento de imágenes | Resize + conversión a WebP en upload |
| **Recharts** | Gráficos y visualizaciones | Dashboard de analytics (area, bar, pie charts) |
| **PapaParse** | Parsing de CSV | Importación masiva de propiedades |
| **nodemailer** | Envío de emails | Notificaciones a agentes y confirmaciones a visitantes |
| **framer-motion** | Animaciones y transiciones | Fade-up, stagger lists, scroll reveal, counters animados |
| **Atropos** | Efecto 3D parallax tilt | Cards de propiedades destacadas en el home (~5KB) |
| **@formkit/auto-animate** | Animaciones automáticas DOM | Kanban del pipeline de leads (~2KB) |
| **cmdk** | Command palette (⌘K) | Buscador/navegador rápido en el dashboard |
| **@tanstack/react-virtual** | Virtualización de listas | Disponible para listas largas de propiedades |

## Paquetes internos

### `packages/api`
Servicios de negocio (clases estáticas), validadores Zod, y utilidades compartidas.

```
packages/api/src/
├── services/
│   ├── auth.service.ts          → Validación de credenciales
│   ├── dashboard.service.ts     → Stats del dashboard del tenant
│   ├── tenant.service.ts        → CRUD de tenants + stats plataforma
│   ├── property.service.ts      → CRUD propiedades + imágenes
│   ├── lead.service.ts          → CRUD leads + pipeline
│   ├── user.service.ts          → CRUD usuarios + cambio de contraseña
│   ├── plan.service.ts          → Planes y cambio de plan
│   ├── analytics.service.ts     → Métricas: vistas, leads, conversión, top propiedades
│   ├── chat.service.ts          → Chatbot: parser NLP español + búsqueda inteligente
│   ├── email.service.ts         → Notificaciones email (nodemailer)
│   └── feature-gate.service.ts  → Control de features por plan
├── validators/
│   ├── property.validators.ts   → create, update, filters, changeStatus
│   ├── lead.validators.ts       → create, updateStatus, addNote, assignAgent, updateLead
│   ├── tenant.validators.ts     → create, update, createWithAdmin
│   └── user.validators.ts       → create, update, changePassword
├── auth/
│   └── auth-config.ts           → Config reutilizable de NextAuth (web + admin)
└── utils/
    ├── service-helpers.ts        → ensureExists, pickFields
    └── serialize.ts              → Conversión de Decimal a number para Client Components
```

### `packages/ui`
Design system con componentes reutilizables y utilidades de estilos.

```
packages/ui/src/
├── components/
│   ├── button.tsx, input.tsx, badge.tsx, card.tsx, select.tsx  → Primitivos
│   ├── form-field.tsx           → FormInput, FormSelect, FormTextarea, FormLabel (variantes y tamaños)
│   ├── stat-card.tsx            → Tarjeta de métricas con ícono y color scheme
│   ├── status-badge.tsx         → Badge de estado con colores semánticos
│   ├── page-header.tsx          → Header de páginas con título, subtítulo y acciones
│   ├── empty-state.tsx          → Estado vacío con ícono y acción
│   ├── section-card.tsx         → Card con header e ícono para secciones de formularios
│   ├── data-table.tsx           → Tabla de datos (header, body, row, cell)
│   ├── feature-gate.tsx         → Gating visual de features por plan
│   ├── skeleton.tsx             → Placeholder animado para loading
│   └── theme-toggle.tsx         → Toggle light/dark/system
├── utils/
│   ├── index.ts                 → Utilidad cn() (clsx + tailwind-merge)
│   └── color-schemes.ts         → ICON_COLORS y BADGE_COLORS centralizados
├── styles/
│   └── tokens.css               → CSS variables de referencia
└── tailwind.preset.ts           → Preset de Tailwind con darkMode: "class" y tokens semánticos
```

## Convenciones de código

- **Componentes**: PascalCase, un archivo por componente
- **Archivos**: kebab-case (`property-grid.tsx`, `tenant.service.ts`)
- **Servicios**: Clases estáticas en `packages/api/src/services/`
- **Validadores**: Schemas Zod en `packages/api/src/validators/`
- **Server Components**: Por defecto. Solo usar `"use client"` cuando hay interactividad
- **Imports entre packages**: Via workspace (`@app-inmobiliaria/api`, `@app-inmobiliaria/db`, etc.)
- **Colores**: Usar tokens semánticos (`text-foreground`, `bg-card`, `border-input`). Para íconos/badges usar `ICON_COLORS`/`BADGE_COLORS` de `@app-inmobiliaria/ui`
- **Formularios**: Usar `FormInput`, `FormSelect`, `FormLabel` de `@app-inmobiliaria/ui` en vez de clases inline
- **API routes**: Envolver handlers con `apiHandler()` + `validateBody()` para error handling centralizado
- **Tablas**: Usar `DataTable` + sub-componentes de `@app-inmobiliaria/ui`

## Base de datos

El schema de Prisma está en `packages/db/prisma/schema.prisma`.

**Desarrollo**: SQLite (`file:./prisma/dev.db`). Las apps usan rutas absolutas en sus `.env`.

**Producción**: PostgreSQL con PostGIS. Cambiar el provider en el schema y usar `DATABASE_URL` con conexión PostgreSQL.

### Modelos principales

- `Tenant` - Inmobiliaria/empresa (con subscriptionStartDate/EndDate)
- `Plan` - Plan de suscripción (billingPeriod, trialDays, features booleanas)
- `User` - Usuarios (PLATFORM_ADMIN, TENANT_ADMIN, AGENT) con lastLoginAt
- `Property` - Inmuebles publicados con imágenes, IPC tracking
- `PropertyImage` - Fotos de inmuebles (procesadas con sharp a WebP)
- `PropertyView` - Registro de vistas por propiedad (analytics)
- `Lead` - Consultas/contactos (con estimatedValue, convertedAt para métricas)
- `CustomPage` - Páginas personalizadas (planes Pro+)
- `Session` - Sesiones de autenticación

## Comandos útiles

```bash
pnpm install                    # Instalar dependencias
pnpm dev                        # Levantar todos los dev servers
pnpm db:generate                # Regenerar Prisma Client
pnpm db:push                    # Sincronizar schema con DB
pnpm db:studio                  # Abrir Prisma Studio
pnpm --filter @app-inmobiliaria/db db:seed   # Correr seed
pnpm build                      # Build de producción
```
