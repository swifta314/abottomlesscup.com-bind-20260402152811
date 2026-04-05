/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      colors: {
        cream: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#ede3d3',
        },
        espresso: {
          50: '#f7f3ef',
          100: '#e8ddd3',
          200: '#c9b5a0',
          400: '#8b6b52',
          600: '#5c3d2e',
          800: '#2d1b0e',
          900: '#1a0f07',
        },
        sage: {
          100: '#e8ede6',
          400: '#7a9b72',
          600: '#4a7042',
        },
      },
    },
  },
  plugins: [],
};
