import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-emerald-500', 'bg-emerald-600', 'hover:bg-emerald-600',
    'bg-amber-500',   'bg-amber-600',   'hover:bg-amber-600',
    'bg-red-500',     'bg-red-600',     'hover:bg-red-600',
    'bg-neutral-900', 'bg-neutral-700',
    'bg-primary-500', 'bg-primary-600',
    'text-white', 'text-emerald-600', 'text-emerald-400',
    'border-emerald-500',
    'rounded-button', 'rounded-card',
    'from-blue-700', 'via-blue-600', 'to-sky-400',
    'bg-gradient-to-br',
  ],
  theme: {
    extend: {
      colors: {
        // ── Neutral (base UI) ─────────────────────────────────
        neutral: {
          50:  '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },

        // ── Primary (emerald — interactive elements) ──────────
        primary: {
          50:  '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },

        // ── Accent (amber — highlights & CTA) ─────────────────
        accent: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },

        // ── Amber (duplicate for direct use) ──────────────────
        amber: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },

        // ── Semantic ──────────────────────────────────────────
        green: {
          50:  '#F0FDF4',
          100: '#DCFCE7',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          900: '#14532D',
        },
        red: {
          50:  '#FEF2F2',
          100: '#FEE2E2',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          900: '#7F1D1D',
        },
        blue: {
          50:  '#EFF6FF',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          900: '#1E3A8A',
        },

        // ── Border ───────────────────────────────────────────
        border: {
          light: '#E5E7EB',
          dark:  '#27272A',
          card:  '#F3F4F6',
        },

        // ── Background ────────────────────────────────────────
        background: {
          light: '#FAFAFA',
          dark:  '#09090B',
        },

        // ── Surface (card backgrounds) ────────────────────────
        surface: {
          light: '#FFFFFF',
          dark:  '#111111',
        },
      },

      fontFamily: {
        sans: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },

      borderRadius: {
        sm:     '4px',
        md:     '8px',
        lg:     '10px',
        xl:     '14px',
        '2xl':  '18px',
        '3xl':  '24px',
        full:   '9999px',
        card:   '12px',
        button: '8px',
      },

      boxShadow: {
        xs:        '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        sm:        '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        md:        '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        lg:        '0 8px 20px -3px rgb(0 0 0 / 0.10), 0 4px 8px -4px rgb(0 0 0 / 0.06)',
        xl:        '0 16px 40px -4px rgb(0 0 0 / 0.12)',
        amber:     '0 4px 14px 0 rgb(245 158 11 / 0.35)',
        'amber-lg':'0 8px 24px 0 rgb(245 158 11 / 0.40)',
        dark:      '0 4px 14px 0 rgb(0 0 0 / 0.30)',
        inner:     'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'glow-sm': '0 0 12px rgba(16,185,129,0.20)',
        'glow':    '0 0 24px rgba(16,185,129,0.30)',
        'glow-accent': '0 0 20px rgba(245,158,11,0.30)',
      },

      animation: {
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-up':   'slideUp 0.25s cubic-bezier(0.16,1,0.3,1)',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.16,1,0.3,1)',
        'scale-in':   'scaleIn 0.18s cubic-bezier(0.16,1,0.3,1)',
        shimmer:      'shimmer 1.8s linear infinite',
      },

      keyframes: {
        fadeIn:    { from: { opacity: '0' },                                to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(8px)' },  to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.94)' },      to: { opacity: '1', transform: 'scale(1)' } },
        shimmer:   { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}

export default config
