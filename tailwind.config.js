/** @type {import('tailwindcss').Config} */
module.exports = {
  // Habilita o dark mode via classe no elemento root
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      // Paleta de cores personalizada do portfólio
      colors: {
        primary: {
          50:  '#eefff7',
          100: '#d6fff0',
          200: '#b0ffe2',
          300: '#73ffcc',
          400: '#2ffdb2',
          500: '#05e696',
          600: '#00bf7a',
          700: '#009863',
          800: '#067a51',
          900: '#076444',
          950: '#013926',
        },
        surface: {
          light: '#f8fafc',
          dark:  '#0a0f1e',
        }
      },
      // Fontes personalizadas elegantes
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      // Animações customizadas
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(5, 230, 150, 0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(5, 230, 150, 0.6)' },
        }
      },
      animation: {
        'fade-up':        'fade-up 0.6s ease-out forwards',
        'fade-in':        'fade-in 0.5s ease-out forwards',
        'slide-in-left':  'slide-in-left 0.6s ease-out forwards',
        'pulse-slow':     'pulse-slow 3s ease-in-out infinite',
        'float':          'float 3s ease-in-out infinite',
        'glow':           'glow 2s ease-in-out infinite',
      },
      // Backdrop blur
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
