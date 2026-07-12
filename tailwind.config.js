/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],

  theme: {
    extend: {
      colors: {
        // Screenshot Admin Panel Theme
        dark: "#111111",
        card: "#181818",
        border: "#2A2A2A",

        // Amber Theme
        amber: {
          500: "#F59E0B",
          600: "#D97706",
          400: "#FBBF24",
        },

        // Existing Project Colors
        primary: "#0F172A",
        secondary: "#1E293B",
        accent: "#C9A227",
        cream: "#FAF7F2",

        // Text Colors
        muted: "#A1A1AA",
        success: "#22C55E",
        danger: "#EF4444",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },

      boxShadow: {
        amber: "0 0 25px rgba(245,158,11,0.15)",
      },

      animation: {
        pulseSlow: "pulse 3s infinite",
      },
    },
  },

  plugins: [],
};
