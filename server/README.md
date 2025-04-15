# Jam3a-2.0 Restructured Server

This is the server component of the Jam3a-2.0 application, restructured according to best practices.

## Directory Structure

- `config/` - Configuration files including database connection
- `controllers/` - Request handlers for API endpoints
- `middleware/` - Express middleware
- `models/` - MongoDB data models
- `routes/` - API routes
- `services/` - Business logic services
- `templates/` - Email templates
- `utils/` - Utility functions

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jam3a
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password
EMAIL_FROM=Jam3a <noreply@jam3a.me>
```

3. Start the server:
```
npm start
```

## Development

For development with auto-restart:
```
npm run dev
```

## Testing

Run tests:
```
npm test
```
