// snitch/eslint.config.mjs
import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';

export default defineConfig([
  // ─── Ignore everything — each package has own config ──
  globalIgnores(['client/**', 'server/**', 'node_modules/**', 'dist/**', '.turbo/**']),

  // ─── Root JS files only — NO TypeScript parser ────────
  {
    files: ['*.js', '*.mjs', '*.cjs'],
    extends: [js.configs.recommended],
    // ⭐ parserOptions.project nahi — JS files ke liye TS parser nahi
  },
]);
