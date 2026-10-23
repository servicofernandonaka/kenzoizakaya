const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: token('canvas'),
        surface: token('surface'),
        raised: token('raised'),
        ink: token('ink'),
        mute: token('mute'),
        line: token('line'),
        lantern: token('lantern'),
        lanternink: token('lanternink'),
        onlantern: token('onlantern'),
        focus: token('focus'),
        aizome: '#1B2A4A',
      },
      fontFamily: {
        serif: ['"Noto Serif JP"', '"Sawarabi Mincho"', '"Hiragino Mincho ProN"', '"Yu Mincho"', 'Georgia', 'serif'],
        sans: ['Inter', '"Noto Sans JP"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        lantern:
          '0 0 0 1px rgb(211 47 47 / .55), 0 2px 10px rgb(211 47 47 / .35), 0 0 28px rgb(211 47 47 / .30), 0 0 64px rgb(211 47 47 / .18)',
        'lantern-lg':
          '0 0 0 2px rgb(211 47 47 / .65), 0 4px 18px rgb(211 47 47 / .45), 0 0 44px rgb(211 47 47 / .40), 0 0 110px rgb(211 47 47 / .25)',
        panel: '0 1px 0 rgb(255 255 255 / .04) inset, 0 10px 30px -12px rgb(0 0 0 / .55)',
      },
      keyframes: {
        flicker: {
          '0%,100%': { opacity: '1' },
          '45%': { opacity: '.86' },
          '60%': { opacity: '.97' },
          '80%': { opacity: '.9' },
        },
        ring: {
          '0%,100%': { boxShadow: '0 0 0 1px rgb(211 47 47 / .6), 0 0 14px rgb(211 47 47 / .45)' },
          '50%': { boxShadow: '0 0 0 2px rgb(239 83 80 / .9), 0 0 42px rgb(211 47 47 / .8)' },
        },
        rise: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        flicker: 'flicker 3.4s ease-in-out infinite',
        ring: 'ring 1s ease-in-out infinite',
        rise: 'rise .35s ease-out both',
      },
    },
  },
  plugins: [],
};
