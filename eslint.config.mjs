// eslint.config.mjs
import js from "@eslint/js";
import next from "@next/eslint-plugin-next";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import * as importPlugin from "eslint-plugin-import";
import "eslint-plugin-tailwindcss";
import "eslint-plugin-prettier";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,

      // Tailwind CSS
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": "off",

      // Prettier
      "prettier/prettier": "warn",

      // Misc React
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off"
    }
  }
];
