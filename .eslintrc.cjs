module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    "airbnb",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "*.spec.jsx"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: { react: { version: "detect" } },
  plugins: ["react", "prettier", "react-hooks"],
  rules: {
    semi: "warn",
    "no-unused-vars": "warn",
    "import/no-extraneous-dependencies": "off",
    "react/prop-types": "off",
    "react/button-has-type": "off",
    "react/jsx-props-no-spreading": "off",
    "react/jsx-no-bind": "off",
    "react/self-closing-comp": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": ["warn", { extensions: [".js", ".jsx"] }],
    "no-param-reassign": 0,
    "no-underscore-dangle": "off",
    "no-restricted-syntax": ["error", "LabeledStatement", "WithStatement"],
    "no-useless-return": "off",
    "guard-for-in": "off",
    "consistent-return": "off",
    "no-shadow": "off",
  },
};
