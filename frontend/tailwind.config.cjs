/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        om: {
          bg: "#0b1220",          // deep navy background
          card: "#141b2d",        // card surface
          accent: "#6d6af8",      // primary button gradient start
          accent2: "#8a62ff"      // gradient end
        }
      },
      boxShadow: {
        card: "0 20px 45px rgba(0,0,0,0.35)"
      },
      backgroundImage: {
        "hero-arc": "url('/hero-arc.jpg')"   // see public asset below
      }
    }
  },
  plugins: []
};
