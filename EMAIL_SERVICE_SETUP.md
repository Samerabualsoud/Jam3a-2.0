# Email Service Setup for Jam3a

This guide provides instructions for setting up the email service for Jam3a using either Gmail or SendGrid.

## Current Implementation

The current email service implementation in `src/services/EmailService.ts` uses Nodemailer with Gmail SMTP. However, it's configured with placeholder credentials:

```javascript
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
```

## Option 1: Gmail Setup (Recommended for Testing)

To use Gmail for sending emails:

1. **Create a Gmail account** for your application (e.g., jam3a.notifications@gmail.com)

2. **Enable 2-Step Verification**:
   - Go to your Google Account settings
   - Select "Security"
   - Enable "2-Step Verification"

3. **Generate an App Password**:
   - Go to your Google Account settings
   - Select "Security"
   - Under "Signing in to Google," select "App passwords"
   - Generate a new app password for "Mail" and "Other (Custom name)" - name it "Jam3a"
   - Copy the 16-character password that appears

4. **Update Environment Variables**:
   Create a `.env` file in the project root with:
   ```
   EMAIL_USER=jam3a.notifications@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   ```

5. **Update EmailService.ts** (if not using environment variables):
   ```javascript
   const emailConfig = {
     service: 'gmail',
     host: 'smtp.gmail.com',
     port: 587,
     secure: false,
     auth: {
       user: process.env.EMAIL_USER || 'jam3a.notifications@gmail.com',
       pass: process.env.EMAIL_PASSWORD || 'your-16-character-app-password'
     }
   };
   ```

**Limitations**: Gmail has sending limits (500 emails per day), which may not be suitable for production use with a large user base.

## Option 2: SendGrid (Recommended for Production)

SendGrid is a professional email service provider with better deliverability and higher sending limits.

1. **Create a SendGrid Account**:
   - Sign up at [SendGrid](https://sendgrid.com/)
   - Choose a plan based on your needs (they offer a free tier with 100 emails/day)

2. **Create an API Key**:
   - In your SendGrid dashboard, go to Settings > API Keys
   - Create a new API key with "Mail Send" permissions
   - Copy the API key (you'll only see it once)

3. **Install SendGrid Package**:
   ```bash
   npm install @sendgrid/mail
   ```

4. **Update Environment Variables**:
   Create a `.env` file in the project root with:
   ```
   SENDGRID_API_KEY=your-sendgrid-api-key
   SENDGRID_FROM_EMAIL=notifications@jam3a.sa
   ```

5. **Create a SendGrid Email Service**:
   Create a new file `src/services/SendGridEmailService.ts`:

```typescript
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
const apiKey = process.env.SENDGRID_API_KEY || 'your-sendgrid-api-key-here';
sgMail.setApiKey(apiKey);

// Email templates (same as in EmailService.ts)
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
  // Add other email templates as needed
};

// SendGrid Email Service
const SendGridEmailService = {
  // Send welcome email
  sendWelcomeEmail: async (to, name) => {
    try {
      const template = emailTemplates.welcome;
      
      const msg = {
        to,
        from: process.env.SENDGRID_FROM_EMAIL || 'notifications@jam3a.sa',
        subject: template.subject,
        html: template.html(name)
      };
      
      await sgMail.send(msg);
      console.log('Welcome email sent to:', to);
      return { success: true };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Add other email sending functions as needed
  
  // Send test email
  sendTestEmail: async (to) => {
    try {
      const msg = {
        to,
        from: process.env.SENDGRID_FROM_EMAIL || 'notifications@jam3a.sa',
        subject: 'Jam3a Email Service Test',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #8b5cf6; text-align: center;">Jam3a Email Service Test</h2>
            <p>This is a test email from Jam3a email service using SendGrid.</p>
            <p>If you're receiving this, the email service is configured correctly!</p>
            <p>Test completed at: ${new Date().toLocaleString()}</p>
          </div>
        `
      };
      
      await sgMail.send(msg);
      console.log('Test email sent to:', to);
      return { success: true };
    } catch (error) {
      console.error('Error sending test email:', error);
      return { success: false, error: error.message };
    }
  }
};

export default SendGridEmailService;
```

## Option 3: Amazon SES (For High Volume)

For high-volume email sending, Amazon SES is a cost-effective solution:

1. **Create an AWS Account** and set up Amazon SES
2. **Verify your domain** in the SES console
3. **Create SMTP credentials** in the SES console
4. **Update your email configuration** to use Amazon SES

## Testing Email Configuration

To test your email configuration:

1. Add a test button in your admin panel
2. Call the `sendTestEmail` function with your email address
3. Check your inbox for the test email

## Troubleshooting

If emails are not being sent:

1. **Check console logs** for error messages
2. **Verify credentials** are correct
3. **Check spam folder** for test emails
4. **Ensure your domain is verified** (for SendGrid and Amazon SES)
5. **Check sending limits** for your chosen provider

## Production Considerations

For production deployment:

1. **Use environment variables** for all credentials
2. **Never commit API keys** to your repository
3. **Set up email templates** in your email service provider
4. **Monitor email deliverability** and open rates
5. **Implement email queue** for handling high volume
