import userModel, { IUser, UserWithoutPassword, type IUserCreate } from '@/models/user.model.js';
import { createLogger } from '@/utils/logger.js';

const logger = createLogger('USER-SERVICE');

// ------ Custom Errors ----------------------------

export class UserNotFoundError extends Error {
  public readonly statusCode = 404;
  constructor(identifier: string) {
    super(`User not found: ${identifier}`);
    this.name = 'UserNotFoundError';
  }
}

export class UserAlreadyExistsError extends Error {
  public readonly statusCode = 409;
  constructor() {
    super('User is already exists');
    this.name = 'UserAlreadyExistsError';
  }
}

export class EmailNotVerifiedError extends Error {
  public readonly statusCode = 401;
  constructor() {
    super('Email is not verified');
    this.name = 'EmailNotVerifiedError';
  }
}

export class InvalidCredentialsError extends Error {
  public readonly statusCode = 401;
  constructor() {
    super('Invalid creadentials');
    this.name = 'InvalidCredentialsError';
  }
}

export class ValidationError extends Error {
  public readonly statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends Error {
  public readonly statusCode = 401;
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class DatabaseOperationError extends Error {
  public readonly statusCode = 500;
  public readonly operation: string;

  constructor(operation: string, cause?: unknown) {
    super(`Internal server error: ${operation}`);

    this.name = 'DatabaseOperationError';

    this.operation = operation;
    this.cause = cause;
  }
}

// ------ Helpers ----------------------------
const MONGO_DUPLICATE_KEY_CODE = 11000;

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: number }).code === MONGO_DUPLICATE_KEY_CODE
  );
}

function isUserError(error: unknown): boolean {
  return (
    error instanceof UserNotFoundError ||
    error instanceof UserAlreadyExistsError ||
    error instanceof EmailNotVerifiedError ||
    error instanceof InvalidCredentialsError ||
    error instanceof ValidationError ||
    error instanceof DatabaseOperationError
  );
}

// ------ Service Functions --------------------

export async function userCreate(params: IUserCreate): Promise<UserWithoutPassword> {
  try {
    const createdUser = await userModel.create(params);
    logger.info(
      {
        message: {
          userId: createdUser.id,
          email: createdUser.email,
        },
      },
      'User created successfully',
    );
    return createdUser.toObject();
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      logger.warn(
        {
          err: {
            error,
            email: params.email,
          },
        },
        'User creation failed — duplicate email',
      );
      throw new UserAlreadyExistsError();
    }

    logger.error(
      {
        err: error,
        email: params.email,
      },
      'Unexpected error during user creation',
    );
    throw new DatabaseOperationError('userCreate', error);
  }
}

export async function userFindById(id: string): Promise<UserWithoutPassword> {
  try {
    const user = await userModel.findOne({ id }).select('-password').exec();
    if (!user) {
      logger.warn({ userId: id }, 'User not found by ID');
      throw new UserNotFoundError(id);
    }

    return user;
  } catch (error) {
    if (isUserError(error)) throw error;

    logger.error({ err: error, userId: id }, 'Unexpected error fetching user by ID');
    throw new DatabaseOperationError('userFindById', error);
  }
}

export async function userFindByEmail(email: string): Promise<UserWithoutPassword> {
  if (!email || typeof email !== 'string') {
    logger.warn({ email }, 'Invalid email provided to userFindByEmail');
    throw new ValidationError('Email must be a non-empty string');
  }

  const normalizedEmail = email.toLowerCase().trim();
  try {
    const user = await userModel
      .findOne({ email: normalizedEmail })
      .select('-password')
      .lean()
      .exec();

    if (!user) {
      logger.info({ email: normalizedEmail }, 'User not found by email');
      throw new InvalidCredentialsError();
    }

    if (!user.emailVerified) {
      logger.info({ email: normalizedEmail }, 'User found but email not verified');
      throw new EmailNotVerifiedError();
    }

    logger.info({ userId: (user as IUser)._id }, 'User fetched by email');

    return user as IUser;
  } catch (error) {
    if (isUserError(error)) throw error;

    logger.error({ err: error, email }, 'Unexpected error fetching user by email');
    throw new DatabaseOperationError('userFindByEmail', error);
  }
}

export async function userFindByEmailPassword(params: {
  email: string;
  password: string;
}): Promise<IUser> {
  const { email, password } = params;
  if (!email || typeof email !== 'string') {
    logger.warn({ email }, 'Invalid email provided to userFindByEmail');
    throw new ValidationError('Email must be a non-empty string');
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const user = await userModel.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (!user.emailVerified) {
      throw new EmailNotVerifiedError();
    }

    const compairPasswordResult = await user.comparePassword(password);
    if (!compairPasswordResult) {
      throw new InvalidCredentialsError();
    }

    logger.info('User finded------------------------->');
    return user;
  } catch (error) {
    if (isUserError(error)) throw error;

    logger.error({ err: error, email }, 'Unexpected error fetching user by email');
    throw new DatabaseOperationError('userFindByEmailPassword', error);
  }
}

export async function userExistByEmail(params: { email: string }): Promise<void> {
  const { email } = params;
  if (!email || typeof email !== 'string') {
    logger.info(
      {
        error: {
          email: email,
        },
      },
      'Invalid email provided to userCheckByEmail',
    );
    throw new ValidationError('Email must be a none-empty string');
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const exists = await userModel.exists({
      email: normalizedEmail,
    });

    if (exists) {
      throw new UserAlreadyExistsError();
    }
    return;
  } catch (error) {
    if (isUserError(error)) throw error;

    logger.error(
      {
        err: {
          error,
          email,
        },
      },
      'Unexpected error checking user by email',
    );
    throw new DatabaseOperationError('userCheckByEmail', error);
  }
}

export async function userExistByIdRole(params: {
  id: string;
  role: 'USER' | 'ADMIN';
}): Promise<void> {
  const { id, role } = params;
  if (!id || typeof id !== 'string') {
    throw new ValidationError('Id must be a non-empty string');
  }

  try {
    const exists = await userModel.exists({ id, role });
    if (!exists) {
      throw new UserNotFoundError(id);
    }
    return;
  } catch (error) {
    if (isUserError(error)) throw error;

    logger.error(
      {
        err: {
          error,
          userId: id,
          userRole: role,
        },
      },
      'Unexpected error checking user by id and role',
    );
    throw new DatabaseOperationError('userExistByIdRole', error);
  }
}
