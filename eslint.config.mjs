import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js, react: pluginReact },
    extends: ["js/recommended", tseslint.configs.recommended, pluginReact.configs.flat.recommended],
    languageOptions: { globals: globals.browser },
    rules: {
      "react/jsx-filename-extension": [2, { extensions: [".js", ".jsx", ".ts", ".tsx"] }],
      "react/jsx-props-no-spreading": 0,
      "import/no-unresolved": 0,
      "import/extensions": 0,
      "linebreak-style": 0,
      "import/prefer-default-export": 0,
      "no-param-reassign": 0,
      "react/no-array-index-key": 0,
      "react/jsx-no-useless-fragment": 0,
      "arrow-body-style": 0,
      "no-confusing-arrow": 0,
      "no-nested-ternary": 0,
      "react/function-component-definition": 0,
      "react/no-unstable-nested-components": 0,
      "react/require-default-props": 0
    }
  }
]);
