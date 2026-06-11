import 'dotenv/config';
interface ConfigEnv {
  PORT: string;
  NODE_ENV: string;
  MONGODB_URI: string;
  CORS_ORIGIN: string;
}

function requireENV({ key, value }: { key: string; value: string }) {
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

const config: ConfigEnv = {
  PORT: requireENV({ key: 'PORT', value: process.env.PORT! }),
  NODE_ENV: requireENV({ key: 'NODE_ENV', value: process.env.NODE_ENV! }),
  MONGODB_URI: requireENV({ key: 'MONGODB_URI', value: process.env.MONGODB_URI! }),
  CORS_ORIGIN: requireENV({ key: 'CORS_ORIGIN', value: process.env.CORS_ORIGIN! }),
};

export default config;
