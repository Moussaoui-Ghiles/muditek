import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      "@next/next/no-html-link-for-pages": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "import/no-anonymous-default-export": "off",
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
      "react/jsx-no-comment-textnodes": "warn",
      "react/no-unescaped-entities": "warn",
    },
  },
];

export default eslintConfig;
