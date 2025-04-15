import { toast } from '@/hooks/use-toast';

// Error handling utility
const handleServiceError = (error: any, defaultMessage: string) => {
  const errorMessage = error?.message || defaultMessage;
  console.error(defaultMessage, error);
  return { 
    success: false, 
    error: errorMessage,
    statusCode: error?.statusCode || 500
  };
};

// Microsoft Outlook Email Service Configuration with Zapier Integration
const EMAIL_CONFIG = {
  sender: 'Samer@jam3a.me',
  service: 'Microsoft Outlook',
  apiEndpoint: '/api/email/send', // Updated endpoint for combined email + Zapier
  zapierEndpoints: {
    waitlist: '/api/email/zapier/waitlist',
    registration: '/api/email/zapier/registration',
    newsletter: '/api/email/zapier/newsletter',
    orderConfirmation: '/api/email/zapier/order',
    groupComplete: '/api/email/zapier/group'
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

// Client-side email service API
const EmailService = {
  // Send email through API endpoint
  sendEmail: async ({ to, subject, template, data }) => {
    try {
      if (!to || typeof to !== 'string' || !to.includes('@')) {
        throw new Error('Invalid email address');
      }
      
      // Call the server API endpoint that handles the actual email sending with Microsoft Outlook + Zapier
      console.log('Email request:', {
        from: EMAIL_CONFIG.sender,
        to,
        subject,
        template,
        data
      });
      
      // Real API call to server endpoint (now with Zapier integration)
      const response = await fetch(EMAIL_CONFIG.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: EMAIL_CONFIG.sender,
          to,
          subject,
          template,
          data
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to send email: ${response.status}`);
      }
      
      const result = await response.json().catch(() => ({ success: true }));
      
      // Log Zapier integration result if available
      if (result.zapier) {
        console.log('Zapier integration result:', result.zapier);
      }
      
      return result;
    } catch (error) {
      return handleServiceError(error, 'Error sending email:');
    }
  },
  
  // Send welcome email
  sendWelcomeEmail: async (to, name) => {
    try {
      const template = EMAIL_CONFIG.templates.welcome;
      const result = await EmailService.sendEmail({
        to,
        subject: template.subject,
        template: template.template,
        data: { name: name || 'Valued Customer' }
      });
      
      if (result.success) {
        toast({
          title: 'Welcome email sent',
          description: `A welcome email has been sent to ${to}`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Failed to send welcome email',
          description: result.error,
          variant: 'destructive',
        });
      }
      
      return result;
    } catch (error) {
      return handleServiceError(error, 'Error sending welcome email:');
    }
  },
  
  // Send order confirmation email
  sendOrderConfirmationEmail: async (to, name, orderDetails) => {
    try {
      const template = EMAIL_CONFIG.templates.orderConfirmation;
      const result = await EmailService.sendEmail({
        to,
        subject: template.subject,
        template: template.template,
        data: { name: name || 'Valued Customer', orderDetails }
      });
      
      if (result.success) {
        toast({
          title: 'Order confirmation sent',
          description: `An order confirmation has been sent to ${to}`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Failed to send order confirmation',
          description: result.error,
          variant: 'destructive',
        });
      }
      
      return result;
    } catch (error) {
      return handleServiceError(error, 'Error sending order confirmation email:');
    }
  },
  
  // Send group complete email
  sendGroupCompleteEmail: async (to, name, groupDetails) => {
    try {
      const template = EMAIL_CONFIG.templates.groupComplete;
      const result = await EmailService.sendEmail({
        to,
        subject: template.subject,
        template: template.template,
        data: { name: name || 'Valued Customer', groupDetails }
      });
      
      if (result.success) {
        toast({
          title: 'Group completion notification sent',
          description: `A group completion email has been sent to ${to}`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Failed to send group completion email',
          description: result.error,
          variant: 'destructive',
        });
      }
      
      return result;
    } catch (error) {
      return handleServiceError(error, 'Error sending group complete email:');
    }
  },
  
  // Send waitlist confirmation email
  sendWaitlistEmail: async (to, name) => {
    try {
      const template = EMAIL_CONFIG.templates.waitlist;
      const result = await EmailService.sendEmail({
        to,
        subject: template.subject,
        template: template.template,
        data: { 
          name: name || 'Valued Customer',
          joinDate: new Date().toLocaleDateString(),
          position: Math.floor(Math.random() * 100) + 1, // Simulated waitlist position
        }
      });
      
      if (result.success) {
        toast({
          title: 'Waitlist confirmation sent',
          description: `A waitlist confirmation email has been sent to ${to}`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Failed to send waitlist confirmation',
          description: result.error,
          variant: 'destructive',
        });
      }
      
      return result;
    } catch (error) {
      return handleServiceError(error, 'Error sending waitlist email:');
    }
  },
  
  // Send registration confirmation email
  sendRegistrationEmail: async (to, name, accountDetails) => {
    try {
      const template = EMAIL_CONFIG.templates.registration;
      const result = await EmailService.sendEmail({
        to,
        subject: template.subject,
        template: template.template,
        data: { 
          name: name || 'Valued Customer',
          accountDetails,
          registrationDate: new Date().toLocaleDateString()
        }
      });
      
      if (result.success) {
        toast({
          title: 'Registration confirmation sent',
          description: `A registration confirmation email has been sent to ${to}`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Failed to send registration confirmation',
          description: result.error,
          variant: 'destructive',
        });
      }
      
      return result;
    } catch (error) {
      return handleServiceError(error, 'Error sending registration email:');
    }
  },
  
  // Send custom email
  sendCustomEmail: async (to, subject, htmlContent) => {
    try {
      const result = await EmailService.sendEmail({
        to,
        subject: subject || 'Message from Jam3a',
        template: 'custom',
        data: { htmlContent }
      });
      
      if (result.success) {
        toast({
          title: 'Email sent',
          description: `An email has been sent to ${to}`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Failed to send email',
          description: result.error,
          variant: 'destructive',
        });
      }
      
      return result;
    } catch (error) {
      return handleServiceError(error, 'Error sending custom email:');
    }
  },
  
  // Subscribe to newsletter
  subscribeToNewsletter: async (email, name = '') => {
    try {
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        throw new Error('Invalid email address');
      }
      
      // Send confirmation email
      await EmailService.sendEmail({
        to: email,
        subject: 'Newsletter Subscription Confirmation',
        template: 'newsletter',
        data: { name: name || 'Valued Subscriber', email }
      });
      
      toast({
        title: 'Subscription successful',
        description: 'You have been subscribed to our newsletter',
        variant: 'default',
      });
      
      return { success: true };
    } catch (error) {
      const result = handleServiceError(error, 'Error subscribing to newsletter:');
      
      toast({
        title: 'Subscription failed',
        description: result.error,
        variant: 'destructive',
      });
      
      return result;
    }
  }
};

export default EmailService;
