import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#0B0F0E',
        card: '#141A18',
        elevated: '#1B2320',
        accent: {
          DEFAULT: '#B8F35A',
          hover: '#9DE339',
          muted: '#283815',
        },
        'text-primary': '#F3F5F1',
        'text-secondary': '#A0AAA3',
        'text-muted': '#6C7771',
        border: '#2B3530',
        critical: '#FF5A5A',
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'Arial Black', 'sans-serif'],
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        lg: '16px',
        md: '12px',
        sm: '8px',
      },
    },
  },
  plugins: [],
};

export default config;
