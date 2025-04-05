const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

// Microsoft Outlook Email Service Configuration
const EMAIL_CONFIG = {
  service: 'outlook',
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'Samer@jam3a.me', // Replace with actual email
    pass: process.env.EMAIL_PASSWORD || 'your_app_password_here' // Use environment variable in production
  },
  templates: {
    welcome: {
      subject: 'Welcome to Jam3a!',
      template: 'welcome'
    },
    orderConfirmation: {
      subject: 'Your Jam3a Order Confirmation',
      template: 'order-confirmation'
    },
    groupComplete: {
      subject: 'Your Jam3a Group is Complete!',
      template: 'group-complete'
    },
    waitlist: {
      subject: 'You\'ve Joined the Jam3a Waitlist',
      template: 'waitlist'
    },
    registration: {
      subject: 'Welcome to Jam3a - Registration Confirmation',
      template: 'registration'
    }
  }
};

// Create reusable transporter object using SMTP transport
const createTransporter = async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: EMAIL_CONFIG.service,
      host: EMAIL_CONFIG.host,
      port: EMAIL_CONFIG.port,
      secure: EMAIL_CONFIG.secure,
      auth: {
        user: EMAIL_CONFIG.auth.user,
        pass: EMAIL_CONFIG.auth.pass
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    });

    // Verify connection configuration
    await transporter.verify();
    console.log('Server is ready to take our messages');
    return transporter;
  } catch (error) {
    console.error('Error creating email transporter:', error);
    return null;
  }
};

// Load email template and compile with Handlebars
const loadTemplate = (templateName, data) => {
  try {
    // In production, templates would be stored in a templates directory
    // For now, we'll use simple inline templates
    const templates = {
      welcome: `
        <h1>Welcome to Jam3a, {{name}}!</h1>
        <p>Thank you for joining our community of group buyers.</p>
        <p>With Jam3a, you can team up with others to get better prices on products you love.</p>
        <p>Start exploring deals today!</p>
        <a href="https://jam3a.me/shop" style="background-color: #7e22ce; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">Browse Deals</a>
      `,
      'order-confirmation': `
        <h1>Order Confirmation</h1>
        <p>Hello {{name}},</p>
        <p>Thank you for your order with Jam3a!</p>
        <h2>Order Details:</h2>
        <p>Order ID: {{orderDetails.id}}</p>
        <p>Date: {{orderDetails.date}}</p>
        <p>Total: SAR {{orderDetails.total}}</p>
        <h3>Items:</h3>
        <ul>
          {{#each orderDetails.items}}
            <li>{{this.name}} - SAR {{this.price}} x {{this.quantity}}</li>
          {{/each}}
        </ul>
        <p>Your order will be processed once your Jam3a group is complete.</p>
      `,
      'group-complete': `
        <h1>Your Jam3a Group is Complete!</h1>
        <p>Hello {{name}},</p>
        <p>Great news! Your Jam3a group for {{groupDetails.productName}} is now complete.</p>
        <p>Your order is now being processed and will be shipped soon.</p>
        <h2>Group Details:</h2>
        <p>Product: {{groupDetails.productName}}</p>
        <p>Group Size: {{groupDetails.groupSize}} members</p>
        <p>Discount: {{groupDetails.discount}}%</p>
        <p>Final Price: SAR {{groupDetails.finalPrice}}</p>
        <p>Thank you for shopping with Jam3a!</p>
      `,
      waitlist: `
        <h1>You're on the Jam3a Waitlist!</h1>
        <p>Hello {{name}},</p>
        <p>Thank you for joining the Jam3a waitlist! We're excited to have you as part of our community.</p>
        <p>You joined on {{joinDate}} and you're currently position #{{position}} on our waitlist.</p>
        <p>We'll notify you as soon as we're ready to welcome you to the platform.</p>
        <p>In the meantime, follow us on social media for updates:</p>
        <div style="margin-top: 20px;">
          <a href="https://twitter.com/jam3a_me" style="margin-right: 15px;">Twitter</a>
          <a href="https://instagram.com/jam3a.me">Instagram</a>
        </div>
      `,
      registration: `
        <h1>Welcome to Jam3a!</h1>
        <p>Hello {{name}},</p>
        <p>Thank you for registering with Jam3a on {{registrationDate}}.</p>
        <p>Your account has been successfully created and you can now start shopping and creating Jam3as!</p>
        <h2>Account Details:</h2>
        <p>Email: {{accountDetails.email}}</p>
        <p>Username: {{accountDetails.username}}</p>
        <a href="https://jam3a.me/shop" style="background-color: #7e22ce; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">Start Shopping</a>
      `,
      custom: `
        {{htmlContent}}
      `,
      newsletter: `
        <h1>Newsletter Subscription Confirmation</h1>
        <p>Hello {{#if name}}{{name}}{{else}}there{{/if}},</p>
        <p>Thank you for subscribing to the Jam3a newsletter!</p>
        <p>You'll now receive updates about new products, special offers, and group buying opportunities.</p>
        <p>If you didn't subscribe to our newsletter, please ignore this email.</p>
      `
    };
    
    const template = templates[templateName] || templates.custom;
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(data);
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    return `<p>Error loading email template. Please contact support.</p>`;
  }
};

// Send email
const sendEmail = async ({ from, to, subject, template, data }) => {
  try {
    const transporter = await createTransporter();
    if (!transporter) {
      throw new Error('Failed to create email transporter');
    }

    const htmlContent = loadTemplate(template, data);
    
    const mailOptions = {
      from: from || EMAIL_CONFIG.auth.user,
      to,
      subject,
      html: htmlContent,
      text: htmlContent.replace(/<[^>]*>/g, '') // Strip HTML for plain text alternative
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  EMAIL_CONFIG
};
