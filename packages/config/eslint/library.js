/*
 * This is a custom ESLint configuration for use with
 * internal libraries within this Monorepo.
 *
 */

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["./base.js"],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
    "coverage/",
  ],
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
  ],
};
