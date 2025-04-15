# Jam3a-2.0 Restructured Client

This is the client component of the Jam3a-2.0 application, restructured according to best practices.

## Directory Structure

- `public/` - Static assets
- `src/` - Source code
  - `assets/` - Images, fonts, etc.
  - `components/` - React components
    - `common/` - Reusable components
    - `layout/` - Layout components (Header, Footer)
    - `features/` - Feature-specific components
    - `admin/` - Admin panel components
  - `contexts/` - React contexts
  - `hooks/` - Custom React hooks
  - `pages/` - Page components
  - `services/` - API services
  - `utils/` - Utility functions
  - `types/` - TypeScript type definitions

## Setup

1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm run dev
```

## Building for Production

```
npm run build
```

## Preview Production Build

```
npm run preview
```
