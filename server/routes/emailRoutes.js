// API route for sending emails
// This file should be placed in a server routes directory

const express = require('express');
const router = express.Router();
const emailService = require('../emailService');

// POST /api/email/send
router.post('/send', async (req, res) => {
  try {
    const { to, subject, template, data } = req.body;
    
    // Validate required fields
    if (!to || !subject || !template || !data) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: to, subject, template, and data are required' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email address format' 
      });
    }
    
    // Send email
    const result = await emailService.sendEmail(to, subject, template, data);
    
    if (result.success) {
      return res.status(200).json({ 
        success: true, 
        messageId: result.messageId 
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: result.error 
      });
    }
  } catch (error) {
    console.error('Error in email send API:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// POST /api/newsletter/subscribe
router.post('/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email address format' 
      });
    }
    
    // Subscribe to newsletter
    const result = await emailService.subscribeToNewsletter(email);
    
    if (result.success) {
      return res.status(200).json({ 
        success: true, 
        message: 'Successfully subscribed to newsletter' 
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: result.error 
      });
    }
  } catch (error) {
    console.error('Error in newsletter subscribe API:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;
