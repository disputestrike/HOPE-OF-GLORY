import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "glory-gold": "#D4AF37",
        "deep-heaven": "#0B1F3A",
        "midnight-navy": "#050B18",
        "warm-light": "#FFF8E7",
        "blood-crimson": "#8A1C1C",
        "living-olive": "#556B2F",
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "Merriweather", "serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
        readable: "60ch",
        heading: "22ch",
      },
      spacing: {
        18: "4.5rem",
        128: "32rem",
      },
      letterSpacing: {
        ministry: "0.16em",
      },
    },
  },
  plugins: [],
};

export default config;
