/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./styles/**/*.css"
  ],
  safelist: [
    "text-gray-400",
    "text-gray-500",
    "text-red-500",
    "text-green-500",
    "text-blue-500",
    "!text-red-500",
    "!text-green-500",
    "!text-blue-500"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui"]
      },
      colors: {
        gray: {
          50: "#f9f9f9",
          100: "#f0f0f0",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717"
        },
        accent: {
          DEFAULT: "#007aff"
        }
      },
      spacing: {
        header: "4rem",
        section: "2rem"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem"
      }
    }
  },
  plugins: []
};
