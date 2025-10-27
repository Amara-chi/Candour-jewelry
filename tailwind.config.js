/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
];
export const darkMode = 'class';
export const theme = {
  extend: {
    colors: {
      primary: {
        50: '#fefce8',
        100: '#fef9c3',
        200: '#fef08a',
        300: '#fde047',
        400: '#facc15',
        500: '#eab308', // Gold
        600: '#ca8a04',
        700: '#a16207',
        800: '#854d0e',
        900: '#713f12',
      },
      wine: {
        0:  '#F9EAEA',
        100: '#F2D3D5',
        200: '#E5A9AD',
        300: '#D47A81',
        400: '#BF4D57',
        500: '#A9343F',
        600: '#8F2C36',
        700: '#722F37', // Deep wine (main)
        800: '#5A242C',
        900: '#41181F',
      },
      dark: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a', // Dark
      },
      neutral: {
        50: '#FAF8F3',  // Ivory
        100: '#EAE6DA', // Sand Beige
        200: '#C2B8A3', // Muted Taupe
      },
      emerald: {
        500: '#0B6E4F',
        600: '#085C42',
      },
    },
    fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  serif: ['Playfair Display', 'serif'],
  parisienne: ['Parisienne', 'cursive'],
},
    boxShadow: {
      soft: '0 2px 8px rgba(0,0,0,0.08)',
      gold: '0 0 10px rgba(218,165,32,0.3)',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '3rem',
        xl: '4rem',
      },
    },
  },
};
export const plugins = [];
