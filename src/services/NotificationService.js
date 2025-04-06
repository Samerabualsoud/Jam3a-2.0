const nodemailer = require('nodemailer');

/**
 * Notification Service
 * Handles sending notifications via email and other channels
 */
class NotificationService {
  constructor() {
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp-mail.outlook.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER || 'Samer@jam3a.me',
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  /**
   * Send email notification
   * @param {Object} emailData - Email data
   * @returns {Promise} Email send result
   */
  async sendEmail(emailData) {
    try {
      const { to, subject, text, html, from, attachments } = emailData;
      
      const mailOptions = {
        from: from || `"Jam3a Platform" <${process.env.EMAIL_USER || 'Samer@jam3a.me'}>`,
        to,
        subject,
        text,
        html
      };
      
      if (attachments) {
        mailOptions.attachments = attachments;
      }
      
      const result = await this.emailTransporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Email sending error:', error.message);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Send welcome email to new user
   * @param {Object} user - User data
   * @returns {Promise} Email send result
   */
  async sendWelcomeEmail(user) {
    const { email, name } = user;
    
    const subject = 'Welcome to Jam3a Platform';
    const text = `Hello ${name},\n\nWelcome to Jam3a Platform! We're excited to have you join our community.\n\nWith Jam3a, you can join group buying deals to save money on premium products, or start your own deals to invite friends and family.\n\nGet started by browsing our active deals or creating your own Jam3a.\n\nBest regards,\nThe Jam3a Team`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6c5ce7;">Welcome to Jam3a Platform!</h2>
        <p>Hello ${name},</p>
        <p>We're excited to have you join our community.</p>
        <p>With Jam3a, you can:</p>
        <ul>
          <li>Join group buying deals to save money on premium products</li>
          <li>Start your own deals to invite friends and family</li>
          <li>Track your orders and deals in one place</li>
        </ul>
        <p>Get started by browsing our active deals or creating your own Jam3a.</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}" style="background-color: #6c5ce7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Explore Jam3a</a>
        </div>
        <p>Best regards,<br>The Jam3a Team</p>
      </div>
    `;
    
    return this.sendEmail({ to: email, subject, text, html });
  }

  /**
   * Send order confirmation email
   * @param {Object} orderData - Order data
   * @returns {Promise} Email send result
   */
  async sendOrderConfirmationEmail(orderData) {
    const { user, order } = orderData;
    
    const subject = `Order Confirmation #${order.invoiceNumber}`;
    const text = `Hello ${user.name},\n\nThank you for your order! Your order #${order.invoiceNumber} has been received and is being processed.\n\nOrder Details:\nTotal: ${order.total} SAR\nPayment Method: ${order.paymentMethod}\nStatus: ${order.status}\n\nYou can track your order status in your account.\n\nBest regards,\nThe Jam3a Team`;
    
    // Generate HTML items list
    const itemsList = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.price} SAR</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.total} SAR</td>
      </tr>
    `).join('');
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6c5ce7;">Order Confirmation</h2>
        <p>Hello ${user.name},</p>
        <p>Thank you for your order! Your order <strong>#${order.invoiceNumber}</strong> has been received and is being processed.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f1f1f1;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: left;">Quantity</th>
                <th style="padding: 10px; text-align: left;">Price</th>
                <th style="padding: 10px; text-align: left;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
                <td style="padding: 10px;"><strong>${order.total} SAR</strong></td>
              </tr>
            </tfoot>
          </table>
          
          <div style="margin-top: 20px;">
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
        </div>
        
        <p>You can track your order status in your account.</p>
        
        <div style="margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/orders/${order._id}" style="background-color: #6c5ce7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Track Your Order</a>
        </div>
        
        <p>Best regards,<br>The Jam3a Team</p>
      </div>
    `;
    
    return this.sendEmail({ to: user.email, subject, text, html });
  }

