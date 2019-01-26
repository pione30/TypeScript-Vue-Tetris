module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/vue"
  ],
  "plugins": [
    "@typescript-eslint",
    "prettier",
    "vue"
  ],
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "parser": "@typescript-eslint/parser",
    "project": "./tsconfig.json",
    "extraFileExtensions": [".vue"]
  },
  "rules": {
    "prettier/prettier": [
      "error",
      {
        "tabWidth": 2,
        "trailingComma": "none",
        "semi": false
      }
    ]
  }
};