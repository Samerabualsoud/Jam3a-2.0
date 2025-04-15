# Jam3a Hub

Jam3a Hub is a comprehensive e-commerce platform designed for selling electronic products, with a focus on mobile phones and accessories.

## Features

- User authentication and authorization
- Product browsing and searching
- Shopping cart and checkout functionality
- Admin panel for product and order management
- Payment gateway integration
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Deployment**: Docker, Digital Ocean

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express API
- `/src` - Shared source code
- `/public` - Static assets
- `/deployment` - Deployment configuration files

## Getting Started

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

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
