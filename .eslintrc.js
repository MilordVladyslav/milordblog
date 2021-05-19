module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    parser: 'babel-eslint'
  },
  env: {
    es6: true,
    node: true,
    jest: true
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error'
  }
}
