const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

/**
 * User Schema
 * Represents users in the Jam3a platform
 */
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  roles: {
    type: [String],
    default: ['user'],
    enum: ['user', 'admin', 'seller']
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isSeller: {
    type: Boolean,
    default: false
  },
  profile: {
    phone: String,
    address: String,
    city: String,
    country: String,
    avatar: String
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  active: {
    type: Boolean,
    default: true
  },
  refreshTokens: [{
    token: String,
    expires: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpires;
      delete ret.emailVerificationToken;
      delete ret.emailVerificationExpires;
      delete ret.refreshTokens;
      return ret;
    }
  }
});

// Pre-save hook to ensure roles array is consistent with isAdmin and isSeller flags
UserSchema.pre('save', function(next) {
  if (this.isAdmin && !this.roles.includes('admin')) {
    this.roles.push('admin');
  }
  
  if (this.isSeller && !this.roles.includes('seller')) {
    this.roles.push('seller');
  }
  
  next();
});

// Pre-save hook to hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if user has a specific role
UserSchema.methods.hasRole = function(role) {
  return this.roles.includes(role);
};

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to add refresh token
UserSchema.methods.addRefreshToken = function(token, expiresIn) {
  // Remove expired tokens
  this.refreshTokens = this.refreshTokens.filter(t => t.expires > Date.now());
  
  // Add new token
  this.refreshTokens.push({
    token,
    expires: new Date(Date.now() + expiresIn * 1000)
  });
  
  // Limit to 5 tokens per user
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }
};

// Method to verify refresh token
UserSchema.methods.verifyRefreshToken = function(token) {
  const tokenDoc = this.refreshTokens.find(t => t.token === token && t.expires > Date.now());
  return !!tokenDoc;
};

// Method to remove refresh token
UserSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(t => t.token !== token);
};

// Create and export the User model
const User = mongoose.model('User', UserSchema);
module.exports = User;
