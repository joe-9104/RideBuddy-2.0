module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // main primary
          50: '#eaf2ff',
          100: '#d8e6ff',
          200: '#a9ccff',
          300: '#7ab2ff',
          400: '#4b98ff',
          500: '#2563eb',
          600: '#1f4fd0',
          700: '#183aa6',
          800: '#11297a',
          900: '#07173f'
        },
        secondary: {
          DEFAULT: '#7c3aed',
          50: '#f4edff',
          100: '#e9dbff',
          200: '#d0b8ff',
          300: '#b594ff',
          400: '#9b71ff',
          500: '#7c3aed',
          600: '#6629c1',
          700: '#4f1f91',
          800: '#37145f',
          900: '#1f0a30'
        },
        accent: {
          DEFAULT: '#06b6d4',
          500: '#06b6d4',
          600: '#0891b2'
        },
        success: {
          DEFAULT: '#16a34a'
        },
        info: {
          DEFAULT: '#0ea5e9'
        },
        warning: {
          DEFAULT: '#f59e0b'
        },
        danger: {
          DEFAULT: '#ef4444'
        },
        neutral: {
          DEFAULT: '#6b7280'
        },
        background: {
          DEFAULT: '#f8fafc'
        },
        foreground: {
          DEFAULT: '#0f172a'
        }
      }
    }
  },
  plugins: []
};
