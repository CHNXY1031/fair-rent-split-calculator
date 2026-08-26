import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        bone: "var(--bone)",
        paper: "var(--paper)",
        ledger: "var(--ledger)",
        amber: "var(--amber)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)"],
        sans: ["var(--font-manrope)"],
      },
      boxShadow: {
        lift: "0 18px 45px rgba(23, 32, 27, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
