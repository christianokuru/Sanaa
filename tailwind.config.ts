import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF5EA",
        sand: "#F2E6D0",
        earth: { DEFAULT: "#2B1B12", soft: "#5C4636" },
        terracotta: { DEFAULT: "#C2502A", dark: "#9E3D1E", light: "#F6DDD2" },
        gold: { DEFAULT: "#E2A529", light: "#FBEFD1" },
        forest: { DEFAULT: "#1F5E3B", light: "#DCEBDF" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(43,27,18,.06), 0 4px 16px rgba(43,27,18,.06)",
      },
    },
  },
  plugins: [],
};

export default config;
