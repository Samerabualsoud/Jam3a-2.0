// EmailService.ts
// This service handles all email-related functionality

import axios from 'axios';

interface EmailTemplate {
  subject: string;
  body: string;
}

interface EmailConfig {
  apiKey: string;
  domain: string;
  region?: string;
  service: 'mailgun' | 'sendgrid' | 'ses';
}

export interface EmailData {
  to: string;
  from?: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private config: EmailConfig;
  private defaultFrom: string = 'noreply@jam3a.me';
  
  constructor(config?: EmailConfig) {
    // Default configuration with Mailgun as the primary service
    this.config = config || {
      service: 'mailgun',
      apiKey: process.env.MAILGUN_API_KEY || 'key-your-mailgun-api-key',
      domain: process.env.MAILGUN_DOMAIN || 'mail.jam3a.me'
    };
  }

  // Update email configuration
  public updateConfig(config: EmailConfig): void {
    this.config = config;
  }

  // Templates for different email types with updated styling to match new design
  private templates = {
    welcome: {
      en: {
        subject: 'Welcome to Jam3a Hub Collective!',
        body: `
          <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Welcome to Jam3a!</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
              <p>Hello {{name}},</p>
              <p>Thank you for joining Jam3a Hub Collective! We're excited to have you as part of our community.</p>
              <p>With Jam3a, you can:</p>
              <ul>
                <li>Join group buying deals to save money</li>
                <li>Start your own Jam3a and invite friends</li>
                <li>Discover exclusive products at great prices</li>
              </ul>
              <p>Ready to start shopping? Check out our current deals:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{shopUrl}}" style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Shop Jam3a Deals</a>
              </div>
              <p>If you have any questions, feel free to contact our support team at support@jam3a.me.</p>
              <p>Happy shopping!</p>
              <p>The Jam3a Team</p>
            </div>
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
              <p>© 2025 Jam3a Hub Collective. All rights reserved.</p>
              <p>King Fahd Road, Riyadh, Saudi Arabia</p>
            </div>
          </div>
        `
      },
      ar: {
        subject: 'مرحبًا بك في جمعة هب كوليكتيف!',
        body: `
          <div style="font-family: 'Tajawal', Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl; text-align: right;">
            <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">مرحبًا بك في جمعة!</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
              <p>مرحبًا {{name}}،</p>
              <p>شكرًا لانضمامك إلى جمعة هب كوليكتيف! نحن متحمسون لوجودك كجزء من مجتمعنا.</p>
              <p>مع جمعة، يمكنك:</p>
              <ul>
                <li>الانضمام إلى صفقات الشراء الجماعي لتوفير المال</li>
                <li>بدء جمعة خاصة بك ودعوة الأصدقاء</li>
                <li>اكتشاف منتجات حصرية بأسعار رائعة</li>
              </ul>
              <p>هل أنت مستعد لبدء التسوق؟ تحقق من صفقاتنا الحالية:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{shopUrl}}" style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">تسوق صفقات جمعة</a>
              </div>
              <p>إذا كانت لديك أي أسئلة، فلا تتردد في الاتصال بفريق الدعم لدينا على support@jam3a.me.</p>
              <p>تسوق سعيد!</p>
              <p>فريق جمعة</p>
            </div>
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
              <p>© 2025 جمعة هب كوليكتيف. جميع الحقوق محفوظة.</p>
              <p>طريق الملك فهد، الرياض، المملكة العربية السعودية</p>
            </div>
          </div>
        `
      }
    },
    waitingList: {
      en: {
        subject: 'You\'re on the Jam3a Waiting List!',
        body: `
          <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">You're on the List!</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
              <p>Hello {{name}},</p>
              <p>Thank you for joining the Jam3a Hub Collective waiting list! We're thrilled about your interest in our platform.</p>
              <p>We're working hard to expand our capacity and will notify you as soon as we're ready to welcome you to our community.</p>
              <p>In the meantime, here's what you can expect:</p>
              <ul>
                <li>Early access to our platform when spots become available</li>
                <li>Special promotions for waiting list members</li>
                <li>Updates on our latest features and offerings</li>
              </ul>
              <p>Your position on the waiting list: <strong>{{position}}</strong></p>
              <p>We appreciate your patience and look forward to having you join the Jam3a community soon!</p>
              <p>Best regards,</p>
              <p>The Jam3a Team</p>
            </div>
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
              <p>© 2025 Jam3a Hub Collective. All rights reserved.</p>
              <p>King Fahd Road, Riyadh, Saudi Arabia</p>
            </div>
          </div>
        `
      },
      ar: {
        subject: 'أنت على قائمة انتظار جمعة!',
        body: `
          <div style="font-family: 'Tajawal', Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl; text-align: right;">
            <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">أنت على القائمة!</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
              <p>مرحبًا {{name}}،</p>
              <p>شكرًا لانضمامك إلى قائمة انتظار جمعة هب كوليكتيف! نحن متحمسون لاهتمامك بمنصتنا.</p>
              <p>نحن نعمل بجد لتوسيع قدرتنا وسنخطرك بمجرد أن نكون جاهزين للترحيب بك في مجتمعنا.</p>
              <p>في غضون ذلك، إليك ما يمكنك توقعه:</p>
              <ul>
                <li>وصول مبكر إلى منصتنا عندما تصبح الأماكن متاحة</li>
                <li>عروض ترويجية خاصة لأعضاء قائمة الانتظار</li>
                <li>تحديثات حول أحدث ميزاتنا وعروضنا</li>
              </ul>
              <p>موقعك في قائمة الانتظار: <strong>{{position}}</strong></p>
              <p>نقدر صبرك ونتطلع إلى انضمامك إلى مجتمع جمعة قريبًا!</p>
              <p>مع أطيب التحيات،</p>
              <p>فريق جمعة</p>
            </div>
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
              <p>© 2025 جمعة هب كوليكتيف. جميع الحقوق محفوظة.</p>
              <p>طريق الملك فهد، الرياض، المملكة العربية السعودية</p>
            </div>
          </div>
        `
      }
    },
    orderConfirmation: {
      en: {
        subject: 'Your Jam3a Order Confirmation - #{{orderNumber}}',
        body: `
          <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Order Confirmation</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
              <p>Hello {{name}},</p>
              <p>Thank you for your order! Your Jam3a group purchase has been confirmed.</p>
              <p><strong>Order Number:</strong> {{orderNumber}}</p>
              <p><strong>Order Date:</strong> {{orderDate}}</p>
              <p><strong>Product:</strong> {{productName}}</p>
              <p><strong>Price:</strong> {{price}} SAR</p>
              <p><strong>Estimated Delivery:</strong> {{estimatedDelivery}}</p>
              <p>You can track your order status at any time by visiting your account or using the link below:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{trackingUrl}}" style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Track Your Order</a>
              </div>
              <p>If you have any questions about your order, please contact our customer support team at support@jam3a.me.</p>
              <p>Thank you for shopping with Jam3a!</p>
              <p>The Jam3a Team</p>
            </div>
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
              <p>© 2025 Jam3a Hub Collective. All rights reserved.</p>
              <p>King Fahd Road, Riyadh, Saudi Arabia</p>
            </div>
          </div>
        `
      },
      ar: {
        subject: 'تأكيد طلب جمعة الخاص بك - #{{orderNumber}}',
        body: `
          <div style="font-family: 'Tajawal', Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl; text-align: right;">
            <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">تأكيد الطلب</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
              <p>مرحبًا {{name}}،</p>
              <p>شكرًا على طلبك! تم تأكيد عملية الشراء الجماعي الخاصة بك في جمعة.</p>
              <p><strong>رقم الطلب:</strong> {{orderNumber}}</p>
              <p><strong>تاريخ الطلب:</strong> {{orderDate}}</p>
              <p><strong>المنتج:</strong> {{productName}}</p>
              <p><strong>السعر:</strong> {{price}} ريال سعودي</p>
              <p><strong>التسليم المتوقع:</strong> {{estimatedDelivery}}</p>
              <p>يمكنك تتبع حالة طلبك في أي وقت من خلال زيارة حسابك أو استخدام الرابط أدناه:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{trackingUrl}}" style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">تتبع طلبك</a>
              </div>
              <p>إذا كانت لديك أي أسئلة حول طلبك، يرجى الاتصال بفريق دعم العملاء لدينا على support@jam3a.me.</p>
              <p>شكرًا للتسوق مع جمعة!</p>
              <p>فريق جمعة</p>
            </div>
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
              <p>© 2025 جمعة هب كوليكتيف. جميع الحقوق محفوظة.</p>
              <p>طريق الملك فهد، الرياض، المملكة العربية السعودية</p>
            </div>
          </div>
        `
      }
    }
  };

