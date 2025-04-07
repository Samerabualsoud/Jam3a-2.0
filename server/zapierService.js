// Zapier integration service for Jam3a
const axios = require('axios');

// Zapier webhook URLs - these should be set in environment variables in production
const ZAPIER_WEBHOOKS = {
  waitlist: process.env.ZAPIER_WEBHOOK_WAITLIST || 'https://hooks.zapier.com/hooks/catch/123456/abcdef/',
  registration: process.env.ZAPIER_WEBHOOK_REGISTRATION || 'https://hooks.zapier.com/hooks/catch/123456/ghijkl/',
  newsletter: process.env.ZAPIER_WEBHOOK_NEWSLETTER || 'https://hooks.zapier.com/hooks/catch/123456/mnopqr/',
  order: process.env.ZAPIER_WEBHOOK_ORDER || 'https://hooks.zapier.com/hooks/catch/123456/stuvwx/',
  group: process.env.ZAPIER_WEBHOOK_GROUP || 'https://hooks.zapier.com/hooks/catch/123456/yzabcd/',
  custom: process.env.ZAPIER_WEBHOOK_CUSTOM || 'https://hooks.zapier.com/hooks/catch/123456/efghij/'
};

// Send data to Zapier webhook
const sendToZapier = async (type, data) => {
  try {
    // Validate webhook type
    if (!ZAPIER_WEBHOOKS[type]) {
      throw new Error(`Invalid webhook type: ${type}`);
    }
    
    // Add timestamp
    const payload = {
      ...data,
      timestamp: new Date().toISOString()
    };
    
    // Send to Zapier
    const response = await axios.post(ZAPIER_WEBHOOKS[type], payload);
    
    console.log(`Data sent to Zapier ${type} webhook:`, response.status);
    return { success: true, status: response.status };
  } catch (error) {
    console.error(`Error sending to Zapier ${type} webhook:`, error);
    return { success: false, error: error.message };
  }
};

// Specific webhook functions
const sendWaitlistToZapier = async (data) => {
  return sendToZapier('waitlist', data);
};

const sendRegistrationToZapier = async (data) => {
  return sendToZapier('registration', data);
};

const sendNewsletterSubscriptionToZapier = async (data) => {
  return sendToZapier('newsletter', data);
};

const sendOrderConfirmationToZapier = async (data) => {
  return sendToZapier('order', data);
};

const sendGroupCompleteToZapier = async (data) => {
  return sendToZapier('group', data);
};

module.exports = {
  sendToZapier,
  sendWaitlistToZapier,
  sendRegistrationToZapier,
  sendNewsletterSubscriptionToZapier,
  sendOrderConfirmationToZapier,
  sendGroupCompleteToZapier
};
