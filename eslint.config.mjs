import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import next from "@next/eslint-plugin-next";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // ★ ここで Next.js ルールを上書きしimgに対しての警告を無効化
  {
    plugins: {
      "@next/next": next,
    },
    rules: {
      "@next/next/no-img-element": "off",
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
