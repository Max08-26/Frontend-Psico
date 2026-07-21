export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A90E2',
          dark: '#357ABD',
          light: '#7CB3E9',
        },
        secondary: {
          DEFAULT: '#F5A623',
          dark: '#D68910',
          light: '#FFD285',
        },
        accent: {
          yellow: '#FFD966',
          orange: '#FFB84D',
          green: '#A8D08D',
          cyan: '#8DD3E5',
          red: '#FF6B6B',
          gray: '#D3D3D3',
          purple: '#C9A8E5',
          pink: '#FFB3D9',
        },
      },
    },
  },
  plugins: [],
}

