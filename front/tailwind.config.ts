import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          dark: '#2C0E40',
        },
        black: {
          deep: '#020016',
        },
        cream: {
          light: '#F0EEE9',
        },
      },
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'serif'],
        raleway: ['var(--font-raleway)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;