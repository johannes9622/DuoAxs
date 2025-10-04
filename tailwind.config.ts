import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#38e07b",
        "background-light": "#f6f8f7",
        "background-dark": "#122017",
      },
      fontFamily: { display: ["Inter","ui-sans-serif","system-ui"] },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