  /**
   * Send deal join confirmation email
   * @param {Object} dealData - Deal join data
   * @returns {Promise} Email send result
   */
  async sendDealJoinConfirmationEmail(dealData) {
    const { user, deal, product } = dealData;
    
    const subject = `You've Joined a Jam3a Deal: ${deal.title}`;
    const text = `Hello ${user.name},\n\nThank you for joining the Jam3a deal for ${product.name}!\n\nDeal Details:\nProduct: ${product.name}\nPrice: ${deal.groupPrice} SAR (${deal.discount}% off)\nRequired Participants: ${deal.requiredParticipants}\nCurrent Participants: ${deal.currentParticipants}\n\nThe deal will be completed once we reach ${deal.requiredParticipants} participants. We'll notify you when the deal is ready for checkout.\n\nBest regards,\nThe Jam3a Team`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6c5ce7;">You've Joined a Jam3a Deal!</h2>
        <p>Hello ${user.name},</p>
        <p>Thank you for joining the Jam3a deal for <strong>${product.name}</strong>!</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">Deal Details</h3>
          <p><strong>Product:</strong> ${product.name}</p>
          <p><strong>Price:</strong> ${deal.groupPrice} SAR <span style="color: #6c5ce7;">(${deal.discount}% off)</span></p>
          <p><strong>Required Participants:</strong> ${deal.requiredParticipants}</p>
          <p><strong>Current Participants:</strong> ${deal.currentParticipants}</p>
          
          <div style="background-color: #eee; border-radius: 5px; height: 20px; margin: 15px 0;">
            <div style="background-color: #6c5ce7; border-radius: 5px; height: 20px; width: ${(deal.currentParticipants / deal.requiredParticipants) * 100}%;"></div>
          </div>
          <p style="text-align: center; font-size: 14px;">${deal.currentParticipants} of ${deal.requiredParticipants} participants</p>
        </div>
        
        <p>The deal will be completed once we reach ${deal.requiredParticipants} participants. We'll notify you when the deal is ready for checkout.</p>
        
        <div style="margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/jam3a/${deal._id}" style="background-color: #6c5ce7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Deal</a>
        </div>
        
        <p>Best regards,<br>The Jam3a Team</p>
      </div>
    `;
    
    return this.sendEmail({ to: user.email, subject, text, html });
  }

  /**
   * Send deal completion notification email
   * @param {Object} dealData - Deal completion data
   * @returns {Promise} Email send result
   */
  async sendDealCompletionEmail(dealData) {
    const { user, deal, product } = dealData;
    
    const subject = `Your Jam3a Deal is Complete: ${deal.title}`;
    const text = `Hello ${user.name},\n\nGreat news! The Jam3a deal for ${product.name} has reached the required number of participants and is now complete.\n\nYou can now proceed to checkout to complete your purchase at the discounted price of ${deal.groupPrice} SAR (${deal.discount}% off).\n\nPlease complete your purchase within 48 hours to secure your discount.\n\nBest regards,\nThe Jam3a Team`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6c5ce7;">Your Jam3a Deal is Complete!</h2>
        <p>Hello ${user.name},</p>
        <p>Great news! The Jam3a deal for <strong>${product.name}</strong> has reached the required number of participants and is now complete.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">Deal Details</h3>
          <p><strong>Product:</strong> ${product.name}</p>
          <p><strong>Discounted Price:</strong> ${deal.groupPrice} SAR <span style="color: #6c5ce7;">(${deal.discount}% off)</span></p>
          <p><strong>Regular Price:</strong> ${product.price} SAR</p>
          <p><strong>Your Savings:</strong> ${product.price - deal.groupPrice} SAR</p>
        </div>
        
        <p>You can now proceed to checkout to complete your purchase at the discounted price.</p>
        <p><strong>Please complete your purchase within 48 hours to secure your discount.</strong></p>
        
        <div style="margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/checkout?dealId=${deal._id}" style="background-color: #6c5ce7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Complete Purchase</a>
        </div>
        
        <p>Best regards,<br>The Jam3a Team</p>
      </div>
    `;
    
    return this.sendEmail({ to: user.email, subject, text, html });
  }

  /**
   * Send order status update email
   * @param {Object} updateData - Order update data
   * @returns {Promise} Email send result
   */
  async sendOrderStatusUpdateEmail(updateData) {
    const { user, order, oldStatus, newStatus } = updateData;
    
    const statusMessages = {
      processing: 'Your order is now being processed.',
      shipped: 'Your order has been shipped and is on its way to you.',
      delivered: 'Your order has been delivered. We hope you enjoy your purchase!',
      cancelled: 'Your order has been cancelled.',
      refunded: 'Your order has been refunded.'
    };
    
    const subject = `Order Status Update: #${order.invoiceNumber}`;
    const text = `Hello ${user.name},\n\nYour order #${order.invoiceNumber} status has been updated from ${oldStatus} to ${newStatus}.\n\n${statusMessages[newStatus] || ''}\n\nYou can track your order status in your account.\n\nBest regards,\nThe Jam3a Team`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6c5ce7;">Order Status Update</h2>
        <p>Hello ${user.name},</p>
        <p>Your order <strong>#${order.invoiceNumber}</strong> status has been updated from <strong>${oldStatus}</strong> to <strong>${newStatus}</strong>.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <p style="font-size: 16px;">${statusMessages[newStatus] || ''}</p>
        </div>
        
        <div style="margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/orders/${order._id}" style="background-color: #6c5ce7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Track Your Order</a>
        </div>
        
        <p>Best regards,<br>The Jam3a Team</p>
      </div>
    `;
    
    return this.sendEmail({ to: user.email, subject, text, html });
  }

  /**
   * Send password reset email
   * @param {Object} resetData - Password reset data
   * @returns {Promise} Email send result
   */
  async sendPasswordResetEmail(resetData) {
    const { user, resetToken, resetUrl } = resetData;
    
    const subject = 'Password Reset Request';
    const text = `Hello ${user.name},\n\nYou requested a password reset for your Jam3a account. Please use the following link to reset your password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email and your password will remain unchanged.\n\nBest regards,\nThe Jam3a Team`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6c5ce7;">Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>You requested a password reset for your Jam3a account. Please use the button below to reset your password:</p>
        
        <div style="margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #6c5ce7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </div>
        
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        
        <p>Best regards,<br>The Jam3a Team</p>
      </div>
    `;
    
    return this.sendEmail({ to: user.email, subject, text, html });
  }

  /**
   * Send waiting list notification
   * @param {Object} waitingData - Waiting list data
   * @returns {Promise} Email send result
   */
  async sendWaitingListNotification(waitingData) {
    const { user, product } = waitingData;
    
    const subject = `${product.name} is Now Available!`;
    const text = `Hello ${user.name},\n\nGood news! The product you were waiting for, ${product.name}, is now back in stock.\n\nDon't miss out - visit our website to purchase it before it's gone again.\n\nBest regards,\nThe Jam3a Team`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6c5ce7;">${product.name} is Now Available!</h2>
        <p>Hello ${user.name},</p>
        <p>Good news! The product you were waiting for is now back in stock.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">${product.name}</h3>
          <p>${product.description}</p>
          <p><strong>Price:</strong> ${product.price} SAR</p>
        </div>
        
        <p>Don't miss out - visit our website to purchase it before it's gone again.</p>
        
        <div style="margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/products/${product._id}" style="background-color: #6c5ce7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Product</a>
        </div>
        
        <p>Best regards,<br>The Jam3a Team</p>
      </div>
    `;
    
    return this.sendEmail({ to: user.email, subject, text, html });
  }
}

module.exports = new NotificationService();
