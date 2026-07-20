import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),

  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      globals: globals.browser,
    },

    rules: {
      // Allow `any`
      "@typescript-eslint/no-explicit-any": "off",

      // Allow unused variables (including _props)
      "@typescript-eslint/no-unused-vars": "off",

      // Allow @ts-ignore
      "@typescript-eslint/ban-ts-comment": "off",

      // Don't require hook dependencies
      "react-hooks/exhaustive-deps": "off",

      // Allow setState inside useEffect
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);