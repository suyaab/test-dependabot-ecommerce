import type { Config } from "tailwindcss";

const config: Omit<Config, "content"> = {
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      xxl: "1440px",
      fhd: "1920px",
      qhd: "2560px",
      uwqhd: "3440px",
      uhd: "3840px",
    },
    extend: {
      colors: {
        // !!! Brandbook colors only
        blue: {
          DEFAULT: "#009CDE", // Abbott Primary Blue
        },
        red: {
          DEFAULT: "#E4002B", // Abbott Red
        },
        green: {
          DEFAULT: "#00B140", // Abbott Medium Green
        },
        yellow: {
          DEFAULT: "#FFD100", // Abbott Yellow
        },
        orange: {
          DEFAULT: "#FF6900", // Abbott Orange
        },
        charcoal: {
          DEFAULT: "#222731", // Abbott Charcoal
        },
        linen: {
          DEFAULT: "#F1EEE6", // Lingo Linen
        },
        "linen-light": {
          DEFAULT: "#F9F7F2", // Lingo Linen Light
        },
      },
      fontSize: {
        xs: ["12px", "16px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["18px", "28px"],
      },
      fontFamily: {
        light: ["var(--font-matter-light), Arial, Helvetica, sans-serif"],
        normal: ["var(--font-matter-regular), Arial, Helvetica, sans-serif"],
        medium: ["var(--font-matter-medium), Arial, Helvetica, sans-serif"],
        semibold: ["var(--font-matter-semibold), Arial, Helvetica, sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      spacing: {
        "18": "4.5rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
};

export default config;
