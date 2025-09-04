/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans JP"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: "#154b85",
        accent: "#007fb5",
        sub1: "#0a3763",
        sub2: "#D7E8EE",
        background: "#FFFFFF",
        text: "#233043",
        border: "#E3E8EF",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
