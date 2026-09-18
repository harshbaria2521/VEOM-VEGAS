/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0B2545',
          navyDark: '#07162C',
          teal: '#134E43',
          tealLight: '#1A6356',
          tealSoft: '#E6F0ED',
          saffron: '#D97706',
          saffronSoft: '#FEF3C7',
          gold: '#C98A3A',
          cream: '#FAF8F5',
          sand: '#F3EFE6',
          surface: '#FFFFFF',
          border: '#E2E8F0',
          textMuted: '#64748B',
          textMain: '#1E293B',
        },
        risk: {
          low: '#16A34A',
          lowBg: '#DCFCE7',
          moderate: '#D97706',
          moderateBg: '#FEF3C7',
          high: '#DC2626',
          highBg: '#FEE2E2',
          critical: '#991B1B',
          criticalBg: '#FFE4E6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      }
    },
  },
  plugins: [],
};
