# Microsoft Email Service Setup for Jam3a

This guide explains how to set up and use Microsoft email services for automated emails in the Jam3a application.

## Configuration

The email service has been configured to use Microsoft Outlook SMTP server with the following settings:

```javascript
// Email service configuration for Microsoft
const emailConfig = {
  service: 'outlook',
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'your-microsoft-email@outlook.com',
    pass: process.env.EMAIL_PASSWORD || 'your-microsoft-password-here'
  }
};
```

## Setup Instructions

### 1. Create or Use an Existing Microsoft Account

You'll need a Microsoft account (Outlook, Office 365, etc.) to send emails from.

### 2. Configure Environment Variables

For security, set up environment variables in your deployment environment:

```
EMAIL_USER=your-microsoft-email@outlook.com
EMAIL_PASSWORD=your-app-password
```

### 3. App Password for Microsoft Account

If you have two-factor authentication enabled (recommended), you'll need to create an app password:

1. Sign in to your Microsoft account
2. Go to Security settings
3. Select "App passwords"
4. Create a new app password for "Jam3a Application"
5. Use this password in your environment variables

## Email Templates

The service includes several pre-configured email templates:

1. **Welcome Email** - Sent when users register
2. **Order Confirmation** - Sent when an order is placed
3. **Group Complete** - Sent when a group purchase is completed
4. **Newsletter Subscription** - Sent when users join the waitlist

## Usage Examples

### Sending Welcome Email

```javascript
import EmailService from '@/services/EmailService';

// When a user registers
const sendWelcomeEmail = async (user) => {
  try {
    const result = await EmailService.sendWelcomeEmail(
      user.email,
      user.name
    );
    
    if (result.success) {
      console.log('Welcome email sent successfully');
    } else {
      console.error('Failed to send welcome email:', result.error);
    }
  } catch (error) {
    console.error('Error in sending welcome email:', error);
  }
};
```

### Sending Waitlist Confirmation

```javascript
import EmailService from '@/services/EmailService';

// When a user joins the waitlist
const handleJoinWaitlist = async (email, name) => {
  try {
    // Subscribe to newsletter (this sends a confirmation email)
    const result = await EmailService.subscribeToNewsletter(email);
    
    if (result.success) {
      console.log('Waitlist confirmation email sent successfully');
    } else {
      console.error('Failed to send waitlist email:', result.error);
    }
  } catch (error) {
    console.error('Error in sending waitlist email:', error);
  }
};
```

## Testing the Email Service

You can test if your email configuration is working correctly:

```javascript
import EmailService from '@/services/EmailService';

// Test email functionality
const testEmailService = async () => {
  try {
    const result = await EmailService.sendTestEmail('your-test-email@example.com');
    
    if (result.success) {
      console.log('Test email sent successfully');
    } else {
      console.error('Failed to send test email:', result.error);
    }
  } catch (error) {
    console.error('Error in sending test email:', error);
  }
};
```

## Troubleshooting

If you encounter issues with the email service:

1. **Authentication Errors**: Verify your email and password are correct
2. **Connection Errors**: Ensure your server can connect to smtp.office365.com:587
3. **Rate Limiting**: Microsoft may limit the number of emails you can send in a period
4. **Spam Filters**: Check if your emails are being marked as spam

For persistent issues, consider using Microsoft's official SDK for more advanced integration.

## Production Considerations

For production environments:

1. Always use environment variables for credentials
2. Consider using a dedicated email service like SendGrid or Mailchimp for high-volume sending
3. Implement email queue systems for reliability
4. Monitor email delivery rates and bounces
