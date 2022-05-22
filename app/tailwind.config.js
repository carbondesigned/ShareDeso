module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1850px',
      },
    },
  },
  daisyui: {
    themes: [
      {
        apptheme: {
          primary: '#6EFABD',
          secondary: '#00C6BA',
          accent: '#1E1E1E',
          'base-100': '#E4E7E6',
          'base-200': '#C9CFCD',
          'base-300': '#2C2C2C',
          neutral: '#141414',
          info: '#97C9F7',
          success: '#23CE6B',
          warning: '#F7A350',
          error: '#FF2C55',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
