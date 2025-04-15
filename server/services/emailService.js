// Email service for Jam3a
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-password'
  },
  from: process.env.EMAIL_FROM || 'Jam3a <noreply@jam3a.me>'
};

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: EMAIL_CONFIG.host,
    port: EMAIL_CONFIG.port,
    secure: EMAIL_CONFIG.secure,
    auth: EMAIL_CONFIG.auth
  });
};

// Get template directory
const getTemplateDir = () => {
  return path.join(__dirname, 'templates');
};

// Load template
const loadTemplate = (templateName) => {
  try {
    const templateDir = getTemplateDir();
    const templatePath = path.join(templateDir, `${templateName}.html`);
    
    if (!fs.existsSync(templatePath)) {
      console.error(`Template not found: ${templateName}`);
      return null;
    }
    
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    return handlebars.compile(templateSource);
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    return null;
  }
};

// Send email
const sendEmail = async ({ to, subject, template, data, attachments = [] }) => {
  try {
    // Validate required fields
    if (!to || !subject || !template) {
      throw new Error('Missing required fields: to, subject, template');
    }
    
    // Load template
    const compiledTemplate = loadTemplate(template);
    if (!compiledTemplate) {
      throw new Error(`Failed to load template: ${template}`);
    }
    
    // Render template with data
    const html = compiledTemplate(data || {});
    
    // Create transporter
    const transporter = createTransporter();
    
    // Send email
    const info = await transporter.sendMail({
      from: EMAIL_CONFIG.from,
      to,
      subject,
      html,
      attachments
    });
    
    console.log(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send bulk emails
const sendBulkEmails = async ({ recipients, subject, template, data, attachments = [] }) => {
  try {
    // Validate required fields
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      throw new Error('Recipients must be a non-empty array');
    }
    
    if (!subject || !template) {
      throw new Error('Missing required fields: subject, template');
    }
    
    // Load template
    const compiledTemplate = loadTemplate(template);
    if (!compiledTemplate) {
      throw new Error(`Failed to load template: ${template}`);
    }
    
    // Create transporter
    const transporter = createTransporter();
    
    // Send emails
    const results = await Promise.all(
      recipients.map(async (recipient) => {
        try {
          // Merge recipient data with common data
          const recipientData = {
            ...data,
            ...recipient.data
          };
          
          // Render template with data
          const html = compiledTemplate(recipientData);
          
          // Send email
          const info = await transporter.sendMail({
            from: EMAIL_CONFIG.from,
            to: recipient.email,
            subject,
            html,
            attachments
          });
          
          return { 
            email: recipient.email, 
            success: true, 
            messageId: info.messageId 
          };
        } catch (error) {
          console.error(`Error sending email to ${recipient.email}:`, error);
          return { 
            email: recipient.email, 
            success: false, 
            error: error.message 
          };
        }
      })
    );
    
    // Count successes and failures
    const successes = results.filter(r => r.success).length;
    const failures = results.filter(r => !r.success).length;
    
    console.log(`Bulk email results: ${successes} sent, ${failures} failed`);
    
    return { 
      success: failures === 0,
      results,
      summary: { total: results.length, successes, failures }
    };
  } catch (error) {
    console.error('Error sending bulk emails:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  sendBulkEmails
};
