const js = require("@eslint/js");
const globals = require("globals");
const pluginReact = require("eslint-plugin-react");
const pluginNext = require("@next/eslint-plugin-next");

module.exports = [
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      js,
      react: pluginReact,
      next: pluginNext,
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginNext.configs.recommended.rules,

      // Optional custom rules
      "react/prop-types": "off",
      "no-unused-vars": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
