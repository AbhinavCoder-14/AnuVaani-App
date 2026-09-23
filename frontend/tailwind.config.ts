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
        /* ── Legacy brand (landing page) ─────────────────────── */
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

        /* ── Ops console palette (from spec §8) ──────────────── */
        ops: {
          bg: "#F5F7FB",
          card: "#FFFFFF",
          text: "#0F172A",
          "text-secondary": "#64748B",
          border: "#E2E8F0",
          teal: "#0F766E",
          "teal-light": "#CCFBF1",
          blue: "#2563EB",
          purple: "#7C3AED",
          amber: "#B45309",
          "amber-light": "#FEF3C7",
          red: "#B91C1C",
          "red-light": "#FEE2E2",
          green: "#15803D",
          "green-light": "#DCFCE7",
        },

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
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
        "ops-sm": "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        "ops-md": "0 4px 16px rgba(0,0,0,0.06)",
      },
      maxWidth: {
        page: "1200px",
        ops: "1440px",
      },
      width: {
        sidebar: "224px",
        "sidebar-collapsed": "64px",
      },
      spacing: {
        sidebar: "224px",
        "sidebar-collapsed": "64px",
      },
      fontSize: {
        "ops-h1": ["1.75rem", { lineHeight: "2.25rem", fontWeight: "700" }],
        "ops-h2": ["1.25rem", { lineHeight: "1.75rem", fontWeight: "600" }],
        "ops-h3": ["1rem", { lineHeight: "1.5rem", fontWeight: "600" }],
        "ops-body": ["0.875rem", { lineHeight: "1.375rem" }],
        "ops-caption": ["0.75rem", { lineHeight: "1rem" }],
        "ops-metric": ["1.75rem", { lineHeight: "2.25rem", fontWeight: "700" }],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
