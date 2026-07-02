import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#050509",
        ink: "#0a0a13",
        panel: "#0d0d1a",
        neon: {
          purple: "#8b5cf6",
          violet: "#a78bfa",
          cyan: "#22d3ee",
          blue: "#38bdf8",
          magenta: "#e879f9",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "spin-reverse": {
          to: { transform: "rotate(-360deg)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        flow: {
          to: { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 32s linear infinite",
        "spin-slower": "spin-slow 52s linear infinite",
        "spin-reverse": "spin-reverse 70s linear infinite",
        "pulse-dot": "pulse-dot 2.2s ease-in-out infinite",
        flow: "flow 3s linear infinite",
      },
      boxShadow: {
        "glow-purple": "0 0 40px -8px rgba(139, 92, 246, 0.5)",
        "glow-cyan": "0 0 40px -8px rgba(34, 211, 238, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
