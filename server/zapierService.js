const axios = require('axios');
const { EMAIL_CONFIG } = require('./emailService');

// Zapier integration configuration
const ZAPIER_CONFIG = {
  // Zapier deploy key for authentication
  deployKey: 'e6bf28375f5f9d1ebec636ac2915fdc8',
  
  // Zapier webhook URLs for different actions
  webhooks: {
    waitlist: 'https://hooks.zapier.com/hooks/catch/123456/abcdef/', 
    registration: 'https://hooks.zapier.com/hooks/catch/123456/ghijkl/', 
    newsletter: 'https://hooks.zapier.com/hooks/catch/123456/mnopqr/', 
    orderConfirmation: 'https://hooks.zapier.com/hooks/catch/123456/stuvwx/', 
    groupComplete: 'https://hooks.zapier.com/hooks/catch/123456/yz1234/' 
  },
  // Default webhook for general purpose use
  defaultWebhook: 'https://hooks.zapier.com/hooks/catch/123456/default/'
};

/**
 * Send data to Zapier webhook
 * @param {string} webhookType - Type of webhook to use (waitlist, registration, etc.)
 * @param {object} data - Data to send to Zapier
 * @returns {Promise<object>} - Response from Zapier
 */
const sendToZapier = async (webhookType, data) => {
  try {
    // Get the appropriate webhook URL
    const webhookUrl = ZAPIER_CONFIG.webhooks[webhookType] || ZAPIER_CONFIG.defaultWebhook;
    
    if (!webhookUrl) {
      throw new Error(`No webhook URL configured for type: ${webhookType}`);
    }

    // Add timestamp and source information
    const enrichedData = {
      ...data,
      timestamp: new Date().toISOString(),
      source: 'Jam3a Website',
      environment: process.env.NODE_ENV || 'development'
    };

    // Send data to Zapier webhook with deploy key in headers
    const response = await axios.post(webhookUrl, enrichedData, {
      headers: {
        'X-Zapier-Deploy-Key': ZAPIER_CONFIG.deployKey,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Data sent to Zapier ${webhookType} webhook:`, {
      status: response.status,
      statusText: response.statusText,
      data: enrichedData
    });
    
    return { 
      success: true, 
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error(`Error sending data to Zapier ${webhookType} webhook:`, error);
    
    // Return detailed error information
    return { 
      success: false, 
      error: error.message,
      details: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : null
    };
  }
};

/**
 * Send waitlist registration to Zapier
 * @param {object} userData - User data including email, name, etc.
 * @returns {Promise<object>} - Response from Zapier
 */
const sendWaitlistToZapier = async (userData) => {
  return sendToZapier('waitlist', {
    email: userData.email,
    name: userData.name || '',
    joinDate: new Date().toLocaleDateString(),
    position: Math.floor(Math.random() * 100) + 1, // Simulated waitlist position
    interests: userData.interests || [],
    source: userData.source || 'website',
    locale: userData.locale || 'en'
  });
};

/**
 * Send user registration to Zapier
 * @param {object} userData - User registration data
 * @returns {Promise<object>} - Response from Zapier
 */
const sendRegistrationToZapier = async (userData) => {
  return sendToZapier('registration', {
    email: userData.email,
    name: userData.name || '',
    username: userData.username || '',
    registrationDate: new Date().toLocaleDateString(),
    accountType: userData.accountType || 'customer',
    preferences: userData.preferences || {},
    locale: userData.locale || 'en'
  });
};

/**
 * Send newsletter subscription to Zapier
 * @param {object} subscriptionData - Newsletter subscription data
 * @returns {Promise<object>} - Response from Zapier
 */
const sendNewsletterSubscriptionToZapier = async (subscriptionData) => {
  return sendToZapier('newsletter', {
    email: subscriptionData.email,
    name: subscriptionData.name || '',
    subscriptionDate: new Date().toLocaleDateString(),
    interests: subscriptionData.interests || [],
    source: subscriptionData.source || 'website',
    locale: subscriptionData.locale || 'en'
  });
};

/**
 * Send order confirmation to Zapier
 * @param {object} orderData - Order data
 * @returns {Promise<object>} - Response from Zapier
 */
const sendOrderConfirmationToZapier = async (orderData) => {
  return sendToZapier('orderConfirmation', {
    email: orderData.email,
    name: orderData.name || '',
    orderId: orderData.orderId,
    orderDate: new Date().toLocaleDateString(),
    items: orderData.items || [],
    total: orderData.total,
    currency: orderData.currency || 'SAR',
    shippingAddress: orderData.shippingAddress || {},
    paymentMethod: orderData.paymentMethod || ''
  });
};

/**
 * Send group completion notification to Zapier
 * @param {object} groupData - Group completion data
 * @returns {Promise<object>} - Response from Zapier
 */
const sendGroupCompleteToZapier = async (groupData) => {
  return sendToZapier('groupComplete', {
    email: groupData.email,
    name: groupData.name || '',
    groupId: groupData.groupId,
    completionDate: new Date().toLocaleDateString(),
    productName: groupData.productName,
    groupSize: groupData.groupSize,
    discount: groupData.discount,
    finalPrice: groupData.finalPrice,
    currency: groupData.currency || 'SAR',
    members: groupData.members || []
  });
};

module.exports = {
  ZAPIER_CONFIG,
  sendToZapier,
  sendWaitlistToZapier,
  sendRegistrationToZapier,
  sendNewsletterSubscriptionToZapier,
  sendOrderConfirmationToZapier,
  sendGroupCompleteToZapier
};
