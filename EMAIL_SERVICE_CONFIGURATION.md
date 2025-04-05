# Email Service Configuration Guide for Jam3a

## Overview
This guide provides detailed instructions for setting up the email service for Jam3a using a third-party email service provider. The current implementation is configured to work with Microsoft Outlook's SMTP service, but you can use any SMTP provider of your choice.

## Supported Email Service Providers
You can integrate with any of these popular email service providers:

1. **Microsoft Outlook/Office 365** (current implementation)
2. **SendGrid**
3. **Mailgun**
4. **Amazon SES (Simple Email Service)**
5. **Gmail SMTP** (for testing only, not recommended for production)

## Configuration Steps

### 1. Sign Up for an Email Service

#### For Microsoft Outlook/Office 365:
1. Sign up for a Microsoft 365 Business account
2. Set up an email account to use for sending emails
3. Generate an app password for SMTP authentication

#### For SendGrid:
1. Create a SendGrid account at [sendgrid.com](https://sendgrid.com)
2. Verify your domain
3. Create an API key or SMTP credentials

#### For Mailgun:
1. Create a Mailgun account at [mailgun.com](https://mailgun.com)
2. Add and verify your domain
3. Get your SMTP credentials from the dashboard

#### For Amazon SES:
1. Create an AWS account if you don't have one
2. Navigate to the SES service
3. Verify your domain and email addresses
4. Request production access (to move out of the sandbox)
5. Create SMTP credentials

### 2. Update Server Configuration

1. Create a `.env` file in the root directory of your project with the following variables:

```
# Email Service Configuration
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@outlook.com
EMAIL_FROM_NAME=Jam3a Support
```

2. Update the `server/emailService.js` file if you're using a different provider:

For SendGrid:
```javascript
// Update these lines in emailService.js
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey', // This is literally 'apikey'
    pass: process.env.EMAIL_PASSWORD // Your SendGrid API key
  }
});
```

For Mailgun:
```javascript
// Update these lines in emailService.js
const transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Your Mailgun SMTP username
    pass: process.env.EMAIL_PASSWORD // Your Mailgun SMTP password
  }
});
```

For Amazon SES:
```javascript
// Update these lines in emailService.js
const transporter = nodemailer.createTransport({
  host: 'email-smtp.us-east-1.amazonaws.com', // Use your region
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Your SES SMTP username
    pass: process.env.EMAIL_PASSWORD // Your SES SMTP password
  }
});
```

### 3. Install Required Dependencies

Make sure you have the following dependencies installed:

```bash
npm install nodemailer dotenv
```

### 4. Update Server Entry Point

Ensure your `server.js` file loads the environment variables:

```javascript
require('dotenv').config();
```

### 5. Testing the Email Service

1. Create a test endpoint in your `server/routes/emailRoutes.js` file:

```javascript
router.post('/test-email', async (req, res) => {
  try {
    const result = await emailService.sendEmail({
      to: req.body.email,
      subject: 'Test Email from Jam3a',
      text: 'This is a test email from Jam3a.',
      html: '<p>This is a test email from Jam3a.</p>'
    });
    
    res.status(200).json({ success: true, message: 'Test email sent successfully', result });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ success: false, message: 'Failed to send test email', error: error.message });
  }
});
```

2. Test the endpoint using a tool like Postman or curl:

```bash
curl -X POST http://localhost:3000/api/email/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@example.com"}'
```

### 6. Production Considerations

1. **Environment Variables**: Never commit your `.env` file to version control. Use environment variables in your production environment.

2. **Rate Limits**: Be aware of the rate limits of your chosen email provider.

3. **Error Handling**: Implement proper error handling and logging for email failures.

4. **Email Templates**: Consider using a templating engine like Handlebars or EJS for more complex email templates.

5. **Email Queue**: For high-volume applications, consider implementing an email queue using a service like Redis or RabbitMQ.

## Troubleshooting

1. **Emails not sending**: Check your SMTP credentials and ensure your email provider is not blocking the connection.

2. **Emails going to spam**: Ensure your domain is properly set up with SPF, DKIM, and DMARC records.

3. **Rate limit errors**: Implement retry logic with exponential backoff for rate limit errors.

4. **Connection errors**: Check your firewall settings and ensure your server can connect to the SMTP server.

## Support

If you encounter any issues with the email service, please check the documentation of your chosen email provider or contact their support team.
