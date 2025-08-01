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
        // Primary Colors
        primary: {
          warm: "#FFF8F0",      // Main background
          blue: "#7B9AE0",      // Interactive elements
          navy: "#2C3E50",      // Text and headers
        },
        // Secondary Colors
        secondary: {
          peach: "#FFB4A1",     // Warm accents
          lavender: "#D4C5F0",  // Gentle backgrounds
          cream: "#F7F1E8",     // Card backgrounds
        },
        // Accent Colors
        accent: {
          gold: "#F4D03F",      // Magical elements
          rose: "#F1948A",      // Warm interactive
          mint: "#A8E6CF",      // Success states
          coral: "#FF8A65",     // Playful CTAs
        },
        // Functional Colors
        success: "#81C784",
        warning: "#FFB74D",
        error: "#F48FB1",
        neutral: "#95A5A6",
        // Story Mode Colors
        realistic: "#5DADE2",
        fantasy: "#BB8FCE",
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Georgia", "ui-serif", "serif"],
        comic: ["Comic Neue", "cursive"],
      },
      fontSize: {
        // Custom story text sizes
        "story-reading": ["24px", "32px"],
        "story-caption": ["20px", "28px"],
        "magic": ["18px", "24px"],
      },
      spacing: {
        // Additional spacing for touch targets
        "touch-sm": "44px",   // Minimum touch target
        "touch-md": "48px",   // Secondary buttons
        "touch-lg": "52px",   // Primary buttons
        "touch-xl": "56px",   // Magic buttons
      },
      borderRadius: {
        "button-sm": "24px",  // Secondary buttons
        "button-md": "26px",  // Primary buttons
        "button-lg": "28px",  // Magic buttons
      },
      animation: {
        "draw-star": "drawStar 2s ease-in-out infinite",
        "draw-pen": "drawPen 3s ease-in-out infinite",
      },
      keyframes: {
        drawStar: {
          "0%, 100%": { opacity: "0", transform: "scale(0.8) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1.2) rotate(180deg)" },
        },
        drawPen: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(20px, -10px) rotate(15deg)" },
          "50%": { transform: "translate(40px, 0px) rotate(0deg)" },
          "75%": { transform: "translate(20px, 10px) rotate(-15deg)" },
        },
      },
      boxShadow: {
        "button-primary": "0px 4px 12px rgba(255, 138, 101, 0.3)",
        "button-magic": "0px 6px 16px rgba(123, 154, 224, 0.4)",
      },
    },
  },
};

export default config;