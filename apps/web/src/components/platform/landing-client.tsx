"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2, ArrowRight, Check, Star, BarChart3, Users, Search,
  Zap, Shield, Globe, MessageSquare, Map, FileText, KeyRound,
  ChevronDown, Menu, X, Sparkles, TrendingUp, Clock,
} from "lucide-react";
import {
  MockupWebsite,
  MockupDashboard,
  MockupPublications,
  MockupChat,
  MockupAnalytics,
} from "./landing-mockups";

interface Plan {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  currency: string;
  maxProperties: number;
  maxUsers: number;
  analytics: boolean;
  aiFeatures: boolean;
  crm: boolean;
  customPages: boolean;
  customDomain: boolean;
  bulkUpload: boolean;
  seoAdvanced: boolean;
  prioritySupport: boolean;
}

interface LandingClientProps {
  plans: Plan[];
}

const SHOWCASE_ITEMS = [
  {
    id: "website",
    title: "Tu página web profesional",
    description: "Tu inmobiliaria online en minutos, con tu logo y colores. Tus clientes buscan propiedades, ven fotos y te contactan desde el mismo sitio.",
    bullets: ["Diseño moderno y adaptable al celular", "Buscador por tipo, precio y zona", "Fichas de propiedad con galería y datos"],
    Mockup: MockupWebsite,
    imageLeft: true,
  },
  {
    id: "dashboard",
    title: "Gestioná tus propiedades fácil",
    description: "Cargá fotos, precios y descripciones desde un solo lugar. Publicá o pausá avisos cuando quieras.",
    bullets: ["Listado de todas tus propiedades", "Estados: borrador, publicado, pausado", "Edición rápida sin tocar código"],
    Mockup: MockupDashboard,
    imageLeft: false,
  },
  {
    id: "publications",
    title: "Todas tus publicaciones en un lugar",
    description: "Publicá en ZonaProp, MercadoLibre, ArgenProp y más desde un solo panel. Sin entrar a cada portal por separado.",
    bullets: ["Conectá los portales que uses", "Publicar y despublicar con un clic", "Estado de cada publicación a la vista"],
    Mockup: MockupPublications,
    imageLeft: true,
  },
  {
    id: "chat",
    title: "Chatbot para tus visitantes",
    description: "Un asistente que entiende lo que buscan tus clientes. Responde en lenguaje natural y sugiere propiedades.",
    bullets: ["Disponible 24/7 en tu sitio", "Entiende consultas en español", "Deriva al contacto cuando hace falta"],
    Mockup: MockupChat,
    imageLeft: false,
  },
  {
    id: "analytics",
    title: "Números claros para decidir",
    description: "Sabé cuántas visitas tiene cada propiedad y de dónde vienen tus consultas. Exportá reportes para analizar.",
    bullets: ["Vistas por propiedad y por período", "Leads y conversión", "Exportación a Excel"],
    Mockup: MockupAnalytics,
    imageLeft: true,
  },
];

const COMPACT_FEATURES = [
  { icon: Building2, title: "Sitio web" },
  { icon: Users, title: "Leads y contactos" },
  { icon: BarChart3, title: "Reportes" },
  { icon: Search, title: "Buscador" },
  { icon: Map, title: "Mapa" },
  { icon: MessageSquare, title: "Chatbot" },
  { icon: FileText, title: "Páginas extra" },
  { icon: KeyRound, title: "API" },
  { icon: Shield, title: "Seguro y aislado" },
];

const STATS = [
  { value: "< 2 min", label: "Para publicar una propiedad" },
  { value: "100%", label: "Se ve bien en celular y PC" },
  { value: "24/7", label: "Tu sitio siempre disponible" },
  { value: "1", label: "Solo lugar para gestionar todo" },
];

