

/** @type {import('tailwindcss').Config} */
export default {
  
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  
  
  theme: {
    extend: {
      colors: {
        // core surfaces
        base:  { DEFAULT: '#0B0F19' },
        panel: { DEFAULT: '#0F172A' },
        card:  { DEFAULT: '#111827' },
        // accents
        primary: { DEFAULT: '#2563EB', light: '#60A5FA' },
        // text
        ink: { DEFAULT: '#E5E7EB' }
      },
      plugins: [],
      boxShadow: {
        card: '0 6px 24px -8px rgba(0,0,0,0.5)'
      },
      borderRadius: {
        xl2: '1rem'
      }
    }
  },
  plugins: []
}
