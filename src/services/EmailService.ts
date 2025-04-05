import { useState } from 'react';
import nodemailer from 'nodemailer';
import { toast } from '@/hooks/use-toast';

// Email service configuration
const emailConfig = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'jam3a.notifications@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password-here'
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
  welcome: {
    subject: 'Welcome to Jam3a!',
    html: (name) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://jam3a.sa/logo.png" alt="Jam3a Logo" style="max-width: 150px;">
        </div>
        <h2 style="color: #8b5cf6; text-align: center;">Welcome to Jam3a!</h2>
        <p>Hello ${name},</p>
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
          © ${new Date().getFullYear()} Jam3a. All rights reserved.
        </p>
      </div>
    `
  },
  orderConfirmation: {
    subject: 'Your Jam3a Order Confirmation',
    html: (name, orderDetails) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://jam3a.sa/logo.png" alt="Jam3a Logo" style="max-width: 150px;">
        </div>
        <h2 style="color: #8b5cf6; text-align: center;">Order Confirmation</h2>
        <p>Hello ${name},</p>
        <p>Thank you for your order! Your Jam3a group purchase has been confirmed.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Order Details:</h3>
          <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
          <p><strong>Product:</strong> ${orderDetails.product}</p>
          <p><strong>Price:</strong> ${orderDetails.price}</p>
          <p><strong>Estimated Delivery:</strong> ${orderDetails.delivery}</p>
        </div>
        <p>You can track your order status in your account dashboard.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://jam3a.sa/track-order?id=${orderDetails.orderId}" style="background-color: #8b5cf6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Track Order</a>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
          © ${new Date().getFullYear()} Jam3a. All rights reserved.
        </p>
      </div>
    `
  },
  groupComplete: {
    subject: 'Your Jam3a Group is Complete!',
    html: (name, groupDetails) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://jam3a.sa/logo.png" alt="Jam3a Logo" style="max-width: 150px;">
        </div>
        <h2 style="color: #8b5cf6; text-align: center;">Group Purchase Complete!</h2>
        <p>Hello ${name},</p>
        <p>Great news! Your Jam3a group for <strong>${groupDetails.product}</strong> is now complete with ${groupDetails.members} members.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Group Details:</h3>
          <p><strong>Product:</strong> ${groupDetails.product}</p>
          <p><strong>Final Price:</strong> ${groupDetails.finalPrice}</p>
          <p><strong>Your Savings:</strong> ${groupDetails.savings}</p>
          <p><strong>Estimated Delivery:</strong> ${groupDetails.delivery}</p>
        </div>
        <p>Your payment has been processed and your order will be shipped soon.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://jam3a.sa/my-jam3a" style="background-color: #8b5cf6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Details</a>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
          © ${new Date().getFullYear()} Jam3a. All rights reserved.
        </p>
      </div>
    `
  }
};

// Email service functions
const EmailService = {
  // Send welcome email
  sendWelcomeEmail: async (to, name) => {
    try {
      const transporter = createTransporter();
      if (!transporter) {
        throw new Error('Email transporter not available');
      }
      
      const template = emailTemplates.welcome;
      
      const mailOptions = {
        from: `"Jam3a" <${emailConfig.auth.user}>`,
        to,
        subject: template.subject,
        html: template.html(name)
      };
      
      const info = await transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Send order confirmation email
  sendOrderConfirmationEmail: async (to, name, orderDetails) => {
    try {
      const transporter = createTransporter();
      if (!transporter) {
        throw new Error('Email transporter not available');
      }
      
      const template = emailTemplates.orderConfirmation;
      
      const mailOptions = {
        from: `"Jam3a" <${emailConfig.auth.user}>`,
        to,
        subject: template.subject,
        html: template.html(name, orderDetails)
      };
      
      const info = await transporter.sendMail(mailOptions);
      console.log('Order confirmation email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Send group complete email
  sendGroupCompleteEmail: async (to, name, groupDetails) => {
    try {
      const transporter = createTransporter();
      if (!transporter) {
        throw new Error('Email transporter not available');
      }
      
      const template = emailTemplates.groupComplete;
      
      const mailOptions = {
        from: `"Jam3a" <${emailConfig.auth.user}>`,
        to,
        subject: template.subject,
        html: template.html(name, groupDetails)
      };
      
      const info = await transporter.sendMail(mailOptions);
      console.log('Group complete email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending group complete email:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Send custom email
  sendCustomEmail: async (to, subject, htmlContent) => {
    try {
      const transporter = createTransporter();
      if (!transporter) {
        throw new Error('Email transporter not available');
      }
      
      const mailOptions = {
        from: `"Jam3a" <${emailConfig.auth.user}>`,
        to,
        subject,
        html: htmlContent
      };
      
      const info = await transporter.sendMail(mailOptions);
      console.log('Custom email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending custom email:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Send test email (for verifying configuration)
  sendTestEmail: async (to) => {
    try {
      const transporter = createTransporter();
      if (!transporter) {
        throw new Error('Email transporter not available');
      }
      
      const mailOptions = {
        from: `"Jam3a Test" <${emailConfig.auth.user}>`,
        to,
        subject: 'Jam3a Email Service Test',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #8b5cf6; text-align: center;">Jam3a Email Service Test</h2>
            <p>This is a test email from Jam3a email service.</p>
            <p>If you're receiving this, the email service is configured correctly!</p>
            <p>Test completed at: ${new Date().toLocaleString()}</p>
          </div>
        `
      };
      
      const info = await transporter.sendMail(mailOptions);
      console.log('Test email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending test email:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Email subscription management
  subscribeToNewsletter: async (email) => {
    try {
      // Here you would typically add the email to your newsletter database
      // This is a simplified implementation
      console.log(`Subscribed ${email} to newsletter`);
      
      // Send confirmation email
      const transporter = createTransporter();
      if (!transporter) {
        throw new Error('Email transporter not available');
      }
      
      const mailOptions = {
        from: `"Jam3a" <${emailConfig.auth.user}>`,
        to: email,
        subject: 'Welcome to Jam3a Newsletter',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://jam3a.sa/logo.png" alt="Jam3a Logo" style="max-width: 150px;">
            </div>
            <h2 style="color: #8b5cf6; text-align: center;">Thanks for Subscribing!</h2>
            <p>You're now subscribed to the Jam3a newsletter.</p>
            <p>You'll receive updates on new deals, features, and exclusive offers.</p>
            <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
              © ${new Date().getFullYear()} Jam3a. All rights reserved.<br>
              To unsubscribe, <a href="https://jam3a.sa/unsubscribe?email=${email}" style="color: #8b5cf6;">click here</a>.
            </p>
          </div>
        `
      };
      
      const info = await transporter.sendMail(mailOptions);
      console.log('Subscription confirmation email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      return { success: false, error: error.message };
    }
  }
};

// Hook for using email service in components
export const useEmailService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const sendEmail = async (type, data) => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      switch (type) {
        case 'welcome':
          result = await EmailService.sendWelcomeEmail(data.email, data.name);
          break;
        case 'orderConfirmation':
          result = await EmailService.sendOrderConfirmationEmail(data.email, data.name, data.orderDetails);
          break;
        case 'groupComplete':
          result = await EmailService.sendGroupCompleteEmail(data.email, data.name, data.groupDetails);
          break;
        case 'custom':
          result = await EmailService.sendCustomEmail(data.email, data.subject, data.htmlContent);
          break;
        case 'test':
          result = await EmailService.sendTestEmail(data.email);
          break;
        case 'subscribe':
          result = await EmailService.subscribeToNewsletter(data.email);
          break;
        default:
          throw new Error(`Unknown email type: ${type}`);
      }
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast({
        title: 'Email Sent',
        description: `Email has been sent successfully.`,
      });
      
      return result;
    } catch (err) {
      setError(err.message);
      
      toast({
        title: 'Email Error',
        description: `Failed to send email: ${err.message}`,
        variant: 'destructive',
      });
      
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    sendEmail,
    loading,
    error
  };
};

export default EmailService;
