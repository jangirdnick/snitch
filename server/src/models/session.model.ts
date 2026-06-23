/**
 * ----------------------------------------------------------------------------
 * Session Model
 * ----------------------------------------------------------------------------
 *
 * Stores authenticated user sessions and refresh token metadata.
 *
 * Purpose:
 * - Session management
 * - Device tracking
 * - Refresh token validation
 * - Session revocation
 * - Multi-device authentication
 *
 * Security Features:
 * - Refresh tokens are stored as bcrypt hashes.
 * - Plain-text tokens are never persisted.
 * - Session revocation support.
 * - Device-level session tracking.
 * - Session expiration enforcement.
 *
 * Authentication Flow:
 *
 * Login
 *   ↓
 * Generate Refresh Token
 *   ↓
 * Hash Refresh Token
 *   ↓
 * Store Session Record
 *   ↓
 * Validate Session During Refresh
 *
 * Related Models:
 * - User
 *
 * ----------------------------------------------------------------------------
 */
import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { IUser } from './user.model.js';

interface ISessionMethord {
  compareHashToken: (token: string) => Promise<boolean>;
}

export type ISessionMethordDocument = ISessionMethord & Document;

/**
 * Session document interface.
 *
 * Represents a single authenticated device session.
 *
 * --------------------------------------------------------------------------
 * Required Fields
 * --------------------------------------------------------------------------
 *
 * @property id
 * Public session identifier.
 *
 * @property userId
 * User identifier associated with this session.
 *
 * @property user
 * User document associated with this session.
 *
 * @property deviceId
 * Unique device identifier.
 *
 * @property hashToken
 * Bcrypt hashed refresh token.
 *
 * @property revoked
 * Session revocation status.
 *
 * @property expiredAt
 * Session expiration timestamp.
 *
 * @property createdAt
 * Session creation timestamp.
 *
 * @property updatedAt
 * Session last update timestamp.
 *
 * --------------------------------------------------------------------------
 * Instance Methods
 * --------------------------------------------------------------------------
 *
 * @method compareHashToken
 * Compares a plain refresh token against
 * the stored hashed token.
 */
export interface ISession extends Document {
  id: string;
  userId: string;
  user: Types.ObjectId | IUser;
  deviceId: string;
  hashToken: string;
  revoked: boolean;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISessionCreate {
  userId: string;
  user: Types.ObjectId | IUser;
  deviceId: string;
  hashToken: string;
  expiredAt: Date;
}

/**
 * Session Schema
}
 * Stores active authentication sessions.
 *
 * Business Rules:
 *
 * - One user can have multiple sessions.
 * - One device maps to one session.
 * - Refresh tokens are hashed before storage.
 * - Revoked sessions cannot be used.
 * - Expired sessions cannot be refreshed.
 *
 * Automatic Fields:
 *
 * - createdAt
 * - updatedAt
 *
 * Middleware:
 *
 * - pre('save') token hashing
 *
 * Instance Methods:
 *
 * - compareHashToken()
 */
const sessionSchema: Schema<ISession> = new Schema(
  {
    id: { type: String, unique: true, index: true, default: () => randomUUID() },
    userId: { type: String, required: true },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    deviceId: { type: String, required: true },
    hashToken: { type: String, required: true },
    revoked: { type: Boolean, default: false },
    expiredAt: { type: Date, required: true },
  },
  { timestamps: true },
);

/**
 * User + Device lookup index.
 *
 * Optimizes:
 *
 * - Refresh token validation
 * - Device session lookup
 * - Logout from specific device
 * - Session revocation
 */
sessionSchema.index({
  userId: 1,
  deviceId: 1,
});

/**
 * Expired session cleanup index.
 *
 * Automatically removes expired sessions
 * after their expiration time.
 */
sessionSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

/**
 * Refresh Token Hashing Middleware.
 *
 * Executes before session persistence.
 *
 * Purpose:
 * - Prevent storage of plaintext refresh tokens.
 * - Protect users if database contents are exposed.
 *
 * Behavior:
 * - Runs only when hashToken changes.
 * - Uses bcrypt with 12 salt rounds.
 *
 * Security:
 * - Raw refresh tokens never reach the database.
 */
sessionSchema.pre('save', async function () {
  if (!this.isModified('hashToken')) return;
  this.hashToken = await bcrypt.hash(this.hashToken, 12);
});

/**
 * Verify refresh token.
 *
 * Compares the provided refresh token against
 * the stored bcrypt hash.
 *
 * Common Usage:
 *
 * const valid =
 *   await session.compareHashToken(
 *     refreshToken,
 *   );
 *
 * if (!valid) {
 *   throw new UnauthorizedException();
 * }
 *
 * @param token
 * Raw refresh token received from the client.
 *
 * @returns
 * Promise<boolean>
 *
 * Returns:
 * - true  -> token valid
 * - false -> token invalid
 */
sessionSchema.methods.compareHashToken = async function (token: string) {
  return await bcrypt.compare(token, this.hashToken);
};

/**
 * Session Model
 *
 * Primary interface for all session-related database operations.
 *
 * --------------------------------------------------------------------------
 * Common Operations
 * --------------------------------------------------------------------------
 *
 * Create Session:
 *
 * const session =
 *   await Session.create({
 *     userId: user.id,
 *     user: user._id,
 *     deviceId,
 *     hashToken,
 *     expiredAt,
 *   });
 *
 * --------------------------------------------------------------------------
 *
 * Find Session:
 *
 * const session =
 *   await Session.findOne({
 *     userId,
 *     deviceId,
 *   });
 *
 * --------------------------------------------------------------------------
 *
 * Populate User:
 *
 * const session =
 *   await Session.findOne({
 *     userId,
 *   }).populate('user');
 *
 * console.log(session.user.firstName);
 * console.log(session.user.email);
 *
 * --------------------------------------------------------------------------
 *
 * Find Session With User:
 *
 * const session =
 *   await Session.findOne({
 *     userId,
 *     deviceId,
 *   }).populate({
 *     path: 'user',
 *     select: 'id firstName lastName email role',
 *   });
 *
 * --------------------------------------------------------------------------
 *
 * Revoke Session:
 *
 * session.revoked = true;
 * await session.save();
 *
 * --------------------------------------------------------------------------
 *
 * Validate Refresh Token:
 *
 * const valid =
 *   await session.compareHashToken(
 *     refreshToken,
 *   );
 *
 * --------------------------------------------------------------------------
 *
 * Delete Session:
 *
 * await Session.deleteOne({
 *   userId,
 *   deviceId,
 * });
 *
 * --------------------------------------------------------------------------
 *
 * Notes:
 *
 * - userId stores the public user identifier (UUID).
 * - user stores the MongoDB ObjectId reference.
 * - Refresh tokens are stored as bcrypt hashes.
 * - Raw refresh tokens are never persisted.
 * - Supports multi-device authentication.
 * - Supports device-specific logout.
 * - Supports populate('user') for loading user details.
 */
const sessionModel: Model<ISession, Record<string, never>, ISessionMethord> = (mongoose.models
  .Session as Model<ISession, Record<string, never>, ISessionMethord>) ||
mongoose.model<ISession, Model<ISession, Record<string, never>, ISessionMethord>>(
  'Session',
  sessionSchema,
);

export default sessionModel;
