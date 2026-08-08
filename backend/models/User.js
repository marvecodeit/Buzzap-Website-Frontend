const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;
const RESET_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // never returned by default queries
    },
    role: {
      type: String,
      enum: ['client', 'staff', 'admin'],
      default: 'client',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: Date,
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

// Hash password whenever it's set/changed.
// NOTE: async middleware must NOT call next() — Mongoose awaits the returned
// promise and passes no next arg (calling it throws "next is not a function").
userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  // Set slightly in the past so tokens issued right after aren't invalidated by clock skew.
  this.passwordChangedAt = new Date(Date.now() - 1000);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Returns true if the password was changed after a JWT was issued (iat in seconds).
userSchema.methods.passwordChangedAfter = function passwordChangedAfter(jwtIatSeconds) {
  if (!this.passwordChangedAt) return false;
  const changedSeconds = Math.floor(this.passwordChangedAt.getTime() / 1000);
  return changedSeconds > jwtIatSeconds;
};

// Creates a reset token: returns the RAW token (emailed) and stores its HASH.
userSchema.methods.createPasswordResetToken = function createPasswordResetToken() {
  const rawToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  return rawToken;
};

// Hash a raw reset token the same way, for lookup.
userSchema.statics.hashResetToken = function hashResetToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};

module.exports = mongoose.model('User', userSchema);
