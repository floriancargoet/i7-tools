import { resolve } from "node:path";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.recommendedTypeChecked,
  {
    // Config for tseslint's recommendedTypeChecked
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: resolve(import.meta.dirname, ".."),
      },
    },
  },
  {
    // Eslint replacements

    // some rules are taken from now deprecated eslint-config-airbnb-typescript
    rules: {
      // Replace 'camelcase' rule with '@typescript-eslint/naming-convention'
      // https://typescript-eslint.io/rules/naming-convention/
      camelcase: "off",
      "naming-convention": "off",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          // filter: {
          //   // you can expand this regex to add more allowed names
          //   regex: "^(__typename)$",
          //   match: false,
          // },
        },
        { selector: "function", format: ["camelCase", "PascalCase"] },
        { selector: "typeLike", format: ["PascalCase"] },
      ],

      // Replace 'default-param-last' rule with '@typescript-eslint' version
      // https://typescript-eslint.io/rules/default-param-last/
      "default-param-last": "off",
      "@typescript-eslint/default-param-last": "error",

      // Replace 'dot-notation' rule with '@typescript-eslint' version
      // https://typescript-eslint.io/rules/dot-notation/
      "dot-notation": "off",
      "@typescript-eslint/dot-notation": ["error", { allowKeywords: true }],

      // Replace 'no-array-constructor' rule with '@typescript-eslint' version
      // https://typescript-eslint.io/rules/no-array-constructor/
      "no-array-constructor": "off",
      "@typescript-eslint/no-array-constructor": "error",

      // Replace 'no-dupe-class-members' rule with '@typescript-eslint' version
      // https://typescript-eslint.io/rules/no-dupe-class-members/
      "no-dupe-class-members": "off",
      "@typescript-eslint/no-dupe-class-members": "error",

      // Replace 'no-empty-function' rule with '@typescript-eslint' version
      // https://typescript-eslint.io/rules/no-empty-function/
      "no-empty-function": "off",
      "@typescript-eslint/no-empty-function": [
        "error",
        {
          allow: ["arrowFunctions", "functions", "methods"],
        },
      ],

      // Replace 'no-implied-eval' and 'no-new-func' rules with '@typescript-eslint' version
      // https://typescript-eslint.io/rules/no-implied-eval/
      "no-implied-eval": "off",
      "no-new-func": "off",
      "@typescript-eslint/no-implied-eval": "error",

      // Replace 'no-loop-func' rule with '@typescript-eslint' version
      // https://typescript-eslint.io/rules/no-loop-func/
      "no-loop-func": "off",
      "@typescript-eslint/no-loop-func": "error",

      // Replace 'no-magic-numbers' rule with '@typescript-eslint' version
      // https://typescript-eslint.io/rules/no-magic-numbers/
      "no-magic-numbers": "off",
      "@typescript-eslint/no-magic-numbers": [
        "off",
        {
          ignore: [],
          ignoreArrayIndexes: true,
          enforceConst: true,
          detectObjects: false,
        },
      ],

      // Replace 'no-redeclare' rule with '@typescript-eslint' version
      // https://typescript-eslint.io/rules/no-redeclare/
      "no-redeclare": "off",
      "@typescript-eslint/no-redeclare": "error",

      // Replace 'no-shadow' rule with '@typescript-eslint' version
      // https://typescript-eslint.io/rules/no-shadow/
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "warn",

      // Replace 'no-throw-literal' rule with '@typescript-eslint' version
      // https://typescript-eslint.io/rules/no-throw-literal/
      "no-throw-literal": "off",
      "@typescript-eslint/only-throw-error": "error",

      // Replace 'no-unused-expressions' rule with '@typescript-eslint' version
      // https://typescript-eslint.io/rules/no-unused-expressions/
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "warn",

      // Replace 'no-unused-vars' rule with '@typescript-eslint' version
      // https://typescript-eslint.io/rules/no-unused-vars/
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          caughtErrors: "all",
          args: "none",
          varsIgnorePattern: "^[iI]gnored",
          caughtErrorsIgnorePattern: "^[iI]gnored",
          destructuredArrayIgnorePattern: "^[iI]gnored",
          ignoreRestSiblings: true,
          reportUsedIgnorePattern: true,
        },
      ],

      // Replace 'no-use-before-define' rule with '@typescript-eslint' version
      // https://typescript-eslint.io/rules/no-use-before-define/
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": "off",

      // Replace 'no-useless-constructor' rule with '@typescript-eslint' version
      // https://typescript-eslint.io/rules/no-useless-constructor/
      "no-useless-constructor": "off",
      "@typescript-eslint/no-useless-constructor": "error",

      // Replace 'require-await' rule with '@typescript-eslint' version
      // https://typescript-eslint.io/rules/require-await/
      "require-await": "off",
      "@typescript-eslint/require-await": "off",

      // Replace 'no-return-await' rule with '@typescript-eslint' version
      // https://typescript-eslint.io/rules/return-await/
      "no-return-await": "off",
      "@typescript-eslint/return-await": ["error", "in-try-catch"],
    },
  },
  {
    // More rules
    rules: {
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/lines-between-class-members": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-explicit-any": [
        "warn",
        {
          ignoreRestArgs: true,
        },
      ],
      "@typescript-eslint/no-deprecated": "warn",
    },
  },
];
