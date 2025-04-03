/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "480px",
      },
      typography: {
        DEFAULT: {
          css: {
            "> * + *": {
              marginTop: "1.25em",
            },
            h1: {
              fontFamily: "var(--font-heading)",
              fontSize: "3rem",
              lineHeight: "1.2",
              letterSpacing: "-0.025em",
              marginBottom: "1.5rem",
              "@screen xs": {
                fontSize: "4.5rem",
              },
              "@screen xl": {
                fontSize: "6rem",
              },
            },
            h2: {
              fontFamily: "var(--font-heading)",
              fontSize: "3rem",
              lineHeight: "1.2",
              letterSpacing: "-0.025em",
              marginBottom: "1.5rem",
              "@screen xs": {
                fontSize: "4.5rem",
              },
            },
            h3: {
              fontFamily: "var(--font-heading)",
              fontSize: "2.25rem",
              lineHeight: "1.2",
              letterSpacing: "-0.025em",
              marginBottom: "1.5rem",
              "@screen xs": {
                fontSize: "3.75rem",
              },
            },
            h4: {
              fontFamily: "var(--font-heading)",
              fontSize: "1.875rem",
              lineHeight: "1.2",
              letterSpacing: "-0.025em",
              marginBottom: "1.5rem",
              "@screen xs": {
                fontSize: "3rem",
              },
            },
            h5: {
              fontFamily: "var(--font-heading)",
              fontSize: "1.5rem",
              lineHeight: "1.2",
              letterSpacing: "-0.025em",
              marginBottom: "1.5rem",
              "@screen xs": {
                fontSize: "2.25rem",
              },
            },
            h6: {
              fontFamily: "var(--font-heading)",
              fontSize: "1.25rem",
              lineHeight: "1.2",
              letterSpacing: "-0.025em",
              marginBottom: "1.5rem",
              "@screen xs": {
                fontSize: "1.875rem",
              },
            },
            p: {
              fontFamily: "var(--font-body)",
              letterSpacing: "-0.015em",
              lineHeight: "1.5",
              marginBottom: "1.5rem",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
