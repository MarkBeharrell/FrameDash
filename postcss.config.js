module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-preset-env": {
      stage: 3,
      browsers: "defaults, not dead, iOS >= 12"
    }
  }
};
