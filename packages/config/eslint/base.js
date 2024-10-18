/*
 * This is a custom ESLint configuration for use with
 * all other configurations within Shared ESLint configurations
 *
 */

const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["eslint:recommended", "eslint-config-turbo", "prettier"],
  plugins: ["testing-library", "prettier"],
  rules: {
    quotes: ["error", "double", { avoidEscape: true }],
    "no-console": "error",
    "prettier/prettier": "warn",
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      env: { browser: true, es6: true, node: true },
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2018,
        sourceType: "module",
        project: "./tsconfig.json",
      },
      plugins: ["@typescript-eslint"],
      settings: {
        react: { version: "detect" },
        "import/resolver": {
          typescript: {
            project,
          },
        },
      },
      rules: {
        "@typescript-eslint/strict-boolean-expressions": "error",
      },
    },
    {
      files: ["**/*.test.ts", "**/*.test.tsx"],
      plugins: ["vitest"],
      rules: {
        "@typescript-eslint/unbound-method": "off", // allows to assert vitest-mock-extended toHaveBeenCalled()
      },
    },
  ],
};
