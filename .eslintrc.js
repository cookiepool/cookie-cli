module.exports = {
  env: {
    node: true
  },
  extends: [],
  parserOptions: {
    'ecmaVersion': 8
  },
  globals: {},
  rules: {
    // 缩进使用2个空格
    'indent': ['error', 2],
    // 语句末尾始终使用分号
    'semi': ['error', 'always'],
    // 不允许声明了变量但是不使用，目前关闭函数参数里面的变量未使用不报错
    'no-unused-vars': ['error', {
      'vars': 'all',
      'args': 'none',
      'ignoreRestSiblings': false
    }],
    'generator-star-spacing': 0
  }
};
