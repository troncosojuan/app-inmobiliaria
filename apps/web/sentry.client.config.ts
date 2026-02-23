import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Porcentaje de transacciones que se tracean (1.0 = 100%)
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,

  // No reportar errores en desarrollo
  enabled: process.env.NODE_ENV === "production",

  // Ignorar errores de red / cancelaciones comunes
  ignoreErrors: [
    "NetworkError",
    "Failed to fetch",
    "Load failed",
    "AbortError",
  ],
});
