import { PixKit } from '@nickdjangir/pixkit-sdk';
import config from '@/config/config.js';
import { createLogger } from '@/utils/logger.js';

const logger = createLogger('MEDIA-SERVICE');

// ─── Custom Errors ────────────────────────────────────────────────────────────

export class MediaNotFoundError extends Error {
  public readonly statusCode = 404;
  constructor(identifier: string) {
    super(`Media not found: ${identifier}`);
    this.name = 'MediaNotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class MediaOperationError extends Error {
  public readonly statusCode = 500;
  public readonly operation: string;
  constructor(operation: string, cause?: unknown) {
    super(`Media operation failed: ${operation}`);
    this.name = 'MediaOperationError';
    this.operation = operation;
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ImageProcessingError extends Error {
  public readonly statusCode = 500;
  public readonly operation: string;
  constructor(operation: string, cause?: unknown) {
    super(`Image processing error: ${operation}`);
    this.name = 'ImageProcessingError';
    this.operation = operation;
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── Guard Helper ─────────────────────────────────────────────────────────────

function isMediaError(error: unknown): boolean {
  return (
    error instanceof MediaNotFoundError ||
    error instanceof MediaOperationError ||
    error instanceof ImageProcessingError
  );
}

// ─── PixKit Client ────────────────────────────────────────────────────────────

const pixkit = new PixKit({
  publicKey: config.PIXKIT_PUBLIC_KEY,
  secretKey: config.PIXKIT_SECRET_KEY,
  projectId: config.PIXKIT_PROJECT_ID,
});

// ─── Service ──────────────────────────────────────────────────────────────────

export const mediaService = () => {
  const generateUrl = ({
    path,
    transformations,
  }: {
    path: string;
    transformations: {
      width: number;
      height: number;
      format?: 'webp' | 'avif';
      quality?: number;
    };
  }) => {
    try {
      const url = pixkit.url({ path, transformations });

      if (!url) {
        logger.warn({ path, transformations }, 'URL generation returned empty result');
        throw new MediaNotFoundError(path);
      }

      return url;
    } catch (error) {
      if (isMediaError(error)) throw error;

      logger.error({ err: error, path }, 'Unexpected error generating media URL');
      throw new ImageProcessingError('generateUrl', error);
    }
  };

  const uploadMedia = async ({
    file,
    fileName,
    fileType,
    folder,
  }: {
    file: Express.Multer.File;
    fileName: string;
    fileType: string;
    folder?: string;
  }) => {
    try {
      const webFile = new File([new Uint8Array(file.buffer)], fileName, { type: fileType });

      const result = await pixkit.upload({
        file: webFile,
        fileName,
        fileType,
        folder,
      });

      if (!result.success) {
        logger.warn({ fileName, folder }, 'Upload returned unsuccessful result');
        throw new MediaOperationError('uploadMedia');
      }

      return result;
    } catch (error) {
      if (isMediaError(error)) throw error;

      logger.error({ err: error, fileName, folder }, 'Unexpected error uploading media');
      throw new MediaOperationError('uploadMedia', error);
    }
  };

  const deleteMedia = async (imagePath: string) => {
    try {
      const result = await pixkit.delete(imagePath);

      if (!result.success) {
        logger.warn({ imagePath }, 'Delete returned unsuccessful result');
        throw new MediaOperationError('deleteMedia');
      }

      return result;
    } catch (error) {
      if (isMediaError(error)) throw error;

      logger.error({ err: error, imagePath }, 'Unexpected error deleting media');
      throw new MediaOperationError('deleteMedia', error);
    }
  };

  return {
    generateUrl,
    uploadMedia,
    deleteMedia,
  };
};
