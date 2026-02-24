import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "**": ["../../node_modules/.pnpm/@prisma+client*/**"],
  },
  transpilePackages: [
    "@app-inmobiliaria/ui",
    "@app-inmobiliaria/db",
    "@app-inmobiliaria/types",
    "@app-inmobiliaria/api",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  silent: !process.env.CI,
  widenClientFileUpload: true,
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
    automaticVercelMonitors: true,
  },
});
