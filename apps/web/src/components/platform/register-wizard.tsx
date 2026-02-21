"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Building2, ArrowRight, ArrowLeft, Check, Loader2,
  User, Palette, CreditCard, Eye, EyeOff, AlertCircle,
} from "lucide-react";

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
}

interface RegisterWizardProps {
  plans: Plan[];
}

type Step = "plan" | "agency" | "admin" | "branding";

const STEPS: { key: Step; label: string; icon: React.ElementType }[] = [
  { key: "plan", label: "Plan", icon: CreditCard },
  { key: "agency", label: "Inmobiliaria", icon: Building2 },
  { key: "admin", label: "Tu cuenta", icon: User },
  { key: "branding", label: "Personalizar", icon: Palette },
];

export function RegisterWizard({ plans }: RegisterWizardProps) {
  const [step, setStep] = useState<Step>("plan");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ slug: string } | null>(null);

  const [form, setForm] = useState({
    planSlug: "",
    agencyName: "",
    slug: "",
    email: "",
    phone: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    primaryColor: "#2563eb",
    secondaryColor: "#1e40af",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const currentIdx = STEPS.findIndex((s) => s.key === step);

  const checkSlug = useCallback(async (slug: string) => {
    if (slug.length < 3) {
      setSlugStatus("idle");
      return;
    }
    setSlugStatus("checking");
    try {
      const res = await fetch(`/platform/api/check-slug?slug=${encodeURIComponent(slug)}`);
      const data = await res.json();
      setSlugStatus(data.available ? "available" : "taken");
    } catch {
      setSlugStatus("idle");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (form.slug.length >= 3) checkSlug(form.slug);
    }, 500);
    return () => clearTimeout(timer);
  }, [form.slug, checkSlug]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50);
  };

  const handleAgencyNameChange = (name: string) => {
    updateField("agencyName", name);
    if (!form.slug || form.slug === generateSlug(form.agencyName)) {
      updateField("slug", generateSlug(name));
    }
  };

  const canAdvance = (): boolean => {
    switch (step) {
      case "plan":
        return !!form.planSlug;
      case "agency":
        return !!form.agencyName && !!form.slug && !!form.email && slugStatus !== "taken";
      case "admin":
        return !!form.adminName && !!form.adminEmail && form.adminPassword.length >= 8;
      case "branding":
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canAdvance()) return;
    const nextIdx = currentIdx + 1;
    if (nextIdx < STEPS.length) {
      setStep(STEPS[nextIdx].key);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    const prevIdx = currentIdx - 1;
    if (prevIdx >= 0) setStep(STEPS[prevIdx].key);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/platform/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al registrar");
        return;
      }

      setSuccess({ slug: data.tenant.slug });
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="mx-auto w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">¡Tu inmobiliaria está lista!</h1>
          <p className="mb-8 text-slate-600 dark:text-slate-400">
            Tu sitio web fue creado exitosamente. Ya podés ingresar a tu dashboard.
          </p>
          <div className="space-y-3">
            <a
              href={`/?tenant=${success.slug}`}
              className="block w-full rounded-xl bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
            >
              Ir a mi sitio
            </a>
            <Link
              href="/platform"
              className="block text-sm text-slate-500 hover:text-slate-700"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/platform" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">InmoPlatform</span>
          </Link>

          {/* Steps indicator */}
          <div className="hidden items-center gap-2 sm:flex">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <button
                  onClick={() => i < currentIdx ? setStep(s.key) : undefined}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    i === currentIdx
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                      : i < currentIdx
                        ? "cursor-pointer text-green-600"
                        : "text-slate-400"
                  }`}
                >
                  {i < currentIdx ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <s.icon className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden lg:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-6 ${i < currentIdx ? "bg-green-400" : "bg-slate-200 dark:bg-slate-700"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-start justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Step: Plan selection */}
          {step === "plan" && (
            <div>
              <h1 className="mb-2 text-2xl font-bold">Elegí tu plan</h1>
              <p className="mb-8 text-slate-600 dark:text-slate-400">
                Podés cambiarlo en cualquier momento.
              </p>

              <div className="space-y-3">
                {plans.map((plan) => {
                  const price = Number(plan.price);
                  const selected = form.planSlug === plan.slug;

                  return (
                    <button
                      key={plan.id}
                      onClick={() => updateField("planSlug", plan.slug)}
                      className={`w-full rounded-xl border p-5 text-left transition ${
                        selected
                          ? "border-blue-400 bg-blue-50/50 ring-2 ring-blue-200 dark:border-blue-600 dark:bg-blue-950/20 dark:ring-blue-800"
                          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{plan.name}</div>
                          <div className="mt-0.5 text-sm text-slate-500">
                            {plan.maxProperties} propiedades, {plan.maxUsers} usuarios
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {price === 0 ? "Gratis" : `$${price.toLocaleString("es-AR")}`}
                          </div>
                          {price > 0 && (
                            <div className="text-xs text-slate-500">{plan.currency}/mes</div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {plan.analytics && <FeatureTag>Analytics</FeatureTag>}
                        {plan.crm && <FeatureTag>CRM</FeatureTag>}
                        {plan.aiFeatures && <FeatureTag>AI</FeatureTag>}
                        {plan.customPages && <FeatureTag>Páginas</FeatureTag>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step: Agency info */}
          {step === "agency" && (
            <div>
              <h1 className="mb-2 text-2xl font-bold">Datos de tu inmobiliaria</h1>
              <p className="mb-8 text-slate-600 dark:text-slate-400">
                Esta información se mostrará en tu sitio web.
              </p>

              <div className="space-y-5">
                <FieldGroup label="Nombre de la inmobiliaria" htmlFor="reg-agency-name">
                  <input
                    id="reg-agency-name"
                    type="text"
                    value={form.agencyName}
                    onChange={(e) => handleAgencyNameChange(e.target.value)}
                    placeholder="Ej: Inmobiliaria López"
                    className="input-field"
                  />
                </FieldGroup>

                <FieldGroup label="URL del sitio" htmlFor="reg-slug">
                  <div className="flex items-center gap-0">
                    <input
                      id="reg-slug"
                      type="text"
                      value={form.slug}
                      onChange={(e) => updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      placeholder="mi-inmobiliaria"
                      className="input-field rounded-r-none border-r-0"
                    />
                    <span className="flex items-center rounded-r-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-800">
                      .inmoplatform.com
                    </span>
                  </div>
                  {slugStatus === "checking" && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <Loader2 className="h-3 w-3 animate-spin" /> Verificando...
                    </p>
                  )}
                  {slugStatus === "available" && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                      <Check className="h-3 w-3" /> Disponible
                    </p>
                  )}
                  {slugStatus === "taken" && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3" /> Ya está en uso
                    </p>
                  )}
                </FieldGroup>

                <FieldGroup label="Email de la inmobiliaria" htmlFor="reg-email">
                  <input
                    id="reg-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="contacto@tuinmobiliaria.com"
                    className="input-field"
                  />
                </FieldGroup>

                <FieldGroup label="Teléfono (opcional)" htmlFor="reg-phone">
                  <input
                    id="reg-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+54 11 1234-5678"
                    className="input-field"
                  />
                </FieldGroup>
              </div>
            </div>
          )}

          {/* Step: Admin account */}
          {step === "admin" && (
            <div>
              <h1 className="mb-2 text-2xl font-bold">Tu cuenta de administrador</h1>
              <p className="mb-8 text-slate-600 dark:text-slate-400">
                Con esta cuenta vas a ingresar al dashboard.
              </p>

              <div className="space-y-5">
                <FieldGroup label="Tu nombre" htmlFor="reg-admin-name">
                  <input
                    id="reg-admin-name"
                    type="text"
                    value={form.adminName}
                    onChange={(e) => updateField("adminName", e.target.value)}
                    placeholder="Juan Pérez"
                    className="input-field"
                  />
                </FieldGroup>

                <FieldGroup label="Email de acceso" htmlFor="reg-admin-email">
                  <input
                    id="reg-admin-email"
                    type="email"
                    value={form.adminEmail}
                    onChange={(e) => updateField("adminEmail", e.target.value)}
                    placeholder="juan@tuinmobiliaria.com"
                    className="input-field"
                  />
                </FieldGroup>

                <FieldGroup label="Contraseña" htmlFor="reg-admin-password">
                  <div className="relative">
                    <input
                      id="reg-admin-password"
                      type={showPassword ? "text" : "password"}
                      value={form.adminPassword}
                      onChange={(e) => updateField("adminPassword", e.target.value)}
                      placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <PasswordStrength password={form.adminPassword} />
                </FieldGroup>
              </div>
            </div>
          )}

          {/* Step: Branding */}
          {step === "branding" && (
            <div>
              <h1 className="mb-2 text-2xl font-bold">Personalizá tu sitio</h1>
              <p className="mb-8 text-slate-600 dark:text-slate-400">
                Elegí los colores principales. Podés cambiarlos después.
              </p>

              <div className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FieldGroup label="Color primario" htmlFor="reg-primary-color">
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={form.primaryColor}
                        onChange={(e) => updateField("primaryColor", e.target.value)}
                        className="h-10 w-14 cursor-pointer rounded-lg border border-slate-300"
                      />
                      <input
                        id="reg-primary-color"
                        type="text"
                        value={form.primaryColor}
                        onChange={(e) => updateField("primaryColor", e.target.value)}
                        className="input-field flex-1"
                      />
                    </div>
                  </FieldGroup>

                  <FieldGroup label="Color secundario" htmlFor="reg-secondary-color">
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={form.secondaryColor}
                        onChange={(e) => updateField("secondaryColor", e.target.value)}
                        className="h-10 w-14 cursor-pointer rounded-lg border border-slate-300"
                      />
                      <input
                        id="reg-secondary-color"
                        type="text"
                        value={form.secondaryColor}
                        onChange={(e) => updateField("secondaryColor", e.target.value)}
                        className="input-field flex-1"
                      />
                    </div>
                  </FieldGroup>
                </div>

                {/* Preview */}
                <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Vista previa</p>
                  <div className="space-y-3">
                    <div className="h-2 rounded-full" style={{ background: `linear-gradient(90deg, ${form.primaryColor}, ${form.secondaryColor})` }} />
                    <div className="flex gap-3">
                      <div className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: form.primaryColor }}>
                        Botón primario
                      </div>
                      <div className="rounded-lg border-2 px-4 py-2 text-sm font-semibold" style={{ borderColor: form.primaryColor, color: form.primaryColor }}>
                        Botón outline
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      Así se verán los elementos de tu sitio web.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between">
            {currentIdx > 0 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Anterior
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={!canAdvance() || isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : currentIdx === STEPS.length - 1 ? (
                <>
                  Crear mi sitio
                  <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  Siguiente
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .input-field {
          width: 100%;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          border-radius: 0.5rem;
          border: 1px solid #d1d5db;
          background: white;
          transition: border-color 0.15s, box-shadow 0.15s;
          outline: none;
        }
        .input-field:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .dark .input-field {
          background: #0f172a;
          border-color: #334155;
          color: white;
        }
        .dark .input-field:focus {
          border-color: #3b82f6;
        }
      `}</style>
    </div>
  );
}

function FieldGroup({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      {children}
    </div>
  );
}

function FeatureTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
      {children}
    </span>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ caracteres", pass: password.length >= 8 },
    { label: "Mayúscula", pass: /[A-Z]/.test(password) },
    { label: "Número", pass: /[0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="mt-2 flex gap-3">
      {checks.map((c) => (
        <span
          key={c.label}
          className={`flex items-center gap-1 text-xs ${c.pass ? "text-green-600" : "text-slate-400"}`}
        >
          {c.pass ? <Check className="h-3 w-3" /> : <span className="h-3 w-3 rounded-full border border-slate-300" />}
          {c.label}
        </span>
      ))}
    </div>
  );
}
