import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow any in AI response handling where types are dynamic
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow unused vars with underscore prefix
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }],
      // Allow require in test files
      "@typescript-eslint/no-require-imports": "warn",
      // React hooks exhaustive deps as warning
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    // Ignore test files for stricter rules
    ignores: ["**/__tests__/**", "**/*.test.ts", "**/*.test.tsx"],
  },
];

export default eslintConfig;
