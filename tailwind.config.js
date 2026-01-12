/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Indigo 600
        secondary: '#64748B', // Slate 500
        danger: '#EF4444', // Red 500
        background: '#F3F4F6', // Gray 100
      }
    },
  },
  plugins: [],
}