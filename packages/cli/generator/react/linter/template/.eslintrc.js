module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['react', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended'
  ],
  globals: {
    document: 'readonly'
  },
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
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};