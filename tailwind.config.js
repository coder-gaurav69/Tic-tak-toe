/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    screens: {
      'xs': '0px',
      // => @media (min-width: 300px) { ... }

      'sm': '530px',
      // => @media (min-width: 640px) { ... }

      'md': '960px',
      // => @media (min-width: 768px) { ... }

      'lg': '1280px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1480',
      // => @media (min-width: 1280px) { ... }

      // '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
  },
  plugins: [],
}