module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'curly': 'error',
    'no-console': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "padding-line-between-statements": [
      "error",
      { "blankLine": "always", "prev": "function", "next": "*" },
      { blankLine: 'always', prev: 'import', next: '*' },
      { blankLine: 'never', prev: 'import', next: 'import' },
    ],
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "ignoreRestSiblings": true
      }
    ],
    "no-unused-private-class-members": "error",
  },
};
