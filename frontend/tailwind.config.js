/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        ph: "431px", // For Tablet sizes (bigger than phone)
        tb: "900px", // For Desktop sizes (bigger than tablet)
      },
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        tertiary: "var(--tertiary)",
        selective_blue: "#3f88c5",
        dark: "#1a1a1a",
        grey: "#2D4151",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        kulim: ['"Kulim Park"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
