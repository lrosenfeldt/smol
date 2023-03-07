/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  env: {
    es2022: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["tsconfig.json", "./packages/*/tsconfig.json"],
  },
  plugins: ["@typescript-eslint", "prettier", "simple-import-sort"],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
};
module.exports = config;
