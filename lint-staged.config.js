export default {
  // Lint & Format TS/JS files
  '**/*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],

  // Format styles, configs, and markdown
  '**/*.{json,yaml,yml,md,css,scss,html}': ['prettier --write'],
};
