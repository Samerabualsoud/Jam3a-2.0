const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const AuthService = require('../services/AuthService');

// Import models
const User = require('../models/User');

// Import middleware
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, phone, address } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      profile: {
        phone: phone || '',
        address: address || ''
      },
      emailVerified: false,
      emailVerificationToken: AuthService.generateVerificationToken(),
      emailVerificationExpires: Date.now() + 86400000 // 24 hours
    });

    // Save user (password will be hashed by pre-save hook)
    await user.save();

    // Generate tokens
    const accessToken = AuthService.generateAccessToken(user);
    const refreshToken = AuthService.generateRefreshToken(user);

    // In production, send verification email here
    // For now, just log the verification token
    console.log(`Verification token for ${email}: ${user.emailVerificationToken}`);

    res.status(201).json({
      msg: 'User registered successfully',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        emailVerified: user.emailVerified
      }
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = AuthService.generateAccessToken(user);
    const refreshToken = AuthService.generateRefreshToken(user);

    // Return user data and tokens
    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        emailVerified: user.emailVerified,
        profile: user.profile
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post('/refresh-token', [
  check('refreshToken', 'Refresh token is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { refreshToken } = req.body;

  try {
    // Verify refresh token
    const decoded = AuthService.verifyRefreshToken(refreshToken);
    
    // Get user from database
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(401).json({ msg: 'Invalid refresh token' });
    }

    // Generate new access token
    const accessToken = AuthService.generateAccessToken(user);

    res.json({ accessToken });
  } catch (err) {
    console.error('Refresh token error:', err.message);
    res.status(401).json({ msg: 'Invalid refresh token' });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    res.json(req.user);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   PUT /api/auth/me
 * @desc    Update current user
 * @access  Private
 */
router.put('/me', [
  auth,
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('email', 'Please include a valid email').optional().isEmail()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Update fields
    const { name, email, profile } = req.body;
    
    if (name) user.name = name;
    
    // If email is being changed, require verification
    if (email && email !== user.email) {
      user.email = email;
      user.emailVerified = false;
      user.emailVerificationToken = AuthService.generateVerificationToken();
      user.emailVerificationExpires = Date.now() + 86400000; // 24 hours
      
      // In production, send verification email here
      console.log(`New verification token for ${email}: ${user.emailVerificationToken}`);
    }
    
    if (profile) {
      user.profile = {
        ...user.profile,
        ...profile
      };
    }
    
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error('Update user error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.post('/verify-email', [
  check('token', 'Verification token is required').exists(),
  check('email', 'Email is required').isEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token, email } = req.body;

  try {
    // Find user by email and token
    const user = await User.findOne({
      email,
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired verification token' });
    }

    // Mark email as verified
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    res.json({ msg: 'Email verified successfully' });
  } catch (err) {
    console.error('Email verification error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/auth/password/reset-request
 * @desc    Request password reset
 * @access  Public
 */
router.post('/password/reset-request', [
  check('email', 'Please include a valid email').isEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Generate reset token
    const resetToken = AuthService.generateResetToken();
    
    // Set token and expiration
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
    await user.save();
    
    // In production, send email with reset link
    // For now, just return the token
    res.json({ 
      msg: 'Password reset email sent',
      token: resetToken // In production, don't return this
    });
  } catch (err) {
    console.error('Password reset request error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/auth/password/reset
 * @desc    Reset password using token
 * @access  Public
 */
router.post('/password/reset', [
  check('token', 'Reset token is required').exists(),
  check('email', 'Email is required').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token, email, password } = req.body;

  try {
    // Find user by email and token
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    console.error('Password reset error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/auth/password/change
 * @desc    Change password
 * @access  Private
 */
router.post('/password/change', [
  auth,
  [
    check('currentPassword', 'Current password is required').exists(),
    check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Verify current password
    const { currentPassword, newPassword } = req.body;
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/auth/verify-token
 * @desc    Verify JWT token and return user data
 * @access  Private
 */
router.get('/verify-token', auth, async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    res.json(req.user);
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
