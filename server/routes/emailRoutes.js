const express = require('express');
const router = express.Router();
const { sendEmail } = require('../emailService');

// Route for sending emails
router.post('/api/email', async (req, res) => {
  try {
    const { from, to, subject, template, data } = req.body;
    
    // Validate required fields
    if (!to || !subject || !template) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: to, subject, and template are required' 
      });
    }
    
    // Send email
    const result = await sendEmail({ from, to, subject, template, data });
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error in email route:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'An error occurred while sending the email' 
    });
  }
});

// Route for sending welcome emails
router.post('/api/email/welcome', async (req, res) => {
  try {
    const { to, name } = req.body;
    
    if (!to || !name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: to and name are required' 
      });
    }
    
    const result = await sendEmail({
      to,
      subject: 'Welcome to Jam3a!',
      template: 'welcome',
      data: { name }
    });
    
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'An error occurred while sending the welcome email' 
    });
  }
});

// Route for sending waitlist confirmation emails
router.post('/api/email/waitlist', async (req, res) => {
  try {
    const { to, name } = req.body;
    
    if (!to) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required field: to is required' 
      });
    }
    
    const result = await sendEmail({
      to,
      subject: 'You\'ve Joined the Jam3a Waitlist',
      template: 'waitlist',
      data: { 
        name: name || 'there',
        joinDate: new Date().toLocaleDateString(),
        position: Math.floor(Math.random() * 100) + 1 // Simulated waitlist position
      }
    });
    
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('Error sending waitlist email:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'An error occurred while sending the waitlist email' 
    });
  }
});

// Route for sending registration confirmation emails
router.post('/api/email/registration', async (req, res) => {
  try {
    const { to, name, accountDetails } = req.body;
    
    if (!to || !accountDetails) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: to and accountDetails are required' 
      });
    }
    
    const result = await sendEmail({
      to,
      subject: 'Welcome to Jam3a - Registration Confirmation',
      template: 'registration',
      data: { 
        name: name || 'there',
        accountDetails,
        registrationDate: new Date().toLocaleDateString()
      }
    });
    
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('Error sending registration email:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'An error occurred while sending the registration email' 
    });
  }
});

module.exports = router;
