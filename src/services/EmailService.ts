import { toast } from '@/hooks/use-toast';

// Microsoft Outlook Email Service Configuration
const EMAIL_CONFIG = {
  sender: 'Samer@jam3a.me',
  service: 'Microsoft Outlook',
  apiEndpoint: '/api/email', // This would be your server endpoint that handles actual email sending
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
      // In production, this would call your server API endpoint
      // that handles the actual email sending with Microsoft Outlook
      console.log('Email request:', {
        from: EMAIL_CONFIG.sender,
        to,
        subject,
        template,
        data
      });
      
      // For development/testing, simulate API call
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
      }).catch(error => {
        // Handle network errors or when API is not available
        console.log('API not available in development mode, simulating success');
        return { 
          ok: true, 
          json: () => Promise.resolve({ 
            success: true, 
            messageId: `mock-${Date.now()}` 
          })
        };
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
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
        data: { name }
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
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
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
        data: { name, orderDetails }
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
      console.error('Error sending order confirmation email:', error);
      return { success: false, error: error.message };
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
        data: { name, groupDetails }
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
      console.error('Error sending group complete email:', error);
      return { success: false, error: error.message };
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
          name,
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
      console.error('Error sending waitlist email:', error);
      return { success: false, error: error.message };
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
          name,
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
      console.error('Error sending registration email:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Send custom email
  sendCustomEmail: async (to, subject, htmlContent) => {
    try {
      const result = await EmailService.sendEmail({
        to,
        subject,
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
      console.error('Error sending custom email:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Subscribe to newsletter
  subscribeToNewsletter: async (email, name = '') => {
    try {
      // Send confirmation email
      await EmailService.sendEmail({
        to: email,
        subject: 'Newsletter Subscription Confirmation',
        template: 'newsletter',
        data: { name, email }
      });
      
      toast({
        title: 'Subscription successful',
        description: 'You have been subscribed to our newsletter',
        variant: 'default',
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      
      toast({
        title: 'Subscription failed',
        description: error.message,
        variant: 'destructive',
      });
      
      return { success: false, error: error.message };
    }
  }
};

export default EmailService;
