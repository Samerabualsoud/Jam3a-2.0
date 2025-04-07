// Create email templates directory and default templates
const fs = require('fs');
const path = require('path');

// Define template directory
const templatesDir = path.join(__dirname, 'templates');

// Create templates directory if it doesn't exist
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

// Define templates
const templates = {
  welcome: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Jam3a</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 20px; }
    .logo { max-width: 150px; }
    .button { display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://jam3a.me/logo.png" alt="Jam3a Logo" class="logo">
    </div>
    <div class="content">
      <h1>Welcome to Jam3a!</h1>
      <p>Hello {{name}},</p>
      <p>Thank you for joining Jam3a! We're excited to have you as part of our community.</p>
      <p>With Jam3a, you can:</p>
      <ul>
        <li>Join group buying deals to save money</li>
        <li>Discover new products at great prices</li>
        <li>Connect with others who share your interests</li>
      </ul>
      <p>Get started by exploring our current deals:</p>
      <p style="text-align: center;">
        <a href="https://jam3a.me/deals" class="button">View Deals</a>
      </p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Jam3a. All rights reserved.</p>
      <p>Jam3a.me | <a href="mailto:info@jam3a.me">info@jam3a.me</a></p>
    </div>
  </div>
</body>
</html>
  `,
  
  'order-confirmation': `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 20px; }
    .logo { max-width: 150px; }
    .order-details { border: 1px solid #ddd; padding: 15px; margin: 20px 0; }
    .item { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .total { font-weight: bold; border-top: 1px solid #ddd; padding-top: 10px; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://jam3a.me/logo.png" alt="Jam3a Logo" class="logo">
    </div>
    <div class="content">
      <h1>Order Confirmation</h1>
      <p>Hello {{name}},</p>
      <p>Thank you for your order! We've received your purchase and are processing it now.</p>
      
      <div class="order-details">
        <h3>Order #{{orderDetails.id}}</h3>
        <p>Date: {{orderDetails.date}}</p>
        
        {{#each orderDetails.items}}
        <div class="item">
          <span>{{this.name}} x {{this.quantity}}</span>
          <span>SAR {{this.price}}</span>
        </div>
        {{/each}}
        
        <div class="total">
          <div class="item">
            <span>Subtotal:</span>
            <span>SAR {{orderDetails.subtotal}}</span>
          </div>
          <div class="item">
            <span>Shipping:</span>
            <span>SAR {{orderDetails.shipping}}</span>
          </div>
          <div class="item">
            <span>Total:</span>
            <span>SAR {{orderDetails.total}}</span>
          </div>
        </div>
      </div>
      
      <p>We'll send you another email when your order ships.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Jam3a. All rights reserved.</p>
      <p>Jam3a.me | <a href="mailto:info@jam3a.me">info@jam3a.me</a></p>
    </div>
  </div>
</body>
</html>
  `,
  
  'group-complete': `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Jam3a Group is Complete!</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 20px; }
    .logo { max-width: 150px; }
    .success-box { background-color: #e8f5e9; border: 1px solid #4CAF50; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .button { display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://jam3a.me/logo.png" alt="Jam3a Logo" class="logo">
    </div>
    <div class="content">
      <h1>Your Jam3a Group is Complete!</h1>
      <p>Hello {{name}},</p>
      
      <div class="success-box">
        <h3>Great news!</h3>
        <p>Your Jam3a group for <strong>{{groupDetails.productName}}</strong> is now complete!</p>
        <p>Group Size: {{groupDetails.groupSize}} participants</p>
        <p>Discount: {{groupDetails.discount}}%</p>
        <p>Final Price: SAR {{groupDetails.finalPrice}}</p>
      </div>
      
      <p>We'll process your order and send you a confirmation email shortly.</p>
      <p>Thank you for participating in this Jam3a deal!</p>
      
      <p style="text-align: center;">
        <a href="https://jam3a.me/deals" class="button">Explore More Deals</a>
      </p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Jam3a. All rights reserved.</p>
      <p>Jam3a.me | <a href="mailto:info@jam3a.me">info@jam3a.me</a></p>
    </div>
  </div>
</body>
</html>
  `,
  
  waitlist: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>You've Joined the Jam3a Waitlist</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 20px; }
    .logo { max-width: 150px; }
    .waitlist-info { background-color: #e3f2fd; border: 1px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://jam3a.me/logo.png" alt="Jam3a Logo" class="logo">
    </div>
    <div class="content">
      <h1>You're on the Waitlist!</h1>
      <p>Hello {{name}},</p>
      <p>Thank you for joining the Jam3a waitlist! We're excited about your interest in our platform.</p>
      
      <div class="waitlist-info">
        <h3>Your Waitlist Information</h3>
        <p>Date Joined: {{joinDate}}</p>
        <p>Position: {{position}}</p>
      </div>
      
      <p>We'll notify you as soon as we're ready to welcome you to Jam3a. In the meantime, feel free to follow us on social media for updates.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Jam3a. All rights reserved.</p>
      <p>Jam3a.me | <a href="mailto:info@jam3a.me">info@jam3a.me</a></p>
    </div>
  </div>
</body>
</html>
  `,
  
  registration: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Registration Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 20px; }
    .logo { max-width: 150px; }
    .account-info { background-color: #f5f5f5; border: 1px solid #ddd; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .button { display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://jam3a.me/logo.png" alt="Jam3a Logo" class="logo">
    </div>
    <div class="content">
      <h1>Registration Confirmation</h1>
      <p>Hello {{name}},</p>
      <p>Thank you for registering with Jam3a! Your account has been successfully created.</p>
      
      <div class="account-info">
        <h3>Account Information</h3>
        <p>Username: {{accountDetails.username}}</p>
        <p>Email: {{accountDetails.email}}</p>
        <p>Registration Date: {{registrationDate}}</p>
      </div>
      
      <p>You can now log in to your account and start exploring Jam3a deals.</p>
      <p style="text-align: center;">
        <a href="https://jam3a.me/login" class="button">Log In Now</a>
      </p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Jam3a. All rights reserved.</p>
      <p>Jam3a.me | <a href="mailto:info@jam3a.me">info@jam3a.me</a></p>
    </div>
  </div>
</body>
</html>
  `,
  
  newsletter: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Newsletter Subscription Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 20px; }
    .logo { max-width: 150px; }
    .confirmation-box { background-color: #e8f5e9; border: 1px solid #4CAF50; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://jam3a.me/logo.png" alt="Jam3a Logo" class="logo">
    </div>
    <div class="content">
      <h1>Newsletter Subscription Confirmed</h1>
      <p>Hello {{name}},</p>
      
      <div class="confirmation-box">
        <h3>You're Subscribed!</h3>
        <p>You've successfully subscribed to the Jam3a newsletter with email: {{email}}</p>
      </div>
      
      <p>You'll now receive updates about:</p>
      <ul>
        <li>New deals and promotions</li>
        <li>Product launches</li>
        <li>Jam3a news and events</li>
      </ul>
      
      <p>Thank you for subscribing!</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Jam3a. All rights reserved.</p>
      <p>Jam3a.me | <a href="mailto:info@jam3a.me">info@jam3a.me</a></p>
      <p><small>To unsubscribe, click <a href="https://jam3a.me/unsubscribe?email={{email}}">here</a></small></p>
    </div>
  </div>
</body>
</html>
  `,
  
  custom: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Jam3a Message</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 20px; }
    .logo { max-width: 150px; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://jam3a.me/logo.png" alt="Jam3a Logo" class="logo">
    </div>
    <div class="content">
      {{{htmlContent}}}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Jam3a. All rights reserved.</p>
      <p>Jam3a.me | <a href="mailto:info@jam3a.me">info@jam3a.me</a></p>
    </div>
  </div>
</body>
</html>
  `
};

// Create template files
Object.entries(templates).forEach(([name, content]) => {
  const templatePath = path.join(templatesDir, `${name}.html`);
  fs.writeFileSync(templatePath, content);
  console.log(`Created template: ${name}.html`);
});

console.log('All email templates created successfully!');
