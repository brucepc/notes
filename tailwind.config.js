/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ["./projects/**/*.{html,ts,scss}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}
