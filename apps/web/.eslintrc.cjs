module.exports = {
  root: true,
  extends: ["@ecommerce/eslint-config/next.js", "plugin:storybook/recommended"],
  parserOptions: {
    project: ["./tsconfig.json"],
  },
};
