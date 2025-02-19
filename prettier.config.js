/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: "es5",
  bracketSpacing: false,
  tabWidth: 2,
  useTabs: false,
  printWidth: 120,
};

export default config;
