/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'ph': '431px', // For Tablet sizes (bigger than phone)
        'tb': '900px', // For Desktop sizes (bigger than tablet)
      },
      colors: {
        steel_blue: '#3F88C5',
        selective_yellow: '#FFBA08',
        grey_background: '#F5F5F5',
        light_blue:'#A1CDF1',
        pine_green: "#136F63"

      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        kulim: ['"Kulim Park"', 'sans-serif'],
      }
    },
  },
  plugins: [],

  
}

