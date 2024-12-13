/** @type {import('tailwindcss').Config} */
import aspectRatio from "@tailwindcss/aspect-ratio";
import typography from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "selector",
  plugins: [typography, aspectRatio],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1280px",
      "2xl": "1536px",
    },
    colors: {
      gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
      },
    },
    transitionProperty: {
      'height': 'height',
      'spacing': 'margin, padding',
    },
    extend: {},
  },
  plugins: [],
}

