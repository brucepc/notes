/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true, content: ["./projects/**/*.{html,ts,scss}"], theme: {
    extend: {
      screens: {
        print: {raw: 'print'}
      }
    },
  }, plugins: [require('tailwind-scrollbar')],
}
