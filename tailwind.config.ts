import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#d4af37',
          bright:  '#e8d5a5',
          dim:     'rgba(212,175,55,0.07)',
        },
        panel: {
          DEFAULT: '#141414',
          2:       '#1e1e1e',
          3:       '#252525',
        },
        bg: '#0a0a0a',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body:    ['Manrope', 'system-ui', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'monospace'],
      },
      borderColor: {
        line:      'rgba(212,175,55,0.10)',
        'line-hard': 'rgba(212,175,55,0.28)',
      },
      animation: {
        'fade-up':    'fadeInUp 0.6s ease both',
        'fade-in':    'fadeIn 0.5s ease both',
        'pulse-gold': 'pulse-gold 2.5s infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,175,55,0.4)' },
          '50%':      { boxShadow: '0 0 0 12px rgba(212,175,55,0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
