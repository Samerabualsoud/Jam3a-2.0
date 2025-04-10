// API routes for users
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/User');
const { sendEmail } = require('../../emailService');
const { auth, authorize, refreshToken } = require('../../middleware/auth');
const { validate, validationRules, sanitizeInputs } = require('../../middleware/validation');

// Apply token refresh middleware to all routes
router.use(refreshToken);

// Apply sanitization middleware to all routes
router.use(sanitizeInputs);

// Get all users - Admin only
router.get('/', auth, authorize(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user by ID - Admin or own user
router.get('/:id', auth, async (req, res) => {
  try {
    // Check if user is requesting their own data or is an admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to access this user data',
        code: 'AUTH_INSUFFICIENT_PERMISSIONS'
      });
    }
    
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new user - Public route (registration)
router.post('/', validate(validationRules.user.register), async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
      role
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'User with this email or username already exists' 
      });
    }

    // Only allow admin role to be set by existing admins
    let userRole = 'user';
    if (role === 'admin') {
      // Check if request has valid admin authentication
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (token) {
        try {
          const decoded = jwt.verify(token, config.jwtSecret || 'jam3a_jwt_secret');
          if (decoded.user && decoded.user.role === 'admin') {
            userRole = 'admin';
          }
        } catch (err) {
          // If token verification fails, default to user role
          console.error('Admin role assignment failed:', err.message);
        }
      }
    }

    const newUser = new User({
      username,
      email,
      password, // In a real app, this should be hashed
      firstName,
      lastName,
      phone,
      address,
      role: userRole
    });

    const savedUser = await newUser.save();
    
    // Send welcome email
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to Jam3a!',
        template: 'welcome',
        data: { 
          name: firstName || username,
        }
      });
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Continue even if email fails
    }
    
    // Return user without password
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    res.status(201).json({ success: true, data: userResponse });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update a user - Admin or own user
router.put('/:id', auth, validate(validationRules.user.update), async (req, res) => {
  try {
    // Check if user is updating their own data or is an admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to update this user',
        code: 'AUTH_INSUFFICIENT_PERMISSIONS'
      });
    }
    
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
      role,
      isActive,
      emailVerified
    } = req.body;

    // Only allow admin to update role, isActive, and emailVerified fields
    if ((role || isActive !== undefined || emailVerified !== undefined) && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to update these fields',
        code: 'AUTH_INSUFFICIENT_PERMISSIONS'
      });
    }

    // Check if updating to an existing email/username
    if (email || username) {
      const query = { _id: { $ne: req.params.id } };
      if (email) query.email = email;
      if (username) query.username = username;
      
      const existingUser = await User.findOne(query);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          error: 'Another user with this email or username already exists' 
        });
      }
    }

    const updateData = {
      ...(username && { username }),
      ...(email && { email }),
      ...(password && { password }), // In a real app, this should be hashed
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(role && req.user.role === 'admin' && { role }),
      ...(isActive !== undefined && req.user.role === 'admin' && { isActive }),
      ...(emailVerified !== undefined && req.user.role === 'admin' && { emailVerified }),
      updatedAt: Date.now()
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a user - Admin only
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: { message: 'User deleted successfully' } });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send email to user - Admin only
router.post('/:id/email', auth, authorize(['admin']), async (req, res) => {
  try {
    const { subject, template, data } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    const emailResult = await sendEmail({
      to: user.email,
      subject,
      template,
      data: {
        ...data,
        name: user.firstName || user.username
      }
    });
    
    if (!emailResult.success) {
      return res.status(500).json({ 
        success: false, 
        error: emailResult.error || 'Failed to send email' 
      });
    }
    
    res.json({ 
      success: true, 
      data: { 
        message: 'Email sent successfully',
        messageId: emailResult.messageId
      } 
    });
  } catch (error) {
    console.error('Error sending email to user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
