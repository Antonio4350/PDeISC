/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // permite modo oscuro con clase 'dark'
  theme: {
    extend: {
      colors: {
        electric: "#3b82f6",   // azul eléctrico
        vibrant: "#f97316",   // naranja vibrante
      },
    },
  },
  plugins: [],
};