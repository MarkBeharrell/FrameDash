// eslint.config.mjs
import js from "@eslint/js";
import next from "@next/eslint-plugin-next";
import * as importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tailwindcss from "eslint-plugin-tailwindcss";

export default [
  {
    ignores: [
      "node_modules",
      ".next",
      "out",
      "dist",
      "build",
      "public",
      "static",
      ".vercel",
      ".pnpm",
      ".vscode",
      "coverage",
      "*.log",
      ".env*",
      "**/__generated__/**",
      "types/generated/**",
      "**/*.min.js",
      "**/*.bundle.js",
      "babel.config.js",
      "tailwind.config.js",
      "postcss.config.js"
    ]
  },
  js.configs.recommended,
  {
    plugins: {
      "@next/next": next
    },
    rules: {
      ...next.configs["core-web-vitals"].rules
    }
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        // Server/Edge runtime APIs
        fetch: "readonly",
        Response: "readonly",
        Request: "readonly",
        Headers: "readonly",

        // Browser globals
        console: "readonly",
        window: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        process: "readonly",
        navigator: "readonly"
      }
    },
    plugins: {
      import: importPlugin,
      prettier,
      react,
      "react-hooks": reactHooks,
      tailwindcss
    },
    settings: {
      react: {
        version: "detect"
      },
      "import/resolver": {
        typescript: {},
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"]
        }
      }
    },
    rules: {
      // Base Rules
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,

      // Prettier formatting rules
      "prettier/prettier": [
        "warn",
        {
          semi: true,
          singleQuote: false,
          tabWidth: 2,
          useTabs: false,
          endOfLine: "lf",
          trailingComma: "none",
          printWidth: 80,
          arrowParens: "always",
          bracketSpacing: true,
          htmlWhitespaceSensitivity: "strict",
          quoteProps: "as-needed",
          jsxSingleQuote: false,
          vueIndentScriptAndStyle: false,
          proseWrap: "always"
        }
      ],

      // Tailwind-specific rules
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": "off",

      // React-specific tweaks
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // General tweaks
      "comma-dangle": "off"
    }
  }
];
