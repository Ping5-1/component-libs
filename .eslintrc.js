module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: ['plugin:vue/recommended'], // 扩展使用 vue 检查规则和eslint推荐规则
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 7,
    sourceType: 'module'
  },
  parser: 'vue-eslint-parser',
  plugins: ['vue'],
  rules: {
    'no-console': 'off',
    eqeqeq: ['error', 'always'], // 必须使用全等号
    'vue/no-v-html': 0,
    'vue/html-indent': ['error', 2],
    indent: [1, 2],
    'no-tabs': 'off',
    'linebreak-style': ['off', 'windows'],
    quotes: ['error', 'single'],
    'jsx-quotes': ['error', 'prefer-single'],
    semi: ['error', 'always'],
    'no-unreachable': 'error', // 不能有无法执行的代码
    'no-unused-vars': 'warn', // 不能有声明后未被使用的变量或参数
    'space-infix-ops': 'error', // 二元运算符左右两边要有一个空格
    'no-debugger': 'off', // 禁止使用debugger
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }
    ], // 函数定义时括号前面要不要有空格
    'space-before-blocks': 'error', // 不以新行开始的块{前面要不要有空格
    'key-spacing': ['error', { beforeColon: false, afterColon: true }], // 对象字面量中冒号的前后空格
    'spaced-comment': 2 // 注释风格要不要有空格什么的
  }
};
