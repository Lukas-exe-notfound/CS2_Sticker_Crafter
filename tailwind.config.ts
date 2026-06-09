import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Space Grotesk", "system-ui", "sans-serif"],
      },
      colors: {
        forge: {
          bg: "#070A12",
          panel: "#111827",
          panel2: "#1F2937",
          purple: "#7C3AED",
          cyan: "#06B6D4",
          success: "#22C55E",
          warning: "#F59E0B",
          text: "#F9FAFB",
          muted: "#9CA3AF",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
