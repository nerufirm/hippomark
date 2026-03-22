import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0058bc',
        'primary-container': '#0070eb',
        'primary-fixed': '#d8e2ff',
        'primary-fixed-dim': '#adc6ff',
        secondary: '#5d5e63',
        'secondary-container': '#e0dfe4',
        'secondary-fixed-dim': '#c6c6cb',
        surface: '#f9f9fe',
        'surface-low': '#f3f3f8',
        'surface-lowest': '#ffffff',
        'surface-high': '#e8e8ed',
        'surface-highest': '#e2e2e7',
        'surface-dim': '#d9dade',
        'surface-container': '#ededf2',
        'on-surface': '#1a1c1f',
        'on-surface-variant': '#414755',
        'on-primary': '#ffffff',
        background: '#f9f9fe',
        outline: '#717786',
        'outline-variant': '#c1c6d7',
        error: '#ba1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
