import http from 'node:http';
import app from './src/app.js';
import config from './src/config/config.js';
import connectDB from './src/config/database.config.js';
import { createLogger } from './src/utils/logger.js';
import { connectRedis } from './src/config/redis.config.js';

const logger = createLogger('Server');
let isShuttingDown = false;

function getPort(): number {
  const rawPORT = String(config.PORT).trim().split('/')[0];
  const port = parseInt(rawPORT, 10);
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error(`Invalid port: ${rawPORT}`);
  }

  return port;
}

async function bootstrap() {
  logger.info({ env: config.NODE_ENV }, 'starting application...');
  logger.info('connectiong database...');
  await connectDB();

  logger.info('connecting redis...');
  await connectRedis();

  const port = getPort();

  const server = http.createServer(app);
  server.listen(port, () => {
    logger.info(
      {
        port,
        env: config.NODE_ENV,
        pid: process.pid,
      },
      'started successfully',
    );
  });

  const gracefulShutdown = (signal: NodeJS.Signals) => {
    if (isShuttingDown) return;

    isShuttingDown = true;

    logger.info({ signal }, 'Shutting down server...');
    server.close((err) => {
      if (err) {
        logger.error({ error: err }, 'Error closing server');
        process.exit(1);
      }
      logger.info('closed successfully');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Graceful shutdown timeout exceeded');
      process.exit(1);
    }, 10_000).unref();
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

process.on('uncaughtException', (error) => {
  logger.error({ error }, 'Uncaught exception');
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  logger.error({ reason }, 'Unhandled rejection');
  process.exit(1);
});

bootstrap().catch((error) => {
  logger.error({ error }, 'Failed to application bootstrap');
  process.exit(1);
});
