import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintCommentsConfig from "@eslint-community/eslint-plugin-eslint-comments/configs";
import pluginPromise from "eslint-plugin-promise";
import prettierConfig from "eslint-config-prettier";
import typescriptConfigs from "./eslint.config/typescript.js";
import importConfigs from "./eslint.config/import.js";

export default tseslint.config(
  eslint.configs.recommended,
  ...typescriptConfigs,
  ...importConfigs,
  eslintCommentsConfig.recommended,
  pluginPromise.configs["flat/recommended"],
  // Must come last to disable rules handled by prettier
  prettierConfig,

  {
    ignores: [
      "dist/",
      "src/MultiReleaser/browser-select-version.js",
      // Ignore self
      "eslint.config.js",
      "eslint.config/",
    ],
  },

  {
    /***************
     * Other rules *
     ***************/
    rules: {
      "@eslint-community/eslint-comments/no-unlimited-disable": "warn",
      "prefer-destructuring": "off",
      "prefer-const": "warn",
      "no-plusplus": "off",
      "no-inner-declarations": "off",
      "arrow-body-style": "off",
      "no-debugger": "warn",
      "prefer-template": "warn",
      "no-nested-ternary": "warn",
      "no-param-reassign": "warn",
      "no-extra-boolean-cast": "off",
      "max-len": [
        "warn",
        {
          code: 80,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreComments: true,
        },
      ],
      "spaced-comment": [
        "warn",
        "always",
        { exceptions: ["*"], markers: ["/"] },
      ],
      //"no-underscore-dangle": ["warn", { allow: ["__typename"] }],
    },
  }
);
