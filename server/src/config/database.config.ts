import mongoose from 'mongoose';
import config from './config.js';
import { createLogger } from '@/utils/logger.js';

const logger = createLogger('DATABASE');

let isConnected = false;
const connectDB = async () => {
  if (isConnected) {
    logger.info('Aleady connected reusing existing connection');
    return;
  }
  try {
    const { connection, version } = await mongoose.connect(config.MONGODB_URI, {
      autoIndex: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    logger.info({ host: connection.host, version }, 'connected');

    connection.on('disconnected', () => {
      logger.warn('disconnected');
      isConnected = false;
    });

    connection.on('reconnected', () => {
      logger.info('reconnected');
      isConnected = true;
    });

    connection.on('error', (error) => {
      logger.error({ err: error }, 'connection error');
      isConnected = false;
    });
  } catch (error) {
    logger.error({ err: error }, 'connection failed');
    process.exit(1);
  }
};

export default connectDB;
