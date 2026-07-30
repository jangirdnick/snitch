/**
 * ----------------------------------------------------------------------------
 * User Model
 * ----------------------------------------------------------------------------
 *
 * MongoDB user document schema and model definition
 *
 * Responsibilities:
 * - User profile management
 * - Authentication credentials
 * - Password hashing
 * - Role-based access control
 * - Contact information management
 * - Login activity tracking
 *
 * Security Features:
 * - Password hashing using bcrypt
 * - Email normalization
 * - Schema-level validation
 * - Role restrictions through enums
 *
 * Indexes:
 * - email
 *
 * Middleware:
 * - Pre-save password hashing
 *
 * Instance Methods:
 * - comparePassword()
 *
 */
import mongoose, { Schema, type Document, type Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';

/**
 * User document interface.
 *
 * Represents a registered platform user.
 *
 * --------------------------------------------------------------------------
 * Required Fields
 * --------------------------------------------------------------------------
 *
 * @property id
 * Unique user identifier.
 *
 * @property firstName
 * User's first name.
 *
 * @property email
 * Unique email address used for authentication.
 *
 * @property emailVerified
 * Indicates whether the user's email has been verified.
 *
 * @property contact
 * User contact information.
 *
 * @property contact.countryCode
 * International dialing code.
 *
 * @property contact.phoneNumber
 * User phone number.
 *
 * @property password
 * Bcrypt hashed password.
 *
 * @property role
 * User role within the platform.
 *
 * @property lastLoginAt
 * Last successful login timestamp.
 *
 * @property createdAt
 * Document creation timestamp.
 *
 * @property updatedAt
 * Last update timestamp.
 *
 * --------------------------------------------------------------------------
 * Optional Fields
 * --------------------------------------------------------------------------
 *
 * @property lastName
 * User's last name.
 *
 * @property avatar
 * Profile image URL.
 *
 *
 * --------------------------------------------------------------------------
 * Instance Methods
 * --------------------------------------------------------------------------
 *
 * @method comparePassword
 * Compares a plain-text password against the stored password hash.
 *
 * Example:
 *
 * const isValid = await user.comparePassword(password);
 *
 * if (!isValid) {
 *   throw new UnauthorizedException();
 * }
 */
export interface IUser extends Document {
  id: string;
  firstName: string;
  lastName?: string;
  avatar?: string | null;
  email: string;
  emailVerified: boolean;
  contact: {
    countryCode: string;
    phoneNumber: string;
  };
  password: string;
  role: 'USER' | 'ADMIN';
  isBlocked: boolean;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

export interface IUserCreate {
  id?: string;
  firstName: string;
  lastName?: string;
  avatar?: string | null;
  email: string;
  emailVerified: boolean;
  contact: {
    countryCode: string;
    phoneNumber: string;
  };
  password: string;
  isBlocked?: boolean;
  lastLoginAt: Date;
}

export type UserWithoutPassword = Omit<IUser, 'password'>;

/**
 * User Schema
 *
 * Stores account, authentication and profile information.
 *
 * --------------------------------------------------------------------------
 * Business Rules
 * --------------------------------------------------------------------------
 *
 * • Email must be unique.
 * • Passwords are never stored in plain text.
 * • Passwords are automatically hashed before save.
 * • Email addresses are normalized to lowercase.
 * • Users are assigned USER role by default.
 *
 * --------------------------------------------------------------------------
 * Automatic Fields
 * --------------------------------------------------------------------------
 *
 * createdAt
 * updatedAt
 *
 * Generated automatically by mongoose timestamps.
 *
 * --------------------------------------------------------------------------
 * Middleware
 * --------------------------------------------------------------------------
 *
 * pre('save')
 *
 * Hashes the password using bcrypt before persisting
 * the document when the password field is modified.
 *
 * --------------------------------------------------------------------------
 * Instance Methods
 * --------------------------------------------------------------------------
 *
 * comparePassword()
 *
 * Verifies a plain-text password against the stored hash.
 */
const userSchema: Schema<IUser> = new Schema(
  {
    id: {
      type: String,
      default: () => randomUUID(),
      unique: true,
      index: true,
    },

    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minLength: [3, 'First name must be at least 3 characters long'],
      maxLength: [50, 'First name must be less than 50 characters long'],
    },

    lastName: {
      type: String,
      trim: true,
      minLength: [3, 'Last name must be at least 3 characters long'],
      maxLength: [50, 'Last name must be less than 50 characters long'],
    },

    avatar: {
      type: String,
      trim: true,
      default: null,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    contact: {
      countryCode: {
        type: String,
        required: [true, 'Country code is required'],
        trim: true,
        match: [/^\+\d{1,4}$/, 'Please enter a valid country code'],
      },
      phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^\d{10,15}$/, 'Please enter a valid phone number'],
        trim: true,
      },
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      minLength: [6, 'Password must be at least 6 characters long'],
      maxLength: [128, 'Password must be less than 128 characters long'],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
      ],
    },

    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

/**
 * Indexes
 *
 * email: 1
 *
 * Ensures fast lookups by email address.
 */
userSchema.index({ email: 1 });

/**
 * Password Hashing Middleware
 *
 * Executes before a document is saved.
 *
 * Purpose:
 * - Prevent plaintext password storage.
 * - Ensure all passwords are stored as bcrypt hashes.
 *
 * Behavior:
 * - Runs only when password is modified.
 * - Skips execution for unrelated updates.
 *
 * Hash Algorithm:
 * - bcrypt
 * - Salt Rounds: 12
 *
 * Example:
 *
 * const user = new User({
 *   password: 'Admin@123'
 * });
 *
 * await user.save();
 *
 * // Stored value:
 * // $2b$12$...
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

/**
 * Verify user password.
 *
 * Compares the provided plain-text password against
 * the stored bcrypt hash.
 *
 * Common Usage:
 *
 * const valid =
 *   await user.comparePassword(
 *     password,
 *   );
 *
 * if (!valid) {
 *   throw new UnauthorizedError('Invalid credentials');
 * }
 *
 * @param password
 * Plain-text password received from the login request.
 *
 * @returns
 * Promise<boolean>
 *
 * Returns:
 * - true  -> password matches
 * - false -> password mismatch
 */
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

/**
 * User Model
 *
 * Primary entry point for all user-related
 * database operations.
 *
 * --------------------------------------------------------------------------
 * Common Operations
 * --------------------------------------------------------------------------
 *
 * Create User:
 *
 * const user = await User.create({
 *   firstName: 'John',
 *   email: 'john@example.com',
 *   password: 'Admin@123',
 *   contact: {
 *     countryCode: '+91',
 *     phoneNumber: '9876543210'
 *   }
 * });
 *
 * --------------------------------------------------------------------------
 *
 * Find User By Id:
 *
 * const user =
 *   await User.findById(userId);
 *
 * --------------------------------------------------------------------------
 *
 * Find User By Email:
 *
 * const user =
 *   await User.findOne({ email });
 *
 * --------------------------------------------------------------------------
 *
 * Update User:
 *
 * await User.findByIdAndUpdate(
 *   userId,
 *   updateData
 * );
 *
 * --------------------------------------------------------------------------
 *
 * Delete User:
 *
 * await User.findByIdAndDelete(userId);
 *
 * --------------------------------------------------------------------------
 *
 * Authentication:
 *
 * const user =
 *   await User.findOne({ email });
 *
 * const valid =
 *   await user.comparePassword(password);
 *
 * --------------------------------------------------------------------------
 *
 * Notes:
 *
 * - Passwords are automatically hashed.
 * - Email addresses should be unique.
 * - Model reuses existing mongoose model instance
 *   during hot reload to prevent OverwriteModelError.
 */
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
