# Desplegar en Vercel

Guía completa para desplegar `apps/web` y `apps/admin` en un monorepo Turborepo con Neon (PostgreSQL).

---

## 1. Base de datos (Neon)

La app requiere PostgreSQL. Usamos [Neon](https://neon.tech).

### 1.1 Aplicar el schema

Actualizá `DATABASE_URL` en el `.env` raíz con la URL de Neon y corré:

```bash
pnpm db:push
```

### 1.2 Seed (datos iniciales)

```bash
pnpm --filter @app-inmobiliaria/db db:seed
```

El seed crea:
- Planes: `basico`, `profesional`, `premium`
- Tenant: `demo-inmobiliaria`
- Propiedades de ejemplo

### 1.3 Credenciales creadas por el seed

| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| Admin plataforma | `admin@platform.com` | `admin123` | `PLATFORM_ADMIN` |
| Admin del tenant demo | `admin@demo-inmobiliaria.com` | `admin123` | `TENANT_ADMIN` |

> Cambiá estas contraseñas en producción.

---

## 2. Variables de entorno (.env locales)

Next.js carga el `.env` desde la carpeta de **cada app**, no desde la raíz del monorepo.
El `.env` raíz solo lo usa Prisma CLI (`db:push`, `db:seed`, `db:studio`).

| Archivo | Usado por |
|---------|-----------|
| `.env` (raíz) | Prisma CLI |
| `apps/web/.env` | Next.js (web) |
| `apps/admin/.env` | Next.js (admin) |

Todos deben tener `DATABASE_URL` apuntando a Neon para funcionar correctamente tanto local como en Vercel.

---

## 3. Crear proyecto en Vercel — apps/web

1. [Vercel Dashboard](https://vercel.com/dashboard) → **Add New → Project** → importá el repo.
2. **Root Directory**: `apps/web`
3. **Build/Install Command**: dejá vacíos — Vercel los toma automáticamente de `apps/web/vercel.json`.

> La opción "Include source files outside of the Root Directory" ya no aparece en la UI de Vercel. El `installCommand` en `apps/web/vercel.json` (`cd ../.. && pnpm install`) ya resuelve el acceso al monorepo completo.

### Variables de entorno en Vercel

| Variable | Ejemplo |
|----------|---------|
| `DATABASE_URL` | `postgresql://user:pass@host/db?sslmode=require` |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | mismo valor que `AUTH_SECRET` |
| `NEXTAUTH_URL` | `https://tu-proyecto.vercel.app` |
| `PLATFORM_DOMAIN` | `tu-proyecto.vercel.app` (sin `https://`) |
| `DEFAULT_TENANT` | `demo-inmobiliaria` |

> Los valores en Vercel **no** deben tener comillas. Valor correcto: `mi-secret`, no `"mi-secret"`.

---

## 4. Crear proyecto en Vercel — apps/admin

Mismo proceso que `web` pero con:
- **Root Directory**: `apps/admin`
- `NEXTAUTH_URL` apuntando a la URL del admin

---

## 5. Problemas conocidos y soluciones

### Prisma: engine not found en Vercel (`rhel-openssl-3.0.x`)

Next.js no incluye el binario nativo de Prisma en el bundle por defecto.

**Solución 1 — `binaryTargets` en `schema.prisma`:**
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}
```

**Solución 2 — `outputFileTracingIncludes` en `next.config.ts`** (ambas apps):
```ts
const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "**": ["../../node_modules/.pnpm/@prisma+client*/**"],
  },
  // ...
};
```

Ambas soluciones están aplicadas. Sin ellas el error en runtime es:
```
Prisma Client could not locate the Query Engine for runtime "rhel-openssl-3.0.x"
```

### Prisma: URL must start with `postgresql://` (local)

Next.js carga `apps/web/.env` o `apps/admin/.env`, no el `.env` raíz.
Si esos archivos tienen una URL de SQLite (`file:...`), Prisma falla.

**Solución:** asegurate de que `apps/web/.env` y `apps/admin/.env` tengan la URL de Neon.

---

## 6. Resumen rápido

```
# 1. Preparar DB
pnpm db:push
pnpm --filter @app-inmobiliaria/db db:seed

# 2. Vercel web → Root Directory: apps/web
# 3. Vercel admin → Root Directory: apps/admin
# 4. Variables de entorno en cada proyecto
# 5. Deploy
```

Login post-seed: `admin@demo-inmobiliaria.com` / `admin123`
