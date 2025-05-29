/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg_color: "var(--tg-theme-bg-color, #FAFAFA)",
        secondary_bg_color: "var(--tg-theme-secondary-bg-color, #FFFFFF)",
        text_color: "var(--tg-theme-text-color, #1E1E1E)",
        hint_color: "var(--tg-theme-hint-color, #B4B4B4)",
        button_color: "#549bf8",
        button_text_color: "#FFFFFF",
        pantone_color: "#f87c56",

        bg_plain: "#FEB72D",
        bg_scarce: "#F87C56",
        bg_epic: "#51CFF6",
      },
      backgroundImage: {
        "death-pattern": "url('./src/assets/death_bg.svg')",
        "onboarding-pattern": "url('./src/assets/kraken.svg')",
      },
    },
  },
  plugins: [],
};
