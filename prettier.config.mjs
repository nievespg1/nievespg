/** @type {import("prettier").Config} */
export default {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "all",
  bracketSpacing: true,
  arrowParens: "always",
  proseWrap: "preserve",
  endOfLine: "lf",
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
    {
      files: ["*.md", "*.mdx"],
      options: {
        proseWrap: "always",
        printWidth: 80,
      },
    },
  ],
};