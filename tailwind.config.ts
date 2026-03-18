import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "hsl(210 50% 4%)",
        foreground: "hsl(210 15% 92%)",
        card: "hsl(215 35% 7%)",
        primary: {
          DEFAULT: "#06B6D4",
          foreground: "hsl(210 50% 4%)",
        },
        "hero-sub": "hsl(210 15% 45%)",
        muted: {
          DEFAULT: "hsl(215 20% 10%)",
          foreground: "hsl(210 15% 45%)",
        },
        border: "hsl(210 18% 15%)",
      },
      animation: {
        marquee: "marquee 20s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
