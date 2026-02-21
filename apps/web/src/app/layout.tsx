import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { getTenant } from "@/lib/tenant";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  if (!tenant) {
    return {
      title: "InmoPlatform",
      description: "El sistema operativo para inmobiliarias argentinas",
    };
  }

  const description = `${tenant.name} - Encontrá tu propiedad ideal en ${tenant.city || "Argentina"}. Departamentos, casas, oficinas y más.`;

  return {
    title: {
      default: tenant.name,
      template: `%s | ${tenant.name}`,
    },
    description,
    metadataBase: new URL(
      tenant.customDomain
        ? `https://${tenant.customDomain}`
        : `http://localhost:3000`
    ),
    openGraph: {
      type: "website",
      siteName: tenant.name,
      title: tenant.name,
      description,
      locale: "es_AR",
    },
    twitter: {
      card: "summary_large_image",
      title: tenant.name,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
    ...(tenant.favicon && {
      icons: { icon: tenant.favicon },
    }),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await getTenant();

  const themeVars = tenant
    ? {
        "--tenant-primary": tenant.primaryColor,
        "--tenant-secondary": tenant.secondaryColor,
        "--tenant-accent": tenant.accentColor,
      }
    : {};

  const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme:dark)").matches);if(d)document.documentElement.classList.add("dark")}catch(e){}})()`;

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={inter.className} style={themeVars as React.CSSProperties}>
        <NextTopLoader color="hsl(var(--primary))" showSpinner={false} height={3} />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
