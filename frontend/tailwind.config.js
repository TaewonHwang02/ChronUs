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
        primary: "var(--primary)",
        secondary: "var(--secondary)",
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
