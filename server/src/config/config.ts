import 'dotenv/config';

interface ConfigEnv {
  PORT: number;
  NODE_ENV: string;
  MONGODB_URI: string;
  CORS_ORIGIN: string;
  JWT_SECRET: string;
  RESEND_API_KEY: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
}

function requireENV(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value.trim();
}

function requireENVNumber(key: string): number {
  const value = requireENV(key);
  const parsed = Number(value);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number, got: "${value}"`);
  }
  return parsed;
}

const config: ConfigEnv = {
  PORT: requireENVNumber('PORT'),
  NODE_ENV: requireENV('NODE_ENV'),
  MONGODB_URI: requireENV('MONGODB_URI'),
  CORS_ORIGIN: requireENV('CORS_ORIGIN'),
  JWT_SECRET: requireENV('JWT_SECRET'),
  RESEND_API_KEY: requireENV('RESEND_API_KEY'),
  REDIS_HOST: requireENV('REDIS_HOST'),
  REDIS_PORT: requireENVNumber('REDIS_PORT'),
  REDIS_PASSWORD: requireENV('REDIS_PASSWORD'),
};

export default config;
