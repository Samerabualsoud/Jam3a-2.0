# Jam3a Backend API Documentation

## Overview

This document provides comprehensive documentation for the Jam3a backend API, which powers the Jam3a group buying platform. The API enables users to create and join group purchases, manage products, process payments via Moyasser, and manage website content.

## Architecture

The Jam3a backend is built with the following technologies:

- **Node.js & Express**: Core server framework
- **MongoDB**: Database for storing all application data
- **JWT**: Authentication mechanism
- **Moyasser**: Payment gateway integration
- **Docker**: Containerization for deployment

The architecture follows a modular design with the following components:

- **Models**: Database schemas and business logic
- **Controllers**: Request handling and response formatting
- **Routes**: API endpoint definitions
- **Middleware**: Authentication, validation, and error handling
- **Services**: External integrations and utilities

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Authenticate user & get token | Public |
| GET | `/api/auth/me` | Get current user profile | Private |
| PUT | `/api/auth/me` | Update user profile | Private |
| POST | `/api/auth/password/reset` | Request password reset | Public |
| POST | `/api/auth/password/change` | Change password | Private |

### Products

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products with filtering | Public |
| GET | `/api/products/featured` | Get featured products | Public |
| GET | `/api/products/:id` | Get product by ID | Public |
| POST | `/api/products` | Create a new product | Admin |
| PUT | `/api/products/:id` | Update a product | Admin |
| DELETE | `/api/products/:id` | Delete a product | Admin |
| POST | `/api/products/bulk` | Bulk operations on products | Admin |

### Groups

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/groups` | Get all groups with filtering | Public |
| GET | `/api/groups/:id` | Get group by ID | Public |
| POST | `/api/groups` | Create a new group | Private |
| POST | `/api/groups/:id/join` | Join a group | Private |
| GET | `/api/groups/user/:userId` | Get groups for a user | Private |

### Orders

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/orders` | Get all orders | Admin |
| GET | `/api/orders/:id` | Get order by ID | Private |
| POST | `/api/orders` | Create a new order | Private |
| PUT | `/api/orders/:id` | Update order status | Admin |

### Payments

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/payments/:id` | Get payment details | Private |
| POST | `/api/payments/:id/verify` | Verify payment status | Private |
| POST | `/api/payments/:id/refund` | Process refund | Admin |

### Moyasser Integration

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/moyasser/create-payment` | Create a new payment | Private |
| POST | `/api/moyasser/callback` | Handle payment callback | Public |
| GET | `/api/moyasser/verify/:paymentId` | Verify payment status | Private |
| POST | `/api/moyasser/refund/:paymentId` | Process refund | Admin |
| GET | `/api/moyasser/client-form/:orderId` | Generate payment form data | Private |

### Content Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/content` | Get all content with filtering | Public |
| GET | `/api/content/:id` | Get content by ID | Public |
| GET | `/api/content/key/:key` | Get content by key | Public |
| POST | `/api/content` | Create new content | Admin |
| PUT | `/api/content/:id` | Update content | Admin |
| DELETE | `/api/content/:id` | Delete content | Admin |
| POST | `/api/content/:id/publish` | Publish content | Admin |
| POST | `/api/content/:id/unpublish` | Unpublish content | Admin |

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. Obtain a token by registering or logging in
2. Include the token in the `x-auth-token` header for all protected requests

