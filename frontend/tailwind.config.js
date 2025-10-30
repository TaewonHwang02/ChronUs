/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        ph: "431px", // For Tablet sizes (bigger than phone)
        tb: "900px", // For Desktop sizes (bigger than tablet)
      },
      colors: {
        primary: {
          light: "#3F88C5", // blue
          dark: "#1a1a1a", // black
        },
        secondary: {
          light: "#FFFFFF", // white
          dark: "#3F5A72", // grey
        },
        selective_yellow: "#FFBA08",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        kulim: ['"Kulim Park"', "sans-serif"],
      },
      darkMode: "class",
    },
  },
  plugins: [],
};