const FAQ = [
  {
    q: "¿Cuánto tarda la migración de mi página actual?",
    a: "Depende del volumen de propiedades, pero con la carga masiva vía CSV, podés migrar cientos de propiedades en minutos. Nosotros te ayudamos en el proceso.",
  },
  {
    q: "¿Puedo usar mi dominio propio?",
    a: "Sí, los planes profesionales incluyen configuración de dominio custom. Tu inmobiliaria con tu URL.",
  },
  {
    q: "¿Qué pasa si quiero cambiar de plan?",
    a: "Podés cambiar de plan en cualquier momento. Si subís de plan, las features se habilitan al instante.",
  },
  {
    q: "¿Mis datos están seguros?",
    a: "Cada tenant tiene sus datos completamente aislados. Usamos encriptación y mejores prácticas de seguridad.",
  },
  {
    q: "¿Puedo probar antes de pagar?",
    a: "Todos los planes ofrecen período de prueba. Empezá gratis y escalá cuando necesites.",
  },
];

export function LandingClient({ plans }: LandingClientProps) {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const activePlans = plans.filter((p) => Number(p.price) >= 0).slice(0, 3);

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/platform" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Inmo<span className="text-blue-600">Platform</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Features</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Planes</a>
            <a href="#faq" className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">FAQ</a>
            <Link
              href="/platform/register"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-700"
            >
              Empezar gratis
            </Link>
          </div>

          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden">
            {mobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenu && (
          <div className="border-t border-slate-200 px-4 py-4 md:hidden dark:border-slate-800">
            <div className="flex flex-col gap-3">
              <a href="#features" onClick={() => setMobileMenu(false)} className="text-sm font-medium">Features</a>
              <a href="#pricing" onClick={() => setMobileMenu(false)} className="text-sm font-medium">Planes</a>
              <a href="#faq" onClick={() => setMobileMenu(false)} className="text-sm font-medium">FAQ</a>
              <Link href="/platform/register" className="mt-2 rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-semibold text-white">
                Empezar gratis
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:pt-24 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
              <Sparkles className="h-4 w-4" />
              La plataforma #1 para inmobiliarias argentinas
            </div>

            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Tu inmobiliaria merece{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                una web profesional
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Cargá tus propiedades, gestioná tus clientes y tené todo bajo control.
              Tu sitio web, tus publicaciones y tus números en un solo lugar.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/platform/register"
                className="group flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30"
              >
                Crear mi sitio gratis
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Ver funcionalidades
              </a>
            </div>
          </div>

          {/* Stats band */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</div>
                <div className="mt-1 text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features showcase */}
      <section id="features" className="border-t border-slate-200/60 bg-slate-50/50 py-20 dark:border-slate-800/60 dark:bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Todo lo que necesitás, integrado
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              No más Excel, no más WhatsApp perdidos. Una plataforma completa
              para tu día a día.
            </p>
          </div>

          <div className="space-y-20 lg:space-y-24">
            {SHOWCASE_ITEMS.map((item) => {
              const M = item.Mockup;
              const content = (
                <>
                  <h3 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mb-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                  <ul className="space-y-2">
                    {item.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </>
              );
              const mockup = (
                <div className="mx-auto max-w-sm lg:max-w-md">
                  <M />
                </div>
              );
              const imageLeft = item.imageLeft;
              return (
                <div
                  key={item.id}
                  className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12"
                >
                  <div className={imageLeft ? "order-1 lg:order-1" : "order-1 lg:order-2"}>{mockup}</div>
                  <div className={imageLeft ? "order-2 lg:order-2" : "order-2 lg:order-1"}>{content}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-20 rounded-2xl border border-slate-200/60 bg-white px-6 py-8 dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
              Y además
            </p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 sm:gap-x-14">
              {COMPACT_FEATURES.map((f) => (
                <div key={f.title} className="flex items-center gap-2">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <f.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{f.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              ¿Por qué InmoPlatform?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Diseñado específicamente para el mercado inmobiliario argentino.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Listo en minutos",
                description: "Registrate, elegí tu plan, configurá colores y logo. Tu sitio está online al instante. Sin desarrollo, sin esperas.",
              },
              {
                icon: TrendingUp,
                title: "Más ventas, menos Excel",
                description: "Dashboard con métricas reales: vistas, leads, conversión. Exportá reportes y tomá decisiones basadas en datos.",
              },
              {
                icon: Clock,
                title: "Ahorrá horas al día",
                description: "Calculadoras IPC, gestión de equipo, CRM integrado. Automatizá tareas repetitivas y enfocate en vender.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto mb-4 inline-flex rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 text-blue-600 dark:from-blue-950/50 dark:to-indigo-950/50 dark:text-blue-400">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-slate-200/60 bg-slate-50/50 py-20 dark:border-slate-800/60 dark:bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Planes para cada etapa
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Empezá gratis y escalá a medida que tu inmobiliaria crece.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
            {activePlans.map((plan, i) => {
              const isPopular = i === 1;
              const price = Number(plan.price);
              const features = buildFeatureList(plan);

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border p-6 ${
                    isPopular
                      ? "border-blue-300 bg-white shadow-xl shadow-blue-500/10 dark:border-blue-700 dark:bg-slate-900"
                      : "border-slate-200/60 bg-white dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1 text-xs font-semibold text-white">
                      <Star className="mr-1 inline h-3 w-3" /> Más popular
                    </div>
                  )}

                  <h3 className="mb-1 text-xl font-bold">{plan.name}</h3>
                  <div className="mb-6">
                    {price === 0 ? (
                      <span className="text-3xl font-extrabold">Gratis</span>
                    ) : (
                      <>
                        <span className="text-3xl font-extrabold">${price.toLocaleString("es-AR")}</span>
                        <span className="text-sm text-slate-500">/{plan.currency === "USD" ? "USD" : "ARS"}/mes</span>
                      </>
                    )}
                  </div>

                  <ul className="mb-8 space-y-3">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                        <span className="text-slate-700 dark:text-slate-300">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/platform/register"
                    className={`block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition ${
                      isPopular
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 hover:bg-blue-700"
                        : "border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    {price === 0 ? "Empezar gratis" : "Comenzar prueba"}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Preguntas frecuentes
          </h2>

          <div className="space-y-3">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-slate-200/60 bg-white dark:border-slate-800 dark:bg-slate-900"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === item.q ? null : item.q)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-semibold">{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition ${openFaq === item.q ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === item.q && (
                  <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800">
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200/60 bg-gradient-to-br from-blue-600 to-indigo-600 py-20 dark:border-slate-800/60">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            ¿Listo para transformar tu inmobiliaria?
          </h2>
          <p className="mb-8 text-lg text-blue-100">
            Creá tu sitio profesional en menos de 5 minutos. Sin tarjeta de crédito.
          </p>
          <Link
            href="/platform/register"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-600 shadow-lg transition hover:bg-blue-50"
          >
            Empezar ahora
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-slate-50 py-10 dark:border-slate-800/60 dark:bg-slate-900/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">InmoPlatform</span>
          </div>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} InmoPlatform. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </>
  );
}

function buildFeatureList(plan: Plan): string[] {
  const features: string[] = [];
  features.push(`Hasta ${plan.maxProperties} propiedades`);
  features.push(`${plan.maxUsers} usuario${plan.maxUsers > 1 ? "s" : ""}`);
  features.push("Sitio web responsive");
  features.push("Pipeline de leads");

  if (plan.analytics) features.push("Analytics y reportes");
  if (plan.crm) features.push("CRM completo con tareas");
  if (plan.customPages) features.push("Páginas personalizadas");
  if (plan.bulkUpload) features.push("Carga masiva CSV");
  if (plan.seoAdvanced) features.push("SEO avanzado");
  if (plan.aiFeatures) features.push("Chatbot inteligente");
  if (plan.customDomain) features.push("Dominio propio");
  if (plan.prioritySupport) features.push("Soporte prioritario");

  return features;
}
