module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    colors: {
      esther: "var(--color-esther)",
      secondary: "var(--color-secondary)",
      primary: "var(--color-primary)",
      title: "var(--color-title)",
      white: "#fff",
    },
    screens: {
      "2xl": "1400px",
      xl: { max: "1400px" },
      lg: { max: "1200px" },
      md: { max: "992px" },
      sm: { max: "768px" },
      xs: { max: "576px" },
    },
    extend: {},
  },
  plugins: [],
};
