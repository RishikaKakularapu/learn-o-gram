import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  safelist: [
    "from-violet-500", "to-fuchsia-500",
    "from-amber-400", "to-pink-500",
    "from-emerald-400", "to-cyan-500",
    "from-sky-500", "to-indigo-500",
    "from-rose-500", "to-orange-500",
    "from-teal-400", "to-blue-500",
    "from-lime-400", "to-green-600",
    "from-slate-500", "to-zinc-700",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0b10",
        surface: "#15151d",
        surface2: "#1d1d28",
        border: "#262633",
        text: "#f5f5f7",
        muted: "#9a9aa8",
        accent: "#a855f7",
        accent2: "#ec4899",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
