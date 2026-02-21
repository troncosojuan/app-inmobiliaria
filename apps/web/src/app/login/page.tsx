"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(error ? "Credenciales inválidas" : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoginError("Email o contraseña incorrectos");
      setIsLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">InmoPlatform</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-white">
            Gestioná tu inmobiliaria desde un solo lugar
          </h1>
          <p className="text-lg leading-relaxed text-blue-200">
            Propiedades, leads, calculadoras y tu web profesional.
            Todo integrado, sin Excel, sin complicaciones.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              "Carga de propiedades fácil",
              "Pipeline de leads",
              "Calculadora IPC",
              "Web profesional",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-blue-200">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-blue-300">
          &copy; {new Date().getFullYear()} InmoPlatform. Todos los derechos reservados.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-6 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">InmoPlatform</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Iniciá sesión</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ingresá tus credenciales para acceder al sistema
            </p>
          </div>

          {loginError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="h-11 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm transition-colors focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className="h-11 w-full rounded-lg border border-input bg-muted/50 px-3 pr-10 text-sm transition-colors focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            ¿No tenés cuenta? Contactanos para empezar.
          </p>
        </div>
      </div>
    </div>
  );
}
