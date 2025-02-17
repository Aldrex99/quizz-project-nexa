/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-gradient": "var(--color-primary-gradient)",
        "primary-text": "var(--color-primary-text)",

        nav: "var(--color-nav)",
        "nav-hover": "var(--color-nav-hover)",
        "nav-selected": "var(--color-nav-selected)",

        themedText: "var(--color-text)",
        themedPlaceholder: "var(--color-placeholder)",
        themedBg: "var(--color-background)",
        themedFg: "var(--color-foreground)",
        themedBorder: "var(--color-border)",
      },
      boxShadow: {
        theme: "var(--box-shadow)",
      },
    },
  },
  plugins: [],
};
