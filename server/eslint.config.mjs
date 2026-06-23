import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,

  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: config.files ?? ['src/**/*.ts'],
  })),

  {
    files: ['src/**/*.ts'],
    ignores: ['dist/**'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
);
