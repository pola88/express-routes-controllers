import Globals from 'globals';

const rules = {
  'lines-between-class-members': [
    'error',
    'always',
    { exceptAfterSingleLine: false },
  ],
  'no-async-promise-executor': 'off',
  'no-restricted-globals': ['error', 'fdescribe', 'fit'],
  'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  'no-var': ['error'],
  'object-shorthand': ['error'],
  'prefer-const': ['error'],
  'prefer-template': ['error'],
  quotes: ['error', 'single', { avoidEscape: true }],
};

const globals = {
  ...Globals.node,
  ...Globals.jasmine,
};

export default [
  {
    files: ['**/*.js', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2023,
      globals,
    },
    rules,
  },
];
