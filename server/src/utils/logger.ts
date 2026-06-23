// src/utils/logger.ts

import pino, { type Logger, type LoggerOptions } from 'pino';

// ─── Environment ──────────────────────────────────────────────────────────────

const isDevelopment = process.env.NODE_ENV !== 'production';
const LOG_LEVEL = process.env.LOG_LEVEL ?? (isDevelopment ? 'debug' : 'info');

// ─── Base Options ─────────────────────────────────────────────────────────────

const baseOptions: LoggerOptions = {
  level: LOG_LEVEL,

  // Rename default fields to cleaner names
  base: {
    pid: process.pid,
    env: process.env.NODE_ENV ?? 'development',
  },

  // ISO timestamp instead of epoch ms
  timestamp: pino.stdTimeFunctions.isoTime,

  // Redact sensitive fields from logs — NEVER log these
  redact: {
    paths: [
      'password',
      'hashedPassword',
      'token',
      'accessToken',
      'refreshToken',
      'apiKey',
      'secret',
      '*.password',
      '*.token',
      '*.apiKey',
      'req.headers.authorization',
      'req.headers.cookie',
    ],
    censor: '[REDACTED]',
  },
};

// ─── Transport (pretty print in dev, JSON in prod) ────────────────────────────

const transport = isDevelopment
  ? pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:HH:MM:ss.l', // readable timestamp
        ignore: 'pid,env', // dev mein clutter kam karo
        messageFormat: '[{context}] {msg}',
      },
    })
  : undefined; // production mein raw JSON — log aggregator (Datadog/CloudWatch) handle karega

// ─── Root Logger ──────────────────────────────────────────────────────────────

const rootLogger: Logger = transport ? pino(baseOptions, transport) : pino(baseOptions);

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates a child logger bound to a specific context (service/module name).
 *
 * Usage:
 *   const logger = createLogger('UserService');
 *   logger.info({ userId }, 'User created');
 */
export function createLogger(context: string): Logger {
  return rootLogger.child({ context });
}

// Root logger bhi export karo — middleware ya app-level logging ke liye
export { rootLogger as logger };
