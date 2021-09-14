module.exports = {
  env: {
    node: true,
    'jest/globals': true,
  },
  extends: ['plugin:jest/recommended', 'airbnb-base', 'prettier'],
  plugins: ['jest', '@babel', 'prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'no-console': 'off',
    'linebreak-style': 'off',
  },
};
