const axios = require('axios');
const crypto = require('crypto');

class MoyasserService {
  constructor() {
    this.apiKey = process.env.MOYASSER_API_KEY || 'test_api_key';
    this.secretKey = process.env.MOYASSER_SECRET_KEY || 'test_secret_key';
    this.baseUrl = process.env.MOYASSER_API_URL || 'https://api.moyasser.com/v1';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  /**
   * Create a payment with Moyasser
   * @param {Object} paymentData - Payment data
   * @param {string} paymentData.amount - Payment amount
   * @param {string} paymentData.currency - Payment currency (SAR, USD, etc.)
   * @param {string} paymentData.description - Payment description
   * @param {string} paymentData.callbackUrl - Callback URL for payment completion
   * @param {string} paymentData.source - Payment source (credit_card, mada, etc.)
   * @returns {Promise<Object>} - Moyasser payment response
   */
  async createPayment(paymentData) {
    try {
      const { amount, currency, description, callbackUrl, source } = paymentData;

      const payload = {
        amount: parseFloat(amount).toFixed(2),
        currency: currency || 'SAR',
        description,
        callback_url: callbackUrl,
        source: {
          type: source || 'credit_card'
        }
      };

      const response = await axios.post(`${this.baseUrl}/payments`, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Moyasser payment creation error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create payment with Moyasser');
    }
  }

  /**
   * Verify a payment with Moyasser
   * @param {string} paymentId - Moyasser payment ID
   * @returns {Promise<Object>} - Moyasser payment verification response
   */
  async verifyPayment(paymentId) {
    try {
      const response = await axios.get(`${this.baseUrl}/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Moyasser payment verification error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to verify payment with Moyasser');
    }
  }

  /**
   * Process a refund with Moyasser
   * @param {string} paymentId - Moyasser payment ID
   * @param {Object} refundData - Refund data
   * @param {number} refundData.amount - Refund amount
   * @param {string} refundData.reason - Refund reason
   * @returns {Promise<Object>} - Moyasser refund response
   */
  async processRefund(paymentId, refundData) {
    try {
      const { amount, reason } = refundData;

      const payload = {
        amount: parseFloat(amount).toFixed(2),
        reason: reason || 'Customer requested refund'
      };

      const response = await axios.post(`${this.baseUrl}/payments/${paymentId}/refunds`, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Moyasser refund error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to process refund with Moyasser');
    }
  }

  /**
   * Verify webhook signature from Moyasser
   * @param {string} signature - Signature from Moyasser webhook
   * @param {string} payload - Raw request body
   * @returns {boolean} - Whether the signature is valid
   */
  verifyWebhookSignature(signature, payload) {
    if (!signature || !payload) {
      return false;
    }

    const hmac = crypto.createHmac('sha256', this.secretKey);
    const calculatedSignature = hmac.update(payload).digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(calculatedSignature)
    );
  }

  /**
   * Generate payment form for client-side integration
   * @param {Object} paymentData - Payment data
   * @param {string} paymentData.amount - Payment amount
   * @param {string} paymentData.currency - Payment currency
   * @param {string} paymentData.description - Payment description
   * @param {string} paymentData.orderId - Order ID
   * @returns {Object} - Payment form data for client-side integration
   */
  generatePaymentForm(paymentData) {
    const { amount, currency, description, orderId } = paymentData;

    // Generate a timestamp for the payment
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Generate a unique ID for the payment
    const paymentId = `pay_${timestamp}_${orderId}`;
    
    // Generate a signature for the payment
    const dataToSign = `${amount}${currency}${paymentId}${timestamp}`;
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(dataToSign)
      .digest('hex');

    return {
      paymentId,
      apiKey: this.apiKey,
      amount: parseFloat(amount).toFixed(2),
      currency: currency || 'SAR',
      description,
      timestamp,
      signature,
      isProduction: this.isProduction
    };
  }
}

module.exports = new MoyasserService();
