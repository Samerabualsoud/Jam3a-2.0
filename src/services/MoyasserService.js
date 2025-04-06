const axios = require('axios');
const crypto = require('crypto');

/**
 * Moyasser Payment Service
 * Handles integration with Moyasser payment gateway
 */
class MoyasserService {
  constructor() {
    this.apiKey = process.env.MOYASSER_API_KEY;
    this.secretKey = process.env.MOYASSER_SECRET_KEY;
    this.baseUrl = 'https://api.moyasar.com/v1';
    this.webhookSecret = process.env.MOYASSER_WEBHOOK_SECRET;
  }

  /**
   * Create a new payment
   * @param {Object} paymentData - Payment data
   * @returns {Promise} Payment response
   */
  async createPayment(paymentData) {
    try {
      const { amount, description, callbackUrl, metadata, source } = paymentData;

      // Convert amount to the smallest currency unit (e.g., halala for SAR)
      const amountInSmallestUnit = Math.round(amount * 100);

      const response = await axios.post(
        `${this.baseUrl}/payments`,
        {
          amount: amountInSmallestUnit,
          currency: 'SAR',
          description,
          callback_url: callbackUrl,
          source,
          metadata
        },
        {
          auth: {
            username: this.apiKey,
            password: ''
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Moyasser create payment error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Payment creation failed');
    }
  }

  /**
   * Verify a payment
   * @param {String} paymentId - Payment ID
   * @returns {Promise} Payment verification response
   */
  async verifyPayment(paymentId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/payments/${paymentId}`,
        {
          auth: {
            username: this.apiKey,
            password: ''
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Moyasser verify payment error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
  }

  /**
   * Refund a payment
   * @param {String} paymentId - Payment ID
   * @param {Number} amount - Refund amount (optional, defaults to full amount)
   * @param {String} reason - Refund reason
   * @returns {Promise} Refund response
   */
  async refundPayment(paymentId, amount = null, reason = 'Customer request') {
    try {
      const refundData = { reason };
      
      if (amount) {
        // Convert amount to the smallest currency unit
        refundData.amount = Math.round(amount * 100);
      }

      const response = await axios.post(
        `${this.baseUrl}/payments/${paymentId}/refund`,
        refundData,
        {
          auth: {
            username: this.apiKey,
            password: ''
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Moyasser refund payment error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Payment refund failed');
    }
  }

  /**
   * Capture an authorized payment
   * @param {String} paymentId - Payment ID
   * @param {Number} amount - Capture amount (optional, defaults to full amount)
   * @returns {Promise} Capture response
   */
  async capturePayment(paymentId, amount = null) {
    try {
      const captureData = {};
      
      if (amount) {
        // Convert amount to the smallest currency unit
        captureData.amount = Math.round(amount * 100);
      }

      const response = await axios.post(
        `${this.baseUrl}/payments/${paymentId}/capture`,
        captureData,
        {
          auth: {
            username: this.apiKey,
            password: ''
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Moyasser capture payment error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Payment capture failed');
    }
  }

  /**
   * Void an authorized payment
   * @param {String} paymentId - Payment ID
   * @returns {Promise} Void response
   */
  async voidPayment(paymentId) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/payments/${paymentId}/void`,
        {},
        {
          auth: {
            username: this.apiKey,
            password: ''
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Moyasser void payment error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Payment void failed');
    }
  }

  /**
   * List payments with pagination and filtering
   * @param {Object} options - List options
   * @returns {Promise} Payments list response
   */
  async listPayments(options = {}) {
    try {
      const { page = 1, limit = 20, status, source } = options;

      const params = {
        page,
        per_page: limit
      };

      if (status) params.status = status;
      if (source) params.source = source;

      const response = await axios.get(
        `${this.baseUrl}/payments`,
        {
          params,
          auth: {
            username: this.apiKey,
            password: ''
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Moyasser list payments error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Listing payments failed');
    }
  }

  /**
   * Verify webhook signature
   * @param {String} signature - Webhook signature from header
   * @param {String} payload - Raw request body
   * @returns {Boolean} Whether signature is valid
   */
  verifyWebhookSignature(signature, payload) {
    if (!signature || !payload || !this.webhookSecret) {
      return false;
    }

    try {
      const hmac = crypto.createHmac('sha256', this.webhookSecret);
      const expectedSignature = hmac.update(payload).digest('hex');
      
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error('Webhook signature verification error:', error.message);
      return false;
    }
  }

  /**
   * Format amount from smallest currency unit to decimal
   * @param {Number} amount - Amount in smallest currency unit
   * @returns {Number} Amount in decimal
   */
  formatAmount(amount) {
    return amount / 100;
  }

  /**
   * Generate payment form configuration
   * @param {Object} options - Form options
   * @returns {Object} Form configuration
   */
  generateFormConfig(options) {
    const { amount, orderId, customerName, customerEmail } = options;

    return {
      publishableKey: this.apiKey,
      amount: Math.round(amount * 100),
      currency: 'SAR',
      description: `Order #${orderId}`,
      metadata: {
        order_id: orderId,
        customer_name: customerName,
        customer_email: customerEmail
      }
    };
  }
}

module.exports = new MoyasserService();
