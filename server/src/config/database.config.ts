import mongoose from 'mongoose';
import config from './config.js';
import { logger } from '@/utils/logger.js';

let isConnected = false;
const connectDB = async () => {
  if (isConnected) {
    return;
  }
  try {
    const connection = await mongoose.connect(config.MONGODB_URI, {
      autoIndex: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    logger.info(
      `[DATABASE] connected to host=${connection.connection.host}, version=${connection.version}`,
    );

    connection.connection.on('disconnected', () => {
      logger.warn('[DATABASE] disconnected');
      isConnected = false;
    });

    connection.connection.on('reconnected', () => {
      logger.warn('[DATABASE] reconnected');
      isConnected = true;
    });

    connection.connection.on('error', (error) => {
      logger.error(error, '[DATABASE] connection error');
      isConnected = false;
    });
  } catch (error) {
    logger.error(error, '[DATABASE] connection failed');
    process.exit(1);
  }
};

export default connectDB;
