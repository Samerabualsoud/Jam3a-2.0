# Zapier Integration Guide for Jam3a

This guide explains how to properly set up Zapier integration with your Jam3a platform to automate email notifications and other workflows.

## Prerequisites

- A Zapier account
- Access to the Jam3a codebase
- Basic understanding of webhooks

## Setup Steps

### 1. Create Zaps in Zapier

For each type of notification, you'll need to create a separate Zap:

1. **Waitlist Registration**
   - Trigger: Webhook
   - Action: Send email, add to spreadsheet, or any other action you prefer

2. **User Registration**
   - Trigger: Webhook
   - Action: Send email, add to CRM, etc.

3. **Newsletter Subscription**
   - Trigger: Webhook
   - Action: Add to email marketing platform

4. **Order Confirmation**
   - Trigger: Webhook
   - Action: Send email, update inventory, etc.

5. **Group Completion**
   - Trigger: Webhook
   - Action: Send email, update order status, etc.

### 2. Get Webhook URLs

For each Zap you create:

1. Choose "Webhook" as the trigger
2. Select "Catch Hook"
3. Copy the webhook URL provided by Zapier
4. Note which notification type each URL is for

### 3. Update the Code

Open `/server/zapierService.js` and replace the placeholder webhook URLs with your actual Zapier webhook URLs:

```javascript
// Zapier webhook URLs for different actions
webhooks: {
  waitlist: 'YOUR_ACTUAL_WAITLIST_WEBHOOK_URL', 
  registration: 'YOUR_ACTUAL_REGISTRATION_WEBHOOK_URL', 
  newsletter: 'YOUR_ACTUAL_NEWSLETTER_WEBHOOK_URL', 
  orderConfirmation: 'YOUR_ACTUAL_ORDER_WEBHOOK_URL', 
  groupComplete: 'YOUR_ACTUAL_GROUP_WEBHOOK_URL' 
},
// Default webhook for general purpose use
defaultWebhook: 'YOUR_ACTUAL_DEFAULT_WEBHOOK_URL'
```

### 4. Deploy Key

The deploy key is already set up in the code:

```javascript
// Zapier deploy key for authentication
deployKey: 'e6bf28375f5f9d1ebec636ac2915fdc8',
```

This key is used in the headers when sending data to Zapier.

## Testing the Integration

To test if your Zapier integration is working:

1. Run your Jam3a application
2. Submit a form that triggers one of the notifications (e.g., join waitlist)
3. Check your Zapier account to see if the webhook was triggered
4. Verify that the action was performed (e.g., email sent)

## Troubleshooting

If your Zapier integration is not working:

1. **Check webhook URLs**: Ensure the URLs in the code match the ones provided by Zapier
2. **Verify deploy key**: Make sure the deploy key is correct
3. **Check server logs**: Look for any error messages when sending data to Zapier
4. **Test webhooks directly**: Use a tool like Postman to send test data to your webhook URLs

## Data Structure

Each notification type sends specific data to Zapier:

### Waitlist Registration
```javascript
{
  email: "user@example.com",
  name: "User Name",
  joinDate: "4/5/2025",
  position: 42,
  interests: [],
  source: "website",
  locale: "en"
}
```

### User Registration
```javascript
{
  email: "user@example.com",
  name: "User Name",
  username: "username",
  registrationDate: "4/5/2025",
  accountType: "customer",
  preferences: {},
  locale: "en"
}
```

Similar structures exist for newsletter subscriptions, order confirmations, and group completions.

## Support

If you need further assistance with your Zapier integration, please contact the Jam3a development team.
