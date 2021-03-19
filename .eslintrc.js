module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    // 'jest/globals': true,
  },
  extends: [
    'standard',
    'plugin:jest/recommended',
    'plugin:json/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    'comma-dangle': 'off',
    'space-before-function-paren': 'off',
    // 'jest/no-mocks-import': 'off',
  },
};
