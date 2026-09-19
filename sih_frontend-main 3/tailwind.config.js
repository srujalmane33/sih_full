/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#020617',
          900: '#0f172a',
          850: '#151f32',
          800: '#1e293b',
          750: '#273549',
          700: '#334155',
          600: '#475569',
        },
        manganese: {
          50: '#fcf8f0',
          100: '#f8eedd',
          200: '#f0d9b6',
          300: '#e5be85',
          400: '#d99f53',
          500: '#cf852f',
          600: '#b76924',
          700: '#924d20',
          800: '#773d21',
          900: '#64341e',
          950: '#391a0c',
        },
        risk: {
          low: '#10b981',      // Emerald 500
          medium: '#f59e0b',   // Amber 500
          high: '#f97316',     // Orange 500
          critical: '#ef4444', // Red 500
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      keyframes: {
        'radar-ping': {
          '0%': { transform: 'scale(0.8)', opacity: '0.9' },
          '70%, 100%': { transform: 'scale(2.6)', opacity: '0' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'radar-ping': 'radar-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse-subtle': 'pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
