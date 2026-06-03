const tailwindPostcss = require("@tailwindcss/postcss");

// CRA 5 hardcodes the legacy `tailwindcss` PostCSS plugin (broken in Tailwind v4).
// Swap it for the new `@tailwindcss/postcss` plugin while keeping CRA's other plugins.
module.exports = {
  style: {
    postcss: {
      mode: "extends",
      loaderOptions: (postcssLoaderOptions) => {
        const plugins = postcssLoaderOptions.postcssOptions.plugins || [];
        postcssLoaderOptions.postcssOptions.plugins = [
          tailwindPostcss,
          ...plugins.filter((p) => p !== "tailwindcss"),
        ];
        return postcssLoaderOptions;
      },
    },
  },
};
