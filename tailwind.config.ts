import type { Config } from "tailwindcss";

/**
 * Sanaa design tokens.
 * UI chrome stays neutral (ink on white). `ember` is the single action color.
 * The art palette (saffron, cobalt, malachite, rose, indigo) is reserved for covers and illustration.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#1A1A1A", soft: "#6A6A6A", mute: "#B0B0B0" },
        line: { DEFAULT: "#EBEBEB", strong: "#DDDDDD" },
        canvas: "#F7F7F7",
        ember: { DEFAULT: "#D93A16", hover: "#BF3012", bright: "#F0532B", tint: "#FDEEE9" },
        saffron: { DEFAULT: "#F4A51C", tint: "#FEF4E1" },
        cobalt: { DEFAULT: "#2747D8", tint: "#E9EDFC" },
        malachite: { DEFAULT: "#0B8457", tint: "#E3F4EC" },
        rose: "#E2477F",
        indigo: "#191D57",
        sand: "#F2E8D9",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      fontSize: {
        caption: ["0.75rem", { lineHeight: "1rem" }],
        body: ["0.875rem", { lineHeight: "1.25rem" }],
        ui: ["1rem", { lineHeight: "1.25rem" }],
        title: ["1.25rem", { lineHeight: "1.5rem", letterSpacing: "-0.01em" }],
        section: ["1.375rem", { lineHeight: "1.625rem", letterSpacing: "-0.02em" }],
        display: ["2.5rem", { lineHeight: "1.05", letterSpacing: "-0.035em" }],
        hero: ["3.75rem", { lineHeight: "1", letterSpacing: "-0.04em" }],
      },
      borderRadius: { card: "14px", field: "10px" },
      boxShadow: {
        pill: "0 1px 2px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.05)",
        float: "0 6px 20px rgba(0,0,0,.12)",
        modal: "0 8px 28px rgba(0,0,0,.28)",
        bar: "0 -1px 0 #EBEBEB",
      },
      maxWidth: { page: "1440px" },
      keyframes: {
        "sheet-up": { from: { transform: "translateY(100%)" }, to: { transform: "translateY(0)" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "pop": { "0%": { transform: "scale(1)" }, "50%": { transform: "scale(1.25)" }, "100%": { transform: "scale(1)" } },
      },
      animation: {
        "sheet-up": "sheet-up .32s cubic-bezier(.2,.8,.2,1)",
        "fade-in": "fade-in .2s ease-out",
        pop: "pop .3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
