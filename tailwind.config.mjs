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
    transitionProperty: {
      'height': 'height',
      'spacing': 'margin, padding',
    },
    extend: {
      colors: {
        blue: {
          50: '#E2E8F0',
          100: '#CBD5E0',
          200: '#94A3B8',
          300: '#64748B',
          400: '#4299E1',
          500: '#1A202C',
          600: '#1A202C',
          700: '#1A202C',
          800: '#1A202C',
          900: '#1A202C',
        },
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
        yellow: {
          50: '#F2C464',
          100: '#F7DC6F',
          200: '#F2C464',
          300: '#F0B429',
          400: '#E78400',
          500: '#D95E1B',
          600: '#C65800',
          700: '#A65200',
          800: '#8B4500',
          900: '#663B00',
        },
      },
    },
  },
  plugins: [],
}

