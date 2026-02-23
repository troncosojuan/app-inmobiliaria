# Contexto del Producto

## Qué es

Un **sistema operativo para inmobiliarias argentinas**. No es solo un generador de páginas web: es una plataforma SaaS multi-tenant que reemplaza herramientas desconectadas (Excel, WhatsApp manual, portales genéricos) con un sistema integrado de gestión inmobiliaria.

Cada inmobiliaria que se suscribe obtiene:
- Un **sitio web público** profesional y personalizable (colores, logo, dominio)
- Un **dashboard de gestión** (propiedades, leads, equipo, herramientas financieras)
- **Herramientas de back-office** (calculadoras, pipeline de leads, ajuste IPC)
- Features escalables según el plan contratado

## Analogía

Pensalo como un **Shopify + CRM pero para inmobiliarias argentinas**. La inmobiliaria se registra, elige un plan, configura su marca y tiene un sitio web + sistema de gestión funcionando.

## Problema que resuelve

- Las inmobiliarias argentinas tienen páginas genéricas, lentas o desactualizadas
- Usan Excel para administrar propiedades y WhatsApp para gestionar clientes
- Desarrollar un sitio custom es caro y lento
- No hay una solución SaaS local que entienda el mercado argentino (IPC, pesos/dólares, barrios, expensas)
- Las inmobiliarias necesitan herramientas modernas pero no tienen equipo técnico

## Valor core

El producto no se vende como "una página web" sino como **una mejora consistente al trabajo diario**:
- Reemplaza planillas de Excel con un dashboard real
- Reemplaza WhatsApp desordenado con un pipeline de leads
- Genera cálculos financieros (comisiones, rendimiento, IPC) con un click
- La web pública es un output automático de los datos cargados

## Modelo de negocio

Suscripción mensual con 3 planes:

| Plan | Precio | Target |
|------|--------|--------|
| **Básico** | $25.000 ARS/mes | Inmobiliarias chicas, arrancar rápido |
| **Profesional** | $55.000 ARS/mes | Inmobiliarias medianas con necesidades de gestión |
| **Premium** | $95.000 ARS/mes | Inmobiliarias grandes que quieren AI y automatización |

## Arquitectura multi-tenant

**Una sola aplicación, múltiples clientes.** No se genera una app por cliente.

- Cada inmobiliaria tiene un `slug` único: `miinmobiliaria.plataforma.com`
- Opcionalmente, dominio custom: `www.miinmobiliaria.com.ar`
- Datos aislados por `tenantId` en toda la base de datos
- Tema visual (colores, logo) configurable por tenant
- Features habilitadas/deshabilitadas según el plan (FeatureGateService)

### Flujo de resolución de tenant

```
Request → Middleware
  ├─ Subdominio detectado? → Extraer slug → Setear header x-tenant-slug
  ├─ Dominio custom? → Setear header x-custom-domain → Buscar en DB
  └─ Dev mode? → Usar DEFAULT_TENANT o ?tenant=slug
       ↓
  Server Component → getTenant() (con React.cache) → Lee headers → Busca en DB
       ↓
  Layout/Page → Renderiza con tema y datos del tenant
```

## Competencia

| Competidor | Debilidad |
|-----------|-----------|
| Páginas custom por inmobiliaria | Caras, lentas de mantener |
| MercadoLibre Inmuebles, ZonaProp | No es "tu" página, no tenés control |
| RE/MAX, O'Keefe | Solo para su red de franquicias |
| Wix/WordPress | Genéricos, no entienden el dominio inmobiliario argentino |

## Diferenciadores clave

1. **Enfocado 100% en inmobiliarias argentinas** - IPC, pesos/dólares, barrios, expensas
2. **Sistema integral** - Web + back-office + herramientas financieras en un solo lugar
3. **Modular por plan** - Pagás por lo que necesitás
4. **Sin código** - La inmobiliaria no toca código nunca
5. **Soporte y control centralizado** - Panel admin para nuestro equipo
6. **AI integrado** (Premium) - Automatización de chats, análisis de mercado

## Usuarios del sistema

| Rol | Dónde opera | Qué hace |
|-----|-------------|----------|
| **Visitante** | Sitio público | Busca propiedades, contacta |
| **Agente** | Dashboard del tenant | Carga propiedades, gestiona leads asignados |
| **Admin del tenant** | Dashboard del tenant | Todo lo del agente + configuración, usuarios, reportes |
| **Admin de plataforma** | Panel admin (puerto 3001) | Gestiona tenants, planes, soporte, métricas globales |

## Datos de demo

El seed crea:
- 3 planes (Básico, Profesional, Premium) con billingPeriod y trialDays
- 1 tenant demo: "Demo Inmobiliaria" (plan Profesional)
- 2 usuarios: admin de plataforma + admin del tenant
- 6 propiedades variadas (departamentos, casas, PH, oficina, terreno)
- Propiedades en distintos barrios de Buenos Aires

**Credenciales de demo:**
- Admin plataforma (3001): `admin@platform.com` / `admin123`
- Admin tenant (3000): `admin@demo-inmobiliaria.com` / `admin123`
