// EmailService.ts
// This service handles all email-related functionality

interface EmailTemplate {
  subject: string;
  body: string;
}

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
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
    // Default configuration - would be replaced with actual SMTP settings
    this.config = config || {
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'user@example.com',
        pass: process.env.SMTP_PASS || 'password'
      }
    };
  }

  // Templates for different email types
  private templates = {
    welcome: {
      en: {
        subject: 'Welcome to Jam3a Hub Collective!',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #6d28d9; padding: 20px; text-align: center;">
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
                <a href="{{shopUrl}}" style="background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Shop Jam3a Deals</a>
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
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl; text-align: right;">
            <div style="background-color: #6d28d9; padding: 20px; text-align: center;">
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
                <a href="{{shopUrl}}" style="background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">تسوق صفقات جمعة</a>
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
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #6d28d9; padding: 20px; text-align: center;">
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
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl; text-align: right;">
            <div style="background-color: #6d28d9; padding: 20px; text-align: center;">
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
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #6d28d9; padding: 20px; text-align: center;">
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
                <a href="{{trackingUrl}}" style="background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Track Your Order</a>
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
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl; text-align: right;">
            <div style="background-color: #6d28d9; padding: 20px; text-align: center;">
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
                <a href="{{trackingUrl}}" style="background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">تتبع طلبك</a>
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
    },
    jam3aInvitation: {
      en: {
        subject: 'You\'ve Been Invited to Join a Jam3a!',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #6d28d9; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">You're Invited!</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
              <p>Hello,</p>
              <p><strong>{{inviterName}}</strong> has invited you to join their Jam3a group purchase for <strong>{{productName}}</strong>!</p>
              <p>By joining this Jam3a, you'll get:</p>
              <ul>
                <li>A special group discount price of <strong>{{price}} SAR</strong> (regular price: {{regularPrice}} SAR)</li>
                <li>Convenient delivery options</li>
                <li>The satisfaction of shopping smarter together</li>
              </ul>
              <p><strong>Current participants:</strong> {{currentParticipants}}/{{requiredParticipants}}</p>
              <p><strong>Time remaining:</strong> {{timeRemaining}}</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{joinUrl}}" style="background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Join This Jam3a</a>
              </div>
              <p>Don't miss out on this opportunity to save!</p>
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
        subject: 'تمت دعوتك للانضمام إلى جمعة!',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl; text-align: right;">
            <div style="background-color: #6d28d9; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">تمت دعوتك!</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
              <p>مرحبًا،</p>
              <p>قام <strong>{{inviterName}}</strong> بدعوتك للانضمام إلى مجموعة الشراء الخاصة بهم في جمعة لـ <strong>{{productName}}</strong>!</p>
              <p>من خلال الانضمام إلى هذه الجمعة، ستحصل على:</p>
              <ul>
                <li>سعر خصم خاص للمجموعة <strong>{{price}} ريال سعودي</strong> (السعر العادي: {{regularPrice}} ريال سعودي)</li>
                <li>خيارات توصيل مريحة</li>
                <li>الرضا عن التسوق بشكل أذكى معًا</li>
              </ul>
              <p><strong>المشاركون الحاليون:</strong> {{currentParticipants}}/{{requiredParticipants}}</p>
              <p><strong>الوقت المتبقي:</strong> {{timeRemaining}}</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{joinUrl}}" style="background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">انضم إلى هذه الجمعة</a>
              </div>
              <p>لا تفوت هذه الفرصة للتوفير!</p>
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

  // Get template and replace placeholders
  private getTemplate(type: string, language: 'en' | 'ar', data: Record<string, string>): EmailTemplate {
    const template = this.templates[type][language];
    
    let body = template.body;
    let subject = template.subject;
    
    // Replace placeholders in subject and body
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      body = body.replace(regex, data[key]);
      subject = subject.replace(regex, data[key]);
    });
    
    return { subject, body };
  }

  // Send email method
  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // In a real implementation, this would use a library like nodemailer
      // to send the actual email
      console.log('Sending email:', emailData);
      
      // Simulate successful email sending
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Send welcome email
  async sendWelcomeEmail(to: string, name: string, language: 'en' | 'ar' = 'en'): Promise<boolean> {
    const baseUrl = process.env.BASE_URL || 'https://jam3a.me';
    const data = {
      name,
      shopUrl: `${baseUrl}/shop-jam3a`
    };
    
    const template = this.getTemplate('welcome', language, data);
    
    return this.sendEmail({
      to,
      from: this.defaultFrom,
      subject: template.subject,
      html: template.body
    });
  }

  // Send waiting list confirmation email
  async sendWaitingListEmail(to: string, name: string, position: number, language: 'en' | 'ar' = 'en'): Promise<boolean> {
    const data = {
      name,
      position: position.toString()
    };
    
    const template = this.getTemplate('waitingList', language, data);
    
    return this.sendEmail({
      to,
      from: this.defaultFrom,
      subject: template.subject,
      html: template.body
    });
  }

  // Send order confirmation email
  async sendOrderConfirmationEmail(
    to: string, 
    name: string, 
    orderNumber: string, 
    orderDate: string,
    productName: string,
    price: string,
    estimatedDelivery: string,
    language: 'en' | 'ar' = 'en'
  ): Promise<boolean> {
    const baseUrl = process.env.BASE_URL || 'https://jam3a.me';
    const data = {
      name,
      orderNumber,
      orderDate,
      productName,
      price,
      estimatedDelivery,
      trackingUrl: `${baseUrl}/track-order?order=${orderNumber}`
    };
    
    const template = this.getTemplate('orderConfirmation', language, data);
    
    return this.sendEmail({
      to,
      from: this.defaultFrom,
      subject: template.subject,
      html: template.body
    });
  }

  // Send Jam3a invitation email
  async sendJam3aInvitationEmail(
    to: string,
    inviterName: string,
    productName: string,
    price: string,
    regularPrice: string,
    currentParticipants: number,
    requiredParticipants: number,
    timeRemaining: string,
    jam3aId: string,
    language: 'en' | 'ar' = 'en'
  ): Promise<boolean> {
    const baseUrl = process.env.BASE_URL || 'https://jam3a.me';
    const data = {
      inviterName,
      productName,
      price,
      regularPrice,
      currentParticipants: currentParticipants.toString(),
      requiredParticipants: requiredParticipants.toString(),
      timeRemaining,
      joinUrl: `${baseUrl}/join-jam3a/${jam3aId}`
    };
    
    const template = this.getTemplate('jam3aInvitation', language, data);
    
    return this.sendEmail({
      to,
      from: this.defaultFrom,
      subject: template.subject,
      html: template.body
    });
  }
}

export default new EmailService();
