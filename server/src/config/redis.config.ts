import { Redis } from 'ioredis';
import config from './config.js';
import { createLogger } from '@/utils/logger.js';

const logger = createLogger('REDIS');

const redis = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD,

  lazyConnect: true,
  enableReadyCheck: true,
  maxRetriesPerRequest: 5,

  retryStrategy(times) {
    if (times > 5) {
      logger.error('retryStrategy: connection failed after 5 retries');
      return null;
    }

    const delay = Math.min(times * 200, 2000);
    logger.warn(`retryStrategy: connection retry in ${delay}ms`);
    return delay;
  },
});

redis.on('connect', () => {
  logger.info('connect event fired');
});

redis.on('ready', () => {
  logger.info('ready event fired');
});

redis.on('error', (error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  logger.error({ error: errorMessage }, 'error event fired');
});

const connectRedis = async () => {
  try {
    await redis.connect();
    await redis.ping();
    logger.info('ping successful');
  } catch (error) {
    logger.error({ err: error }, 'connect failed');
    throw error;
  }
};

export { connectRedis };
export default redis;
