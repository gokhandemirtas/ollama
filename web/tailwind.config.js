/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      zIndex: {
        'top': '9999',
      }
    },
    fontFamily: {
      sans: ['Open sans'],
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

