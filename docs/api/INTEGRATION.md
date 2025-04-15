# API Integration Guide

This document provides information about integrating with the Jam3a Hub API.

## Authentication

All API requests that require authentication should include a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Getting a JWT Token

1. Register or login using the authentication endpoints
2. Store the returned JWT token securely
3. Include the token in subsequent API requests

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

Error responses include a message field with details about the error:

```json
{
  "error": true,
  "message": "Detailed error message"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. If you exceed the rate limit, you'll receive a 429 Too Many Requests response.

## Pagination

List endpoints support pagination with the following query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

## Webhooks

The API supports webhooks for real-time notifications about events:

1. Register a webhook URL in your account settings
2. Configure the events you want to receive
3. Implement an endpoint to receive webhook payloads

Webhook payloads include an event type and relevant data:

```json
{
  "event": "order.created",
  "data": {
    "orderId": "123",
    "status": "pending",
    "createdAt": "2023-04-15T12:00:00Z"
  }
}
```
