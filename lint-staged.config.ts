import type { Configuration } from 'lint-staged';

const config: Configuration = {
  // Server + Backend files
  'server/src/**/*.{js,ts}': ['eslint --fix', 'prettier --write'],

  // Frontend files
  'client/src/**/*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],

  // Style files
  '**/*.{css,scss}': ['prettier --write'],

  // Config & Documentation files
  '**/*.{json,md,yml,yaml}': ['prettier --write'],
};

export default config;
