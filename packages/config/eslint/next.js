/*
 * This is a custom ESLint configuration for use with
 * internal applications that utilize Next.js.
 *
 */

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["./base.js", "next/core-web-vitals", "plugin:react/recommended"],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
    es6: true,
    jquery: true,
  },
  plugins: ["react"],
  ignorePatterns: [
    ".*.js", // ignore dotfiles
    "node_modules/", // ignore dependencies
    "coverage/",
  ],
};
