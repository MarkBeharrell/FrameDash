// eslint.config.mjs
import js from "@eslint/js";
import next from "@next/eslint-plugin-next";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import * as importPlugin from "eslint-plugin-import";
import tailwindcss from "eslint-plugin-tailwindcss";
import prettier from "eslint-plugin-prettier";

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
        clearInterval: "readonly"
      }
    },
    plugins: {
      import: importPlugin,
      next,
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

      // Next.js Core Web Vitals (remapped to flat format)
      ...Object.fromEntries(
        Object.entries(next.configs["core-web-vitals"].rules).map(
          ([rule, val]) => [rule.replace("@next/next/", "next/"), val]
        )
      ),

      // Prettier formatting rules
      "prettier/prettier": [
        "warn",
        {
          semi: true,
          singleQuote: false,
          tabWidth: 2,
          useTabs: false,
          endOfLine: "lf",
          printWidth: 80,
          arrowParens: "always",
          proseWrap: "always",
          htmlWhitespaceSensitivity: "strict",
          bracketSpacing: true,
          insertPragma: false,
          requirePragma: false,
          quoteProps: "as-needed",
          trailingComma: "none",
          jsxSingleQuote: false,
          vueIndentScriptAndStyle: false
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
