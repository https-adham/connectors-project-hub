/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#030712',
          navy: '#0a0f1e',
          card: '#0f172a',
          surface: '#131e36',
          border: 'rgba(56, 189, 248, 0.15)',
          blue: '#0284c7',
          electric: '#0ea5e9',
          cyan: '#06b6d4',
          neon: '#00f0ff',
          teal: '#14b8a6',
          emerald: '#10b981',
          accent: '#38bdf8',
        }
      },
      fontFamily: {
        sans: ['Cairo', 'Tajawal', 'system-ui', '-apple-system', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'glow-blue': '0 0 25px -5px rgba(14, 165, 233, 0.3)',
        'glow-teal': '0 0 25px -5px rgba(20, 184, 166, 0.3)',
        'glow-sm': '0 0 15px -3px rgba(56, 189, 248, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 4s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { borderColor: 'rgba(56, 189, 248, 0.2)', boxShadow: '0 0 10px rgba(56, 189, 248, 0.1)' },
          '100%': { borderColor: 'rgba(6, 182, 212, 0.5)', boxShadow: '0 0 25px rgba(6, 182, 212, 0.35)' },
        }
      }
    },
  },
  plugins: [],
}
