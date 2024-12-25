import globals from "globals";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin-js";

export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "commonjs",
            ecmaVersion: 2021,
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            "@stylistic/js": stylistic,
        },
        rules: {
            // Reglas estilísticas
            "@stylistic/js/indent": ["error", 2],
            "@stylistic/js/linebreak-style": ["error", "unix"],
            "@stylistic/js/quotes": ["error", "single"],
            "@stylistic/js/semi": ["error", "never"],

            // Otras reglas
            "no-trailing-spaces": "error",
            "object-curly-spacing": ["error", "always"],
            "arrow-spacing": ["error", { before: true, after: true }],
            "no-console": 0,
        },
    },
    js.configs.recommended,
    {
        ignores: ["node_modules/**", "dist/**", "docs/**", ".env"],
    },
];
