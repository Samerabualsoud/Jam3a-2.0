const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/User');
const { sendEmail } = require('../../emailService');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
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

// Create a new user
router.post('/', async (req, res) => {
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

    const newUser = new User({
      username,
      email,
      password, // In a real app, this should be hashed
      firstName,
      lastName,
      phone,
      address,
      role: role || 'user'
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

// Update a user
router.put('/:id', async (req, res) => {
  try {
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
      ...(role && { role }),
      ...(isActive !== undefined && { isActive }),
      ...(emailVerified !== undefined && { emailVerified }),
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

// Delete a user
router.delete('/:id', async (req, res) => {
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

// Send email to user
router.post('/:id/email', async (req, res) => {
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
