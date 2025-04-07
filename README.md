# Jam3a Hub Collective

## Project Overview

This repository contains the restructured version of the Jam3a-2.0 application, organized according to modern best practices for React/Node.js applications. The platform enables group buying and collective purchasing experiences.

## Project Structure

The project is now organized into two main directories:

- `client/` - Frontend React application
- `server/` - Backend Node.js/Express application

Additionally, there are dedicated directories for:

- `docs/` - Project documentation
- `config/` - Shared configuration
- `scripts/` - Utility scripts

## Features

- Group buying platform
- User authentication with role-based access control
- Product management
- Deal creation and management
- Email notifications
- Analytics integration
- Dynamic group deals with bilingual support (English/Arabic)
- Responsive design for mobile and desktop

## Technologies Used

- Vite
- TypeScript
- React
- React Router
- Tailwind CSS
- shadcn/ui components
- Node.js
- Express
- MongoDB

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```
git clone https://github.com/Samerabualsoud/Jam3a-2.0.git
cd Jam3a-2.0
```

2. Install dependencies for both client and server:
```
cd client && npm install
cd ../server && npm install
```

3. Create a `.env` file in the server directory with your configuration.

4. Start the development servers:

For the server:
```
cd server && npm run dev
```

For the client:
```
cd client && npm run dev
```

## Implementation Details

The project includes:

- Navigation system with proper routing
- Authentication context with persistent login
- Role-based access control
- Bilingual product listings
- Shop all deals functionality
- Email notification system
- Analytics integration

## Documentation

See the `docs/` directory for detailed documentation on:

- API endpoints
- Deployment guides
- Development guides

## Recent Updates

- Restructured repository according to best practices
- Fixed "Join this Jam3a" buttons with proper navigation handlers
- Enhanced authentication system with persistent login and role checking
- Updated routing configuration with protected routes
