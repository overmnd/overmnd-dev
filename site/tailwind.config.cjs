// Tailwind configuration that mirrors the admin portal's dark theme and accent colors.
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        om: {
          bg: "#0b1220",
          card: "#141b2d",
          accent: "#6d6af8",
          accent2: "#8a62ff"
        }
      },
      boxShadow: {
        card: "0 25px 50px -12px rgba(0, 0, 0, 0.45)"
      },
      backgroundImage: {
        "hero-arc": "radial-gradient(60% 50% at 70% 10%, rgba(109,106,248,0.25) 0%, rgba(109,106,248,0) 60%), radial-gradient(50% 40% at 30% 20%, rgba(138,98,255,0.18) 0%, rgba(138,98,255,0) 60%)"
      }
    }
  },
  plugins: []
};
