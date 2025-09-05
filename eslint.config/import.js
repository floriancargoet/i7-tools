import importPlugin from "eslint-plugin-import";
import tsParser from "@typescript-eslint/parser";

export default [
  // https://github.com/import-js/eslint-plugin-import/pull/3018#issue-2362850053
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.react,
  importPlugin.flatConfigs.typescript,
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
        node: {
          extensions: [".mjs", ".js", ".jsx", ".json", ".ts", ".tsx", ".d.ts"],
        },
      },
      "import/extensions": [".js", ".mjs", ".jsx", ".ts", ".tsx", ".d.ts"],
    },
    rules: {
      // The following rules don't work with flat config as of 2024-09-24
      /*
      error  Parse errors in imported module XYZ: parserPath or languageOptions.parser is required! (undefined:undefined)  import/namespace
      */
      "import/namespace": "off",
      "import/default": "off",
      "import/no-named-as-default": "off",
      "import/no-named-as-default-member": "off",
      // end

      "import/extensions": "off",
      "import/no-duplicates": "warn",
      "import/prefer-default-export": "off",
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            // list files allowed to import dev deps
          ],
        },
      ],
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
          },
        },
      ],
    },
  },
];
