/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "'Inter'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'JetBrains Mono'", "'SFMono-Regular'", "Menlo", "monospace"],
      },
      colors: {
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#0a0f1d",
        },
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        accent: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        teal: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      boxShadow: {
        "clay-card":
          "6px 10px 20px -3px rgba(15, 23, 42, 0.06), -3px -3px 8px 0px rgba(255, 255, 255, 0.8), inset 1px 1px 2px 0px rgba(255, 255, 255, 0.9)",
        "clay-card-dark":
          "8px 12px 24px -4px rgba(0, 0, 0, 0.45), -2px -2px 6px 0px rgba(30, 41, 59, 0.25), inset 1px 1px 1px 0px rgba(255, 255, 255, 0.08)",
        "clay-btn":
          "4px 6px 14px -2px rgba(5, 150, 105, 0.3), inset 1px 1px 2px 0px rgba(255, 255, 255, 0.4)",
        "clay-btn-dark":
          "4px 6px 14px -2px rgba(0, 0, 0, 0.5), inset 1px 1px 1px 0px rgba(255, 255, 255, 0.2)",
        "clay-inset":
          "inset 2px 2px 6px 0px rgba(15, 23, 42, 0.08), inset -2px -2px 6px 0px rgba(255, 255, 255, 0.7)",
        "clay-inset-dark":
          "inset 2px 2px 6px 0px rgba(0, 0, 0, 0.4), inset -1px -1px 3px 0px rgba(255, 255, 255, 0.04)",
      },
    },
  },
  plugins: [],
};
