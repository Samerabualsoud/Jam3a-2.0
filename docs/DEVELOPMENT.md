# Development Guide

This document provides information for developers working on the Jam3a Hub application.

## Project Structure

The Jam3a Hub application is organized as follows:

- `/client`: Frontend React application
  - `/src`: Source code
    - `/components`: UI components
    - `/pages`: Page components
    - `/hooks`: Custom React hooks
    - `/contexts`: React context providers
    - `/services`: API service functions
    - `/utils`: Utility functions
  - `/public`: Static assets

- `/server`: Backend Express API
  - `/routes`: API route handlers
  - `/models`: Database models
  - `/middleware`: Express middleware
  - `/services`: Business logic services
  - `/config`: Configuration files

- `/src`: Shared source code
  - `/components`: Shared UI components
  - `/utils`: Shared utility functions

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/jam3a-hub.git
   cd jam3a-hub
   ```

2. Install dependencies:
   ```
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

3. Set up environment variables:
   Create `.env` files in the root, client, and server directories with the necessary environment variables.

4. Start the development server:
   ```
   npm run dev
   ```

## Code Style and Conventions

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Use functional components with hooks for React
- Follow the container/presentational component pattern
- Use async/await for asynchronous operations

## Testing

- Write unit tests for utility functions and components
- Write integration tests for API endpoints
- Run tests with `npm test`

## Building for Production

To build the application for production:

```
npm run build
```

This will create a production build in the `dist` directory.

## Deployment

See the [Deployment Guide](../deployment/GUIDE.md) for detailed deployment instructions.
