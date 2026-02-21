import type { Config } from "tailwindcss";
import sharedPreset from "@app-inmobiliaria/ui/tailwind.preset";
import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);
const uiPackagePath = path.dirname(require.resolve("@app-inmobiliaria/ui/tailwind.preset"));

const config: Config = {
  presets: [sharedPreset as Config],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    path.join(uiPackagePath, "src/**/*.{js,ts,jsx,tsx}"),
  ],
  plugins: [require("@tailwindcss/typography")],
};

export default config;
