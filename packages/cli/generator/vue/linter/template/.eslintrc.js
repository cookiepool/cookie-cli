module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['vue', 'prettier'],
  <%_ if(vueVersion === '2') { _%>
  extends: ['plugin:vue/recommended', 'plugin:prettier/recommended'],
  <%_ } _%>
  <%_ if(vueVersion === '3') { _%>
  extends: ['plugin:vue/vue3-recommended', 'plugin:prettier/recommended'],
  <%_ } _%>
  parserOptions: {
    <%_ if(webpack) { _%>
    parser: 'babel-eslint',
    <%_ } _%>
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