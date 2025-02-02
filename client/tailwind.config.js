/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          goosebumps: {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.02)' },
          }
        },
        animation: {
          'goosebumps': 'goosebumps 0.3s ease-in-out',
        }
      },
    },
    plugins: [],
  }