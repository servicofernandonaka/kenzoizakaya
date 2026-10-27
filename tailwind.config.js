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
        accent: token('accent'),
        accentsubtle: token('accentsubtle'),
        aizome: '#1B2A4A',
      },
      fontFamily: {
        serif: ['Lora', '"Iowan Old Style"', '"Palatino Linotype"', '"Noto Serif JP"', '"Hiragino Mincho ProN"', '"Yu Mincho"', 'Georgia', 'serif'],
        sans: ['Figtree', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', '"Noto Sans JP"', 'sans-serif'],
      },
      boxShadow: {
        lantern: 'none',
        'lantern-lg': 'none',
        panel: 'none',
        card: '0 1px 0 rgb(0 0 0 / .04)',
      },
      keyframes: {
        ring: {
          '0%,100%': { boxShadow: '0 0 0 1px rgb(var(--c-accent) / .6)' },
          '50%': { boxShadow: '0 0 0 3px rgb(var(--c-accent) / .9)' },
        },
      },
      animation: {
        ring: 'ring 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
