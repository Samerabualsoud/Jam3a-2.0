// Routes for email functionality
const express = require('express');
const router = express.Router();
const { sendEmail, sendBulkEmails } = require('../emailService');

// Middleware to validate email request
const validateEmailRequest = (req, res, next) => {
  const { to, subject, template } = req.body;
  
  if (!to) {
    return res.status(400).json({ 
      success: false, 
      error: 'Recipient email is required' 
    });
  }
  
  if (!subject) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email subject is required' 
    });
  }
  
  if (!template) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email template is required' 
    });
  }
  
  next();
};

// Send a single email
router.post('/send', validateEmailRequest, async (req, res) => {
  try {
    const { to, subject, template, data, attachments } = req.body;
    
    const result = await sendEmail({
      to,
      subject,
      template,
      data,
      attachments
    });
    
    if (result.success) {
      res.json({ 
        success: true, 
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Error in /email/send route:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Send bulk emails
router.post('/bulk', async (req, res) => {
  try {
    const { recipients, subject, template, data, attachments } = req.body;
    
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Recipients must be a non-empty array' 
      });
    }
    
    if (!subject) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email subject is required' 
      });
    }
    
    if (!template) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email template is required' 
      });
    }
    
    const result = await sendBulkEmails({
      recipients,
      subject,
      template,
      data,
      attachments
    });
    
    if (result.success) {
      res.json({ 
        success: true, 
        summary: result.summary,
        results: result.results
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error,
        results: result.results
      });
    }
  } catch (error) {
    console.error('Error in /email/bulk route:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Send welcome email
router.post('/welcome', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      });
    }
    
    const result = await sendEmail({
      to: email,
      subject: 'Welcome to Jam3a!',
      template: 'welcome',
      data: { 
        name: name || 'Valued Customer'
      }
    });
    
    if (result.success) {
      res.json({ 
        success: true, 
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Error in /email/welcome route:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Send order confirmation email
router.post('/order-confirmation', async (req, res) => {
  try {
    const { email, name, orderDetails } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      });
    }
    
    if (!orderDetails) {
      return res.status(400).json({ 
        success: false, 
        error: 'Order details are required' 
      });
    }
    
    const result = await sendEmail({
      to: email,
      subject: 'Your Jam3a Order Confirmation',
      template: 'order-confirmation',
      data: { 
        name: name || 'Valued Customer',
        orderDetails
      }
    });
    
    if (result.success) {
      res.json({ 
        success: true, 
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Error in /email/order-confirmation route:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Send group complete email
router.post('/group-complete', async (req, res) => {
  try {
    const { email, name, groupDetails } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      });
    }
    
    if (!groupDetails) {
      return res.status(400).json({ 
        success: false, 
        error: 'Group details are required' 
      });
    }
    
    const result = await sendEmail({
      to: email,
      subject: 'Your Jam3a Group is Complete!',
      template: 'group-complete',
      data: { 
        name: name || 'Valued Customer',
        groupDetails
      }
    });
    
    if (result.success) {
      res.json({ 
        success: true, 
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Error in /email/group-complete route:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
