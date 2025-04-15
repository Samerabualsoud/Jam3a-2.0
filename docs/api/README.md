# API Documentation

This document provides information about the Jam3a Hub API endpoints.

## Authentication

### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object with JWT token

### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object with JWT token

## Products

### Get All Products
- **URL**: `/api/products`
- **Method**: `GET`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `category`: Filter by category
  - `search`: Search term
- **Response**: Array of product objects with pagination info

### Get Product by ID
- **URL**: `/api/products/:id`
- **Method**: `GET`
- **Response**: Product object

### Create Product (Admin only)
- **URL**: `/api/products`
- **Method**: `POST`
- **Headers**: Authorization token
- **Body**: Product object
- **Response**: Created product object

### Update Product (Admin only)
- **URL**: `/api/products/:id`
- **Method**: `PUT`
- **Headers**: Authorization token
- **Body**: Updated product fields
- **Response**: Updated product object

### Delete Product (Admin only)
- **URL**: `/api/products/:id`
- **Method**: `DELETE`
- **Headers**: Authorization token
- **Response**: Success message

## Orders

### Create Order
- **URL**: `/api/orders`
- **Method**: `POST`
- **Headers**: Authorization token
- **Body**: Order details
- **Response**: Created order object

### Get User Orders
- **URL**: `/api/orders/user`
- **Method**: `GET`
- **Headers**: Authorization token
- **Response**: Array of user's orders

### Get Order by ID
- **URL**: `/api/orders/:id`
- **Method**: `GET`
- **Headers**: Authorization token
- **Response**: Order object

### Update Order Status (Admin only)
- **URL**: `/api/orders/:id/status`
- **Method**: `PUT`
- **Headers**: Authorization token
- **Body**: 
  ```json
  {
    "status": "shipped"
  }
  ```
- **Response**: Updated order object

## Users

### Get User Profile
- **URL**: `/api/users/profile`
- **Method**: `GET`
- **Headers**: Authorization token
- **Response**: User object

### Update User Profile
- **URL**: `/api/users/profile`
- **Method**: `PUT`
- **Headers**: Authorization token
- **Body**: Updated user fields
- **Response**: Updated user object

### Get All Users (Admin only)
- **URL**: `/api/users`
- **Method**: `GET`
- **Headers**: Authorization token
- **Response**: Array of user objects

## Error Responses

All endpoints return appropriate HTTP status codes:
- `200 OK`: Request succeeded
- `201 Created`: Resource created
- `400 Bad Request`: Invalid request
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error
