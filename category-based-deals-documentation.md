# Category-Based Jam3a Deal System

## Overview

The Jam3a platform has been enhanced to support category-based group buying deals. This documentation outlines the implementation details, architecture, and usage guidelines for the new category-based deal system.

## Key Features

1. **Category-Based Deals**: Jam3a deals are now organized by product categories rather than individual products.
2. **Flexible Product Selection**: Users can select any product from the deal's category when joining a Jam3a deal.
3. **Category-Based Naming**: Deal titles are automatically generated based on the category name.
4. **Multilingual Support**: Full support for both English and Arabic throughout the system.

## Architecture

### Backend Components

1. **Models**:
   - `Category.js`: Defines the schema for product categories
   - `JamDeal.js`: Defines the schema for category-based Jam3a deals
   - `Product.js`: Enhanced to support category relationships

2. **Controllers**:
   - `CategoryController.js`: Handles API requests for category management
   - `JamDealController.js`: Handles API requests for Jam3a deal operations

3. **Routes**:
   - `categories.js`: Exposes RESTful endpoints for category operations
   - `deals.js`: Exposes RESTful endpoints for Jam3a deal operations

### Frontend Components

1. **Services**:
   - `CategoryService.ts`: Connects to category-related backend APIs
   - `DealService.ts`: Connects to Jam3a deal-related backend APIs

2. **UI Components**:
   - `CategorySelector.tsx`: Allows users to browse and select categories
   - `ProductSelector.tsx`: Allows users to select products within a category
   - `FeaturedDeals.tsx`: Displays category-based featured deals
   - `JoinJam3a.tsx`: Updated to support category-based product selection

## Database Schema

### Category Collection

```javascript
{
  _id: ObjectId,
  name: String,          // Category name in English
  nameAr: String,        // Category name in Arabic
  description: String,   // Category description in English
  descriptionAr: String, // Category description in Arabic
  image: String,         // URL to category image
  active: Boolean,       // Whether the category is active
  parentCategory: ObjectId, // Reference to parent category (for subcategories)
  createdAt: Date,
  updatedAt: Date
}
```

### JamDeal Collection

```javascript
{
  _id: ObjectId,
  category: ObjectId,    // Reference to the category
  title: String,         // Deal title based on category (English)
  titleAr: String,       // Deal title based on category (Arabic)
  description: String,   // Deal description (English)
  descriptionAr: String, // Deal description (Arabic)
  discount: Number,      // Discount percentage
  maxParticipants: Number, // Maximum number of participants
  currentParticipants: Number, // Current number of participants
  endDate: Date,         // Deal end date
  status: String,        // 'active', 'completed', or 'cancelled'
  featured: Boolean,     // Whether the deal is featured
  image: String,         // URL to deal image (usually category image)
  products: [            // Products included in this deal
    {
      product: ObjectId, // Reference to product
      selectedCount: Number // Number of participants who selected this product
    }
  ],
  minParticipants: Number, // Minimum required participants
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Category Endpoints

- `GET /api/categories`: Get all categories
- `GET /api/categories/:id`: Get category by ID
- `GET /api/categories/:id/products`: Get products by category ID
- `POST /api/categories`: Create new category (admin only)
- `PUT /api/categories/:id`: Update category (admin only)
- `DELETE /api/categories/:id`: Delete category (admin only)

### Jam3a Deal Endpoints

- `GET /api/deals`: Get all active Jam3a deals
- `GET /api/deals/featured`: Get featured Jam3a deals
- `GET /api/deals/:id`: Get Jam3a deal by ID
- `GET /api/deals/:id/products`: Get products available in a Jam3a deal
- `POST /api/deals`: Create new Jam3a deal (admin only)
- `PUT /api/deals/:id`: Update Jam3a deal (admin only)
- `DELETE /api/deals/:id`: Delete Jam3a deal (admin only)
- `POST /api/deals/:id/join`: Join a Jam3a deal with a specific product

## User Flow

1. **Browsing Deals**:
   - User visits the homepage and sees featured deals organized by category
   - Deal titles reflect the category, not individual products

2. **Joining a Deal**:
   - User selects a deal to join
   - User is presented with all products from that category
   - User selects their preferred product from the available options
   - User completes personal information and payment details
   - User confirms the purchase

3. **Deal Completion**:
   - When maximum participants is reached, the deal is automatically marked as completed
   - If minimum participants is not reached by end date, the deal is automatically cancelled

## Implementation Guidelines

### Creating a New Category-Based Deal (Admin)

1. Select a category for the deal
2. Set discount percentage and participant limits
3. Set end date for the deal
4. Optionally mark as featured
5. The system will automatically:
   - Generate a title based on the category name
   - Include all active products from that category

### Joining an Existing Deal (User)

1. Browse available deals by category
2. Select a deal to join
3. Choose any product from the deal's category
4. Complete personal information
5. Complete payment
6. Receive confirmation

## Testing

The implementation includes comprehensive tests for all components:

- Unit tests for ProductSelector component
- Unit tests for CategorySelector component
- Integration tests for the join deal flow
- API tests for category and deal endpoints

## Multilingual Support

The system fully supports both English and Arabic languages:

- Category names and descriptions in both languages
- Deal titles and descriptions in both languages
- UI components with language-specific content
- Right-to-left (RTL) layout support for Arabic

## Future Enhancements

1. **Subcategory Support**: Enhance the system to support nested subcategories
2. **Dynamic Discounts**: Implement tiered discounts based on participant count
3. **Product Recommendations**: Add AI-powered product recommendations within categories
4. **Category Analytics**: Provide insights on popular categories and conversion rates
