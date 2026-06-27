import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        void: "#0b0710",
        graphite: "#151022",
        panel: "#201435",
        glass: "rgba(28, 16, 40, 0.48)",
        cyanGlow: "#f7a8ff",
        limeGlow: "#ffd1a8"


      },
      boxShadow: {
        glow: "0 0 30px rgba(57, 240, 255, 0.22)"
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(57,240,255,0.11) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};

export default config;
