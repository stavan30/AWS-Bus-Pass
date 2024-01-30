module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "standard-with-typescript", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["react"],
  rules: {
    "@typescript-eslint/quotes": 0,
    "@typescript-eslint/semi": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "no-debugger": 0,
    "@typescript-eslint/restrict-template-expressions": 0,
    "@typescript-eslint/no-non-null-assertion": 1,
    "@typescript-eslint/restrict-plus-operands": 1,
    "@typescript-eslint/strict-boolean-expressions": 1,
  },
};
