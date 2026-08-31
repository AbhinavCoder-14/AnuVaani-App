import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#00A896",
          mint: "#02C39A",
          charcoal: "#1A1A1A",
          body: "#374151",
          muted: "#6B7280",
          faint: "#C5C5C5",
          surface: "#F5F5F0",
          "surface-cool": "#F3F4F6",
          warning: "#F59E0B",
          critical: "#EF4444",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        sans: ["var(--font-urbanist)", "system-ui", "sans-serif"],
        display: ["var(--font-urbanist)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        card: "16px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.06)",
        "card-hover": "0 12px 40px rgba(0,0,0,0.10)",
        float: "0 8px 32px rgba(0,0,0,0.10)",
      },
      maxWidth: {
        page: "1200px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
