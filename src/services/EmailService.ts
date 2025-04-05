import { toast } from '@/hooks/use-toast';

// Mock email service for client-side only
// This avoids server-side dependencies like nodemailer that cause build issues

// Email templates
const emailTemplates = {
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
  }
};

// Client-side email service API
const EmailService = {
  // Mock email sending function that doesn't rely on server-side dependencies
  sendEmail: async ({ to, subject, template, data }) => {
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll just log the email details and return success
      console.log('Email would be sent:', {
        to,
        subject,
        template,
        data
      });
      
      // Simulate a successful response
      return { success: true, messageId: `mock-${Date.now()}` };
    } catch (error) {
      console.error('Error in mock email send:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Send welcome email
  sendWelcomeEmail: async (to, name) => {
    try {
      const template = emailTemplates.welcome;
      const result = await EmailService.sendEmail({
        to,
        subject: template.subject,
        template: template.template,
        data: { name }
      });
      
      if (result.success) {
        toast({
          title: 'Welcome email sent',
          description: `A welcome email would be sent to ${to}`,
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
      const template = emailTemplates.orderConfirmation;
      const result = await EmailService.sendEmail({
        to,
        subject: template.subject,
        template: template.template,
        data: { name, orderDetails }
      });
      
      if (result.success) {
        toast({
          title: 'Order confirmation sent',
          description: `An order confirmation would be sent to ${to}`,
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
      const template = emailTemplates.groupComplete;
      const result = await EmailService.sendEmail({
        to,
        subject: template.subject,
        template: template.template,
        data: { name, groupDetails }
      });
      
      if (result.success) {
        toast({
          title: 'Group completion notification sent',
          description: `A group completion email would be sent to ${to}`,
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
          description: `An email would be sent to ${to}`,
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
  subscribeToNewsletter: async (email) => {
    try {
      // In a real implementation, this would call an API endpoint
      console.log('Subscribing to newsletter:', email);
      
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
