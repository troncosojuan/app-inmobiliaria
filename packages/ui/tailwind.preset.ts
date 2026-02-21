import type { Config } from "tailwindcss";

/**
 * Shared Tailwind preset for all apps in the monorepo.
 * Defines the design token system, color palette, and utilities.
 *
 * Usage in app tailwind.config.ts:
 *   import sharedPreset from "@app-inmobiliaria/ui/tailwind.preset";
 *   export default { presets: [sharedPreset], content: [...] }
 */
const preset: Partial<Config> = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // --- Semantic tokens (CSS variable backed) ---
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // --- Tenant dynamic colors (injected via CSS vars in root layout) ---
        "tenant-primary": "var(--tenant-primary, #1e40af)",
        "tenant-secondary": "var(--tenant-secondary, #f59e0b)",
        "tenant-accent": "var(--tenant-accent, #10b981)",

        // --- Platform base palette (static, always available) ---
        // Use these for elements that should NOT change with tenant branding.
        platform: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },

        // --- Status colors (semantic, used across both apps) ---
        status: {
          active: "#10b981",
          draft: "#94a3b8",
          paused: "#f59e0b",
          sold: "#3b82f6",
          rented: "#8b5cf6",
          new: "#3b82f6",
          contacted: "#f59e0b",
          "in-visit": "#8b5cf6",
          offer: "#6366f1",
          converted: "#10b981",
          lost: "#ef4444",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.2s ease-out",
      },
    },
  },
};

export default preset;
