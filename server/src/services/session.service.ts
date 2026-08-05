import sessionModel, { type ISession, type ISessionCreate } from '@/models/session.model.js';
import { createLogger } from '@/utils/logger.js';
import { DatabaseOperationError } from './user.service.js';

const logger = createLogger('SESSION-SERVICE');

export class SessionNotFoundError extends Error {
  public readonly statusCode = 404;
  constructor(identifier: string) {
    super(`Session not found: ${identifier}`);
    this.name = 'SessionNotFoundError';
  }
}

export class SessionInvalidError extends Error {
  public readonly statusCode = 401;
  constructor() {
    super(`Session is invalid or expired`);
    this.name = 'SessionInvalidError';
  }
}

export class SessionCompareError extends Error {
  public readonly statusCode = 401;
  constructor() {
    super('Session token comparison failed');
    this.name = 'SessionCompareError';
  }
}

function isSessionError(error: unknown): boolean {
  return (
    error instanceof SessionNotFoundError ||
    error instanceof SessionInvalidError ||
    error instanceof SessionCompareError
  );
}

export async function createSession(params: ISessionCreate): Promise<ISession> {
  try {
    const createdSession = await sessionModel.create(params);
    return createdSession;
  } catch (error) {
    logger.error(
      {
        err: {
          error,
        },
      },
      'Unexpected error during session creation',
    );
    throw new DatabaseOperationError('sessionCreate', error);
  }
}

export async function validateAndExpireSession(params: {
  userId: string;
  deviceId: string;
  token: string;
}): Promise<void> {
  const { userId, deviceId, token } = params;
  try {
    const session = await sessionModel
      .findOne({
        userId,
        deviceId,
      })
      .exec();

    if (!session) {
      throw new SessionNotFoundError(deviceId);
    }

    // Security Check: If session is already revoked or expired, detect potential token reuse attack
    if (session.revoked || session.expiredAt.getTime() <= Date.now()) {
      logger.warn(
        { data: { userId, deviceId } },
        'SECURITY ALERT: Revoked or expired session reuse attempt detected. Revoking all active user sessions.',
      );
      await sessionModel.updateMany({ userId }, { $set: { revoked: true } });
      throw new SessionInvalidError();
    }

    const isTokenValid = await session.compareHashToken(token);

    if (!isTokenValid) {
      logger.warn(
        { data: { userId, deviceId } },
        'Session token comparison failed for user and device id',
      );

      throw new SessionCompareError();
    }

    await session.updateOne({
      $set: {
        revoked: true,
      },
    });

    return;
  } catch (error) {
    if (isSessionError(error)) {
      throw error;
    }

    logger.error(
      {
        err: error,
        userId,
        deviceId,
      },
      'Unexpected error during sessionFindCompareAndExpair',
    );
    throw new DatabaseOperationError('sessionFindCompareAndExpair', error);
  }
}

export async function validateAndExpireAllSessions(params: {
  userId: string;
  deviceId: string;
  token: string;
}): Promise<void> {
  const { userId, deviceId, token } = params;
  try {
    const session = await sessionModel.findOne({ userId, deviceId }).exec();

    if (!session) {
      throw new SessionNotFoundError(deviceId);
    }

    if (session.revoked || session.expiredAt.getTime() < Date.now()) {
      logger.warn({ data: { userId, deviceId } }, 'Session is already revoked or expired');
      throw new SessionInvalidError();
    }

    const isValid = await session.compareHashToken(token);

    if (!isValid) {
      logger.warn(
        { data: { userId, deviceId } },
        'Session token comparison failed for user and device id',
      );
      throw new SessionCompareError();
    }

    await sessionModel.updateMany({ userId }, { $set: { revoked: true } });

    return;
  } catch (error) {
    if (isSessionError(error)) {
      throw error;
    }

    logger.error(
      {
        err: error,
        userId,
        deviceId,
      },
      'Unexpected error during sessionFindCompareAndExpairAll',
    );
    throw new DatabaseOperationError('sessionFindCompareAndExpairAll', error);
  }
}

export async function getActiveSessions(userId: string): Promise<ISession[]> {
  try {
    return await sessionModel
      .find({
        userId,
        revoked: false,
        expiredAt: { $gt: new Date() },
      })
      .sort({ createdAt: -1 })
      .exec();
  } catch (error) {
    logger.error({ err: error, userId }, 'Unexpected error getting active sessions');
    throw new DatabaseOperationError('getActiveSessions', error);
  }
}

export async function revokeSessionByDeviceId(userId: string, deviceId: string): Promise<void> {
  try {
    const session = await sessionModel.findOne({ userId, deviceId }).exec();
    if (!session) {
      throw new SessionNotFoundError(deviceId);
    }
    await session.updateOne({ $set: { revoked: true } });
  } catch (error) {
    if (isSessionError(error)) {
      throw error;
    }
    logger.error({ err: error, userId, deviceId }, 'Unexpected error revoking session');
    throw new DatabaseOperationError('revokeSessionByDeviceId', error);
  }
}
