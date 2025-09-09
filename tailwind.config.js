/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Palette via CSS variables with sensible fallbacks
        primary: 'var(--color-primary, #051c33)', // Deep Navy Blue
        neutral: 'var(--color-neutral, #d9d9d9ff)', // Steel Grey
        accent: 'var(--color-accent, #1D9BF0)',   // Bright Electric Blue
        attention: 'var(--color-attention, #FF6B00)', // Safety Orange
        platinum: 'var(--color-platinum, #F9FAFB)', // Platinum White
        // Backwards-compat alias for previously used `brand`
        brand: 'var(--color-accent, #1D9BF0)'
      },
      fontFamily: {
        // Default pair
        heading: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        // Alternatives wired as utilities
        "heading-manrope": ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        "body-source": ["Source Sans 3", "ui-sans-serif", "system-ui", "sans-serif"],
        "heading-poppins": ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        "body-worksans": ["Work Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};


