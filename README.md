# Plataforma Inmobiliaria

Plataforma SaaS multi-tenant para crear y gestionar sitios web inmobiliarios.

## Stack tecnológico

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de datos**: PostgreSQL + PostGIS
- **ORM**: Prisma
- **Cache**: Redis
- **Monorepo**: Turborepo + pnpm workspaces

## Estructura

```
├── apps/
│   ├── web/       → Sitio público (lo que ven los visitantes)
│   └── admin/     → Panel de administración
├── packages/
│   ├── db/        → Prisma schema + cliente
│   ├── ui/        → Componentes compartidos
│   └── types/     → Tipos y constantes
├── docker-compose.yml
└── turbo.json
```

## Setup rápido

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Levantar servicios (PostgreSQL + Redis)

```bash
docker compose up -d
```

### 3. Configurar base de datos

```bash
cp .env.example .env
pnpm db:generate
pnpm db:push
pnpm --filter @app-inmobiliaria/db db:seed
```

### 4. Iniciar desarrollo

```bash
pnpm dev
```

- **Web pública**: http://localhost:3000
- **Admin panel**: http://localhost:3001

## Multi-tenancy

Cada inmobiliaria tiene su propio sitio. En desarrollo se usa el parámetro `?tenant=slug` o la variable `DEFAULT_TENANT`.

En producción, cada inmobiliaria accede vía subdominio (`slug.tudominio.com`) o dominio custom.

## Planes

| Feature | Básico | Profesional | Premium |
|---------|--------|-------------|---------|
| Propiedades | 50 | 200 | Ilimitadas |
| Dominio custom | ✗ | ✓ | ✓ |
| Analytics | ✗ | ✓ | ✓ |
| CRM | ✗ | ✓ | ✓ |
| AI Features | ✗ | ✗ | ✓ |
| Chat automation | ✗ | ✗ | ✓ |
| Ajuste IPC | ✗ | ✓ | ✓ |
