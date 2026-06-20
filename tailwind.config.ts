import type { Config } from "tailwindcss";

/**
 * Brand palette lives here AND as CSS variables in globals.css.
 * Re-skin the salon by editing the CSS variables — these tokens read from them.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-deep": "rgb(var(--accent-deep) / <alpha-value>)",
        blush: "rgb(var(--blush) / <alpha-value>)",
        cream: "rgb(var(--cream) / <alpha-value>)",
        gold: "rgb(var(--gold) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-1.6deg)" },
          "50%": { transform: "rotate(1.6deg)" },
        },
        "drop-in": {
          "0%": { opacity: "0", transform: "translateY(-40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translate(-30px,-18px)" },
          "100%": { opacity: "1", transform: "translate(0,0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        sway: "sway 6s ease-in-out infinite",
        "drop-in": "drop-in 1s cubic-bezier(0.16,1,0.3,1) both",
        "slide-in-left": "slide-in-left 1s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
