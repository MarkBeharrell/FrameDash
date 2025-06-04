module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-url": {
      url: (asset) => {
        if (asset.url.startsWith("../font/")) {
          return asset.url.replace("../font/", "/font/");
        }
        return asset.url;
      }
    },
    "postcss-preset-env": {
      stage: 3,
      browsers: "defaults, not dead, iOS >= 12"
    }
  }
};