  // Replace template variables with actual values
  private replaceTemplateVariables(template: string, variables: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    }
    return result;
  }

  // Get email template based on type and language
  private getTemplate(type: keyof typeof this.templates, language: 'en' | 'ar', variables: Record<string, string>): EmailTemplate {
    const template = this.templates[type][language];
    return {
      subject: this.replaceTemplateVariables(template.subject, variables),
      body: this.replaceTemplateVariables(template.body, variables)
    };
  }

  // Send email using Mailgun API
  private async sendWithMailgun(emailData: EmailData): Promise<boolean> {
    try {
      const url = `https://api.mailgun.net/v3/${this.config.domain}/messages`;
      const auth = {
        username: 'api',
        password: this.config.apiKey
      };
      
      const formData = new FormData();
      formData.append('from', emailData.from || this.defaultFrom);
      formData.append('to', emailData.to);
      formData.append('subject', emailData.subject);
      formData.append('html', emailData.html);
      
      if (emailData.text) {
        formData.append('text', emailData.text);
      }
      
      const response = await axios.post(url, formData, { 
        auth,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.status === 200;
    } catch (error) {
      console.error('Error sending email with Mailgun:', error);
      return false;
    }
  }

  // Send email using SendGrid API
  private async sendWithSendGrid(emailData: EmailData): Promise<boolean> {
    try {
      const url = 'https://api.sendgrid.com/v3/mail/send';
      const data = {
        personalizations: [
          {
            to: [{ email: emailData.to }]
          }
        ],
        from: { email: emailData.from || this.defaultFrom },
        subject: emailData.subject,
        content: [
          {
            type: 'text/html',
            value: emailData.html
          }
        ]
      };
      
      if (emailData.text) {
        data.content.push({
          type: 'text/plain',
          value: emailData.text
        });
      }
      
      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.status === 202;
    } catch (error) {
      console.error('Error sending email with SendGrid:', error);
      return false;
    }
  }

  // Send email using the configured service
  public async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      switch (this.config.service) {
        case 'mailgun':
          return await this.sendWithMailgun(emailData);
        case 'sendgrid':
          return await this.sendWithSendGrid(emailData);
        default:
          console.error('Unsupported email service');
          return false;
      }
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Send welcome email
  public async sendWelcomeEmail(to: string, name: string, language: 'en' | 'ar' = 'en'): Promise<boolean> {
    const shopUrl = 'https://jam3a.me/shop-jam3a';
    const template = this.getTemplate('welcome', language, { name, shopUrl });
    
    return await this.sendEmail({
      to,
      subject: template.subject,
      html: template.body
    });
  }

  // Send waiting list confirmation email
  public async sendWaitingListEmail(to: string, name: string, position: number, language: 'en' | 'ar' = 'en'): Promise<boolean> {
    const template = this.getTemplate('waitingList', language, { name, position: position.toString() });
    
    return await this.sendEmail({
      to,
      subject: template.subject,
      html: template.body
    });
  }

  // Send order confirmation email
  public async sendOrderConfirmationEmail(
    to: string, 
    name: string, 
    orderNumber: string, 
    orderDate: string,
    productName: string,
    price: string,
    estimatedDelivery: string,
    trackingUrl: string,
    language: 'en' | 'ar' = 'en'
  ): Promise<boolean> {
    const template = this.getTemplate('orderConfirmation', language, { 
      name, 
      orderNumber, 
      orderDate, 
      productName, 
      price, 
      estimatedDelivery, 
      trackingUrl 
    });
    
    return await this.sendEmail({
      to,
      subject: template.subject,
      html: template.body
    });
  }

  // Send test email to verify configuration
  public async sendTestEmail(to: string): Promise<boolean> {
    return await this.sendEmail({
      to,
      subject: 'Jam3a Email Service Test',
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Email Service Test</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
            <p>This is a test email from Jam3a Hub Collective.</p>
            <p>If you're receiving this, the email service is configured correctly!</p>
            <p>Time sent: ${new Date().toISOString()}</p>
          </div>
        </div>
      `
    });
  }
}

// Export a singleton instance
const emailService = new EmailService();
export default emailService;
