/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Palette via CSS variables with sensible fallbacks
        primary: 'var(--color-primary, #0A2540)', // Deep Navy Blue
        neutral: 'var(--color-neutral, #d9d9d9ff)', // Steel Grey
        accent: 'var(--color-accent, #1D9BF0)',   // Bright Electric Blue
        attention: 'var(--color-attention, #FF6B00)', // Safety Orange
        platinum: 'var(--color-platinum, #F9FAFB)', // Platinum White
        // Backwards-compat alias for previously used `brand`
        brand: 'var(--color-accent, #1D9BF0)'
      },
    },
  },
  plugins: [],
};