Example:
```
GET /api/auth/me
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Request & Response Formats

### Request Format

- For POST and PUT requests, send data in JSON format
- Set `Content-Type: application/json` header
- For protected routes, include `x-auth-token` header with JWT token

### Response Format

All responses are in JSON format with the following structure:

- Success responses: The requested data or a success message
- Error responses: An object with a `msg` property describing the error

## Moyasser Payment Integration

The API integrates with Moyasser payment gateway for processing payments. The integration flow is:

1. Create an order via `/api/orders`
2. Create a payment via `/api/moyasser/create-payment`
3. Redirect the user to the Moyasser payment URL
4. Moyasser will call back to `/api/moyasser/callback` after payment
5. Verify payment status via `/api/moyasser/verify/:paymentId`

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 400: Bad request (validation errors, etc.)
- 401: Unauthorized (missing or invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not found
- 500: Server error

Error responses include a descriptive message:

```json
{
  "msg": "Invalid credentials"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- 100 requests per minute for public endpoints
- 300 requests per minute for authenticated users

## Data Models

### User
- `_id`: MongoDB ObjectId
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `roles`: Array of Strings (default: ['user'])
- `isAdmin`: Boolean (default: false)
- `isSeller`: Boolean (default: false)
- `profile`: Object (phone, address, city, country, avatar)
- `resetPasswordToken`: String
- `resetPasswordExpires`: Date
- `createdAt`: Date
- `updatedAt`: Date

### Product
- `_id`: MongoDB ObjectId
- `name`: String (required)
- `nameAr`: String
- `category`: String (required)
- `price`: Number (required)
- `originalPrice`: Number
- `stock`: Number (required)
- `description`: String
- `descriptionAr`: String
- `image`: String
- `images`: Array of Strings
- `currentAmount`: Number
- `targetAmount`: Number
- `participants`: Number
- `featured`: Boolean
- `discount`: Number
- `averageJoinRate`: Number
- `supplier`: String
- `sku`: String
- `status`: String (enum: ['active', 'inactive', 'draft'])
- `tags`: Array of Strings
- `createdAt`: Date
- `updatedAt`: Date

### Group
- `_id`: MongoDB ObjectId
- `productId`: MongoDB ObjectId (reference to Product)
- `name`: String (required)
- `targetParticipants`: Number (required)
- `currentParticipants`: Number
- `participants`: Array of Objects (userId, joinDate, amount)
- `status`: String (enum: ['open', 'complete', 'expired'])
- `expiresAt`: Date (required)
- `completedAt`: Date
- `createdAt`: Date
- `updatedAt`: Date

### Order
- `_id`: MongoDB ObjectId
- `userId`: MongoDB ObjectId (reference to User)
- `groupId`: MongoDB ObjectId (reference to Group)
- `products`: Array of Objects (productId, quantity, price, name)
- `totalAmount`: Number (required)
- `status`: String (enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'])
- `paymentId`: MongoDB ObjectId (reference to Payment)
- `paymentMethod`: String
- `shippingAddress`: Object (name, address, city, country, postalCode, phone)
- `notes`: String
- `createdAt`: Date
- `updatedAt`: Date

### Payment
- `_id`: MongoDB ObjectId
- `orderId`: MongoDB ObjectId (reference to Order)
- `userId`: MongoDB ObjectId (reference to User)
- `amount`: Number (required)
- `currency`: String (required)
- `method`: String (required)
- `status`: String (enum: ['pending', 'processing', 'completed', 'failed', 'refunded'])
- `moyasserPaymentId`: String
- `moyasserResponse`: Object
- `transactionFee`: Number
- `refundId`: String
- `completedAt`: Date
- `createdAt`: Date
- `updatedAt`: Date

### Content
- `_id`: MongoDB ObjectId
- `type`: String (enum: ['page', 'section', 'banner', 'faq', 'testimonial'])
- `key`: String (required, unique)
- `title`: String (required)
- `titleAr`: String
- `content`: String (required)
- `contentAr`: String
- `status`: String (enum: ['published', 'draft', 'archived'])
- `metadata`: Object (description, keywords, author, image)
- `position`: Number
- `parent`: MongoDB ObjectId (reference to Content)
- `publishedAt`: Date
- `createdAt`: Date
- `updatedAt`: Date

## Versioning

The current API version is v1. All endpoints are prefixed with `/api/`.

## Support

For API support, please contact the Jam3a development team at dev@jam3a.com.
