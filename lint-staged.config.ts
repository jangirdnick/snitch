import type { Configuration } from 'lint-staged';

const config: Configuration = {
  'server/src/**/*.{ts}': ['eslint --fix', 'prettier --write'],
};

export default config;
