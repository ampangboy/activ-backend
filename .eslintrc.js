module.exports = {
  env: {
    node: true,
    'jest/global': true,
  },
  extends: ['airbnb-base', 'prettier', 'plugin:jest/recommended'],
  plugins: ['prettier', 'jest'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'no-console': 'off',
  },
  settings: {
    jest: {
      version: 27,
    },
  },
};
