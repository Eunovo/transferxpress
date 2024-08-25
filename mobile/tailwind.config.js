/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}","./src/_components/**/*.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: {
        primary:"#ECB365",
        "btn-disabled": "#9CA4D2",
        secondary:"#064663",
        dark: "#04293A",
        background: "#041C32",
      }
    },
  },
  plugins: [],
}

