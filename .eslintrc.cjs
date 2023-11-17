module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', "@typescript-eslint", "react-hooks", "eslint-plugin-import-helpers"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/react-in-jsx-scope": "off",
    'prettier/prettier': "error",
    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'always', // new line between groups
        groups: [
          ["/^react/"],
          ["/modules/"],
          ["/assets/"],
          "/^@shared/",
          ["/absolute/"],
          ["/components/"],
          ["parent", "sibling", "index"]
        ],
        alphabetize: { order: 'asc', ignoreCase: true },
      },
    ],
  },
}




