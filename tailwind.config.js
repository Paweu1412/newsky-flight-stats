/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        first: '#023e8a',
        second: '#0077b6',
        third: '#0096c7',
        fourth: '#00b4d8',
      },
    },
  },
  plugins: [],
};
