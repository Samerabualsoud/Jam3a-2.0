import { toast } from '@/hooks/use-toast';

// Email templates
const emailTemplates = {
  welcome: {
    subject: 'Welcome to Jam3a!',
    template: 'welcome',
    data: (name) => ({
      name,
      year: new Date().getFullYear()
    })
  },
  orderConfirmation: {
    subject: 'Your Jam3a Order Confirmation',
    template: 'order-confirmation',
    data: (name, orderDetails) => ({
      name,
      orderId: orderDetails.orderId,
      product: orderDetails.product,
      price: orderDetails.price,
      delivery: orderDetails.delivery,
      year: new Date().getFullYear()
    })
  },
  groupComplete: {
    subject: 'Your Jam3a Group is Complete!',
    template: 'group-complete',
    data: (name, groupDetails) => ({
      name,
      product: groupDetails.product,
      members: groupDetails.members,
      finalPrice: groupDetails.finalPrice,
      savings: groupDetails.savings,
      delivery: groupDetails.delivery,
      year: new Date().getFullYear()
    })
  }
};

// Client-side email service API
const EmailService = {
  // Send email via API endpoint
  sendEmail: async ({ to, subject, template, data }) => {
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          template,
          data
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to send email');
      }
      
      console.log('Email sent successfully:', result);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
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
        data: template.data(name)
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
      const template = emailTemplates.orderConfirmation;
      const result = await EmailService.sendEmail({
        to,
        subject: template.subject,
        template: template.template,
        data: template.data(name, orderDetails)
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
      const template = emailTemplates.groupComplete;
      const result = await EmailService.sendEmail({
        to,
        subject: template.subject,
        template: template.template,
        data: template.data(name, groupDetails)
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
  subscribeToNewsletter: async (email) => {
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to subscribe to newsletter');
      }
      
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
