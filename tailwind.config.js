/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          50: "#f8f7f4",
          100: "#eeeae3",
          200: "#d8d0c4",
          300: "#bfb3a0",
          400: "#a09278",
          500: "#8a7960",
          600: "#6f6050",
          700: "#5a4e41",
          800: "#3c3328",
          900: "#1e1a13",
          950: "#110f0b",
        },
        accent: {
          400: "#f59e0b",
          500: "#d97706",
          600: "#b45309",
        },
        teal: {
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
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
    },
  },
  plugins: [],
};
