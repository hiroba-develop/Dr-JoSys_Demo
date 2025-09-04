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
        sub1: "#03274d",
        sub2: "#C4DFE6",
        background: "#FFFFFF",
        text: "#333333",
        border: "#E0E0E0",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
