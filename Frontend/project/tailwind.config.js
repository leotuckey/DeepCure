// tailwind.config.js
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // use system-ui stack, with your Roboto Mono var available via CSS variable
        sans: ["ui-sans-serif", ...defaultTheme.fontFamily.sans],
        robotoMono: ["var(--font-roboto-mono)", ...defaultTheme.fontFamily.mono],
      },
      borderRadius: {
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
