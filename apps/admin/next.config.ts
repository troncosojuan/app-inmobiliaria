import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
