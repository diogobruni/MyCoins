module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        white: '#FFF',
        black: '#000',
        background: '#0f0638',
        foreground: '#291f57',
        green: '#47e7ce',
        green2: '#4fa8c4 ',
        red: '#e58db6',
      },
      fontFamily: {
        'poppins': ['"Poppins"', 'sans-serif']
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
    require('tailwindcss-aria-attributes'),
  ],
}
