const express = require('express');
const router = express.Router();
const { sendToZapier, sendWaitlistToZapier, sendRegistrationToZapier, 
        sendNewsletterSubscriptionToZapier, sendOrderConfirmationToZapier, 
        sendGroupCompleteToZapier } = require('../zapierService');
const { sendEmail } = require('../emailService');

// Middleware to validate email
const validateEmail = (req, res, next) => {
  const { to } = req.body;
  if (!to || typeof to !== 'string' || !to.includes('@')) {
    return res.status(400).json({ success: false, error: 'Invalid email address' });
  }
  next();
};

// Route to handle email sending with Zapier integration
router.post('/send', validateEmail, async (req, res) => {
  try {
    const { from, to, subject, template, data } = req.body;
    
    // Send email through regular email service
    const emailResult = await sendEmail({ from, to, subject, template, data });
    
    // Determine if we should also send to Zapier based on template type
    let zapierResult = { success: true, zapier: false };
    
    if (template === 'waitlist') {
      zapierResult = await sendWaitlistToZapier({
        email: to,
        name: data.name || '',
        ...data
      });
      zapierResult.zapier = true;
    } 
    else if (template === 'registration') {
      zapierResult = await sendRegistrationToZapier({
        email: to,
        name: data.name || '',
        ...data
      });
      zapierResult.zapier = true;
    }
    else if (template === 'newsletter') {
      zapierResult = await sendNewsletterSubscriptionToZapier({
        email: to,
        name: data.name || '',
        ...data
      });
      zapierResult.zapier = true;
    }
    else if (template === 'order-confirmation') {
      zapierResult = await sendOrderConfirmationToZapier({
        email: to,
        name: data.name || '',
        orderId: data.orderDetails?.id || Date.now().toString(),
        items: data.orderDetails?.items || [],
        total: data.orderDetails?.total || 0,
        ...data
      });
      zapierResult.zapier = true;
    }
    else if (template === 'group-complete') {
      zapierResult = await sendGroupCompleteToZapier({
        email: to,
        name: data.name || '',
        groupId: data.groupDetails?.id || Date.now().toString(),
        productName: data.groupDetails?.productName || '',
        groupSize: data.groupDetails?.groupSize || 0,
        discount: data.groupDetails?.discount || 0,
        finalPrice: data.groupDetails?.finalPrice || 0,
        ...data
      });
      zapierResult.zapier = true;
    }
    
    // Return combined results
    res.json({
      success: emailResult.success && zapierResult.success,
      email: emailResult,
      zapier: zapierResult
    });
  } catch (error) {
    console.error('Error in email route:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'An error occurred while sending email' 
    });
  }
});

// Direct webhook endpoints for Zapier integration

// Waitlist registration webhook
router.post('/zapier/waitlist', async (req, res) => {
  try {
    const result = await sendWaitlistToZapier(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error in waitlist webhook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// User registration webhook
router.post('/zapier/registration', async (req, res) => {
  try {
    const result = await sendRegistrationToZapier(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error in registration webhook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Newsletter subscription webhook
router.post('/zapier/newsletter', async (req, res) => {
  try {
    const result = await sendNewsletterSubscriptionToZapier(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error in newsletter webhook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Order confirmation webhook
router.post('/zapier/order', async (req, res) => {
  try {
    const result = await sendOrderConfirmationToZapier(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error in order webhook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Group completion webhook
router.post('/zapier/group', async (req, res) => {
  try {
    const result = await sendGroupCompleteToZapier(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error in group webhook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generic webhook for custom Zapier integrations
router.post('/zapier/custom/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const result = await sendToZapier(type, req.body);
    res.json(result);
  } catch (error) {
    console.error(`Error in custom webhook (${req.params.type}):`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
