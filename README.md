# Jam3a-2.0 Restructured

This repository contains the restructured version of the Jam3a-2.0 application, organized according to modern best practices for React/Node.js applications.

## Project Structure

The project is now organized into two main directories:

- `client/` - Frontend React application
- `server/` - Backend Node.js/Express application

Additionally, there are dedicated directories for:

- `docs/` - Project documentation
- `config/` - Shared configuration
- `scripts/` - Utility scripts

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

## Features

- Group buying platform
- User authentication
- Product management
- Deal creation and management
- Email notifications
- Analytics integration

## Documentation

See the `docs/` directory for detailed documentation on:

- API endpoints
- Deployment guides
- Development guides
