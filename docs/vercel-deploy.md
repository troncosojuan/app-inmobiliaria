# Desplegar la app web en Vercel

Guía para el **primer despliegue** del sitio público (`apps/web`) en un monorepo Turborepo. Si seguís estos pasos, el build usa solo la app web y la URL de Vercel muestra tu sitio (tenant por defecto).

---

## 1. Base de datos en producción

La app necesita PostgreSQL (ej. [Neon](https://neon.tech)).

1. Creá la base en Neon y copiá la **Connection string** (PostgreSQL).
2. Aplicá el schema de Prisma **una vez** contra esa base:

```bash
# Desde la raíz del repo, con DATABASE_URL apuntando a Neon
export DATABASE_URL="postgresql://..."   # o usá .env
pnpm db:push
```

O desde el paquete `db`:

```bash
cd packages/db && pnpm db:push
```

Si no hacés esto, en build/runtime vas a ver errores como `The table public.Plan does not exist`.

---

## 2. Crear el proyecto en Vercel

1. [Vercel Dashboard](https://vercel.com/dashboard) → **Add New** → **Project**.
2. Importá el repo **troncosojuan/app-inmobiliaria** (GitHub).
3. **No** hagas deploy todavía; primero configurá lo siguiente.

---

## 3. Configuración del proyecto (importante)

En el proyecto → **Settings** → **General**:

| Campo | Valor |
|--------|--------|
| **Framework Preset** | Next.js |
| **Root Directory** | `apps/web` (editar y elegir esta carpeta) |
| **Build Command** | Dejalo vacío (se usa el de `apps/web/vercel.json`) |
| **Output Directory** | Dejalo vacío o `.next` (por defecto de Next.js) |
| **Install Command** | Dejalo vacío (se usa el de `apps/web/vercel.json`) |

En **Settings** → **General** activá:

- **Include source files outside of the Root Directory in the Build Step** (para que el monorepo y los `packages/*` estén disponibles en el build).

Con **Root Directory** = `apps/web`, Vercel usa el `vercel.json` de esa carpeta, que ya tiene:

- `installCommand`: `cd ../.. && pnpm install` (instala todo el monorepo).
- `buildCommand`: `cd ../.. && pnpm exec turbo run build --filter=@app-inmobiliaria/web` (solo construye la app web).
- `outputDirectory`: `.next` (relativo a `apps/web`).

Así solo se construye **web** y el output es el correcto; no se despliega admin por error.

---

## 4. Variables de entorno en Vercel

En el proyecto → **Settings** → **Environment Variables** agregá al menos:

| Variable | Descripción | Ejemplo |
|----------|-------------|--------|
| `DATABASE_URL` | URL de PostgreSQL (Neon) | `postgresql://user:pass@host/db?sslmode=require` |
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | Secreto para NextAuth | Generar con `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL pública del sitio | `https://tu-proyecto.vercel.app` |
| `PLATFORM_DOMAIN` | Dominio de la plataforma | `tu-proyecto.vercel.app` (sin `https://`) |
| `DEFAULT_TENANT` | Slug del tenant que se muestra en la URL principal | `demo-inmobiliaria` |

Sin `DEFAULT_TENANT` y sin tenant en la DB, la home hace `notFound()` y no vas a ver nada en la URL de Vercel.

---

## 5. Tenant por defecto en la base de datos

La app es multi-tenant. Para que en `https://tu-proyecto.vercel.app` se vea algo, tiene que existir un tenant con el slug que pusiste en `DEFAULT_TENANT` (ej. `demo-inmobiliaria`).

Recomendado: aplicar schema y luego correr el seed (crea planes y el tenant `demo-inmobiliaria`):

```bash
# 1. Schema (crea tablas Plan, Tenant, etc.)
DATABASE_URL="postgresql://TU_URL_NEON" pnpm db:push

# 2. Seed (crea planes y tenant demo-inmobiliaria)
DATABASE_URL="postgresql://TU_URL_NEON" pnpm --filter @app-inmobiliaria/db db:seed
```

Así en Vercel con `DEFAULT_TENANT=demo-inmobiliaria` la home muestra ese tenant. Si preferís otro slug, creá el tenant en la DB y usá ese valor en `DEFAULT_TENANT`.

---

## 6. Primer deploy

1. Guardá los settings y las variables.
2. **Deploy** (o push a la rama conectada).

Cuando el build termine, entrá a la URL de Vercel (ej. `https://tu-proyecto.vercel.app`). Deberías ver la home del tenant por defecto.

---

## Resumen rápido

- **Root Directory**: `apps/web`.
- **Build/Install**: definidos en `apps/web/vercel.json` (solo build de web).
- **DB**: schema aplicado con `pnpm db:push` y tenant por defecto existente.
- **Env**: `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `PLATFORM_DOMAIN`, `DEFAULT_TENANT`.

Si el build corre bien pero “no ves nada”, revisá que exista el tenant con slug = `DEFAULT_TENANT` y que las tablas (incluida `Plan`) existan en la base.
