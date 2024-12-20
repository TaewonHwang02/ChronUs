/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
<<<<<<< HEAD
        'ph': '431px',  
        'tb': '769px',
=======
        'ph': '431px',
        'tablet': '900px',
>>>>>>> f7340be7974fd0c353667dcc1abce076bb4bf286
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

