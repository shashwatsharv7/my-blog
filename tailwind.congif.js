// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      ringOpacity: {
        '500': '0.5', // Add this line
      }
    },
  },
  variants: {
    extend: {
      ringOpacity: ['focus'], // Enable focus variant
    },
  },
  plugins: [],
};
