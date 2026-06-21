import redis from '@/config/redis.config.js';

export async function redisGet(key: string): Promise<string | null> {
  const value = await redis.get(key);
  if (!value) return null;
  return value;
}

export async function redisGetObject<T>(key: string): Promise<T | null> {
  const value = await redis.get(key);
  if (!value) return null;
  return JSON.parse(value) as T;
}

export async function redisSet(params: {
  key: string;
  value: string;
  ttl?: string;
}): Promise<void> {
  const { key, value, ttl } = params;
  if (ttl) await redis.set(key, value, 'EX', ttl);
  else await redis.set(key, value);
}

export async function redisSetObject<T>(params: {
  key: string;
  value: T;
  ttl?: string;
}): Promise<void> {
  const { key, value, ttl } = params;
  const stringValue = JSON.stringify(value);
  if (ttl) await redis.set(key, stringValue, 'EX', ttl);
  else await redis.set(key, stringValue);
}

export async function redisDel(params: { key: string }): Promise<void> {
  const { key } = params;
  await redis.del(key);
}

export async function redisExists(params: { key: string }): Promise<boolean> {
  const { key } = params;
  const exists = await redis.exists(key);
  return exists === 1;
}
