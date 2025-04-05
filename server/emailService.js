// This file contains server-side email functionality
// It should be placed in a server directory, not bundled with client code

const nodemailer = require('nodemailer');

// Email service configuration for Microsoft
const emailConfig = {
  service: 'outlook',
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'Samer@jam3a.me',
    pass: process.env.EMAIL_PASSWORD || 'your-microsoft-password-here'
  }
};

// Create transporter
const createTransporter = () => {
  try {
    return nodemailer.createTransport(emailConfig);
  } catch (error) {
    console.error('Error creating email transporter:', error);
    return null;
  }
};

// Email templates
const emailTemplates = {
  welcome: (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://jam3a.sa/logo.png" alt="Jam3a Logo" style="max-width: 150px;">
      </div>
      <h2 style="color: #8b5cf6; text-align: center;">Welcome to Jam3a!</h2>
      <p>Hello ${data.name},</p>
      <p>Thank you for joining Jam3a! We're excited to have you as part of our community.</p>
      <p>With Jam3a, you can:</p>
      <ul>
        <li>Join group purchases to save money</li>
        <li>Create your own Jam3a groups</li>
        <li>Track your orders and savings</li>
      </ul>
      <p>If you have any questions, feel free to contact our support team.</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://jam3a.sa/shop-jam3a" style="background-color: #8b5cf6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Shopping</a>
      </div>
      <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
        © ${data.year} Jam3a. All rights reserved.
      </p>
    </div>
  `,
  'order-confirmation': (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://jam3a.sa/logo.png" alt="Jam3a Logo" style="max-width: 150px;">
      </div>
      <h2 style="color: #8b5cf6; text-align: center;">Order Confirmation</h2>
      <p>Hello ${data.name},</p>
      <p>Thank you for your order! Your Jam3a group purchase has been confirmed.</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Order Details:</h3>
        <p><strong>Order ID:</strong> ${data.orderId}</p>
        <p><strong>Product:</strong> ${data.product}</p>
        <p><strong>Price:</strong> ${data.price}</p>
        <p><strong>Estimated Delivery:</strong> ${data.delivery}</p>
      </div>
      <p>You can track your order status in your account dashboard.</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://jam3a.sa/track-order?id=${data.orderId}" style="background-color: #8b5cf6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Track Order</a>
      </div>
      <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
        © ${data.year} Jam3a. All rights reserved.
      </p>
    </div>
  `,
  'group-complete': (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://jam3a.sa/logo.png" alt="Jam3a Logo" style="max-width: 150px;">
      </div>
      <h2 style="color: #8b5cf6; text-align: center;">Group Purchase Complete!</h2>
      <p>Hello ${data.name},</p>
      <p>Great news! Your Jam3a group for <strong>${data.product}</strong> is now complete with ${data.members} members.</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Group Details:</h3>
        <p><strong>Product:</strong> ${data.product}</p>
        <p><strong>Final Price:</strong> ${data.finalPrice}</p>
        <p><strong>Your Savings:</strong> ${data.savings}</p>
        <p><strong>Estimated Delivery:</strong> ${data.delivery}</p>
      </div>
      <p>Your payment has been processed and your order will be shipped soon.</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://jam3a.sa/my-jam3a" style="background-color: #8b5cf6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Details</a>
      </div>
      <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
        © ${data.year} Jam3a. All rights reserved.
      </p>
    </div>
  `,
  custom: (data) => data.htmlContent
};

// Send email function
const sendEmail = async (to, subject, template, data) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      throw new Error('Email transporter not available');
    }
    
    const htmlContent = emailTemplates[template](data);
    
    const mailOptions = {
      from: `"Jam3a" <${emailConfig.auth.user}>`,
      to,
      subject,
      html: htmlContent
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent (${template}):`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Error sending email (${template}):`, error);
    return { success: false, error: error.message };
  }
};

// Newsletter subscription
const subscribeToNewsletter = async (email) => {
  try {
    // Here you would typically add the email to your newsletter database
    console.log(`Subscribed ${email} to newsletter`);
    
    // Send confirmation email
    return await sendEmail(
      email,
      'Welcome to Jam3a Newsletter',
      'welcome',
      { name: 'Subscriber', year: new Date().getFullYear() }
    );
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  subscribeToNewsletter
};
