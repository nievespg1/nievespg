import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import astroPlugin from "eslint-plugin-astro";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  ...astroPlugin.configs.recommended,
  {
    rules: {
      // Allow explicit any when truly needed
      "@typescript-eslint/no-explicit-any": "warn",
      // Prefer const
      "prefer-const": "error",
      // No unused variables
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    ignores: ["dist/", ".astro/", "node_modules/"],
  },
);