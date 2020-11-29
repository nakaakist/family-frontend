'use strict';

module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: ['vue', 'plugin:vue/recommended'],
  rules: {
    'space-before-function-paren': 'off',
  }
};
