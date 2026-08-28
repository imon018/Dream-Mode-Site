/** @type {import('tailwindcss').Config} */

export default {

  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],


  theme: {

    extend: {

      colors: {

        // Main Theme

        warm: "#FAF7F2",

        card: "#FFFFFF",

        border: "#E5E7EB",



        // Gold / Amber

        amber: {

          400: "#FBBF24",

          500: "#F59E0B",

          600: "#D97706",

        },


        gold: "#D4AF37",



        // Text

        text: "#111827",

        muted: "#6B7280",



        // Existing Website Colors

        primary: "#0F172A",

        secondary: "#1E293B",

        accent: "#C9A227",

        cream: "#FAF7F2",


        // Status Colors

        success: "#16A34A",

        danger: "#DC2626",

        warning: "#F59E0B",


      },



      borderRadius: {

        xl:"1rem",

        "2xl":"1.25rem",

        "3xl":"1.75rem",

      },



      boxShadow: {


        luxury:
        "0 10px 30px rgba(15,23,42,.08)",


        gold:
        "0 10px 30px rgba(212,175,55,.20)",


      },



      backgroundImage: {


        "gold-gradient":
        "linear-gradient(135deg,#FBBF24,#D4AF37)",


        "warm-gradient":
        "linear-gradient(135deg,#FAF7F2,#FFFFFF)",


      },


    },

  },


  plugins: [],

};
