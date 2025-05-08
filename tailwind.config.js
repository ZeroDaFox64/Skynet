// tailwind.config.js
const {heroui} = require("@heroui/react");
import db_store from "./src/db_store";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { 
        poppins: ['Poppins', 'sans-serif'], 
        nunito: ['"Nunito Sans"', 'sans-serif'],
      },
      colors: {
        crunchyroll: '#FF5E00',
        primevideo: '#0678FF',
        hbo: '#7E0C97',
        disney: '#48C3C7',
        netflix: '#af0e18',
        // por refactorizar
        store: db_store.palette["primary"],
        storesecondary: db_store.palette["secondary"],
        text: db_store.palette["text-primary"],
        textsecondary: db_store.palette["text-secondary"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}