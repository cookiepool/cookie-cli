module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['vue', 'prettier'],
  extends: ['plugin:vue/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 2020
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        arrowParens: 'always',
        endOfLine: 'auto',
        trailingComma: 'none'
      }
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
};