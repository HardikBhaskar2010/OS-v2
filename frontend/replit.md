# Love OS

## Overview
A romantic relationship celebration web application called "Love OS" built with React, TypeScript, and Vite. Features a beautiful pink-themed design celebrating a couple's relationship with countdown timers, memory galleries, and love notes.

## Project Structure
- `src/` - Frontend source code (React + TypeScript)
  - `components/` - Reusable UI components
  - `pages/` - Page components
  - `hooks/` - Custom React hooks
  - `lib/` - Utility functions
  - `assets/` - Static assets
- `public/` - Public static files
- `index.html` - Entry HTML file

## Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: TanStack Query
- **Animations**: Framer Motion

## Development
Run the development server:
```bash
npm run dev
```
The app runs on port 5000.

## Build
```bash
npm run build
```
Output goes to `dist/` directory.

## Deployment
This is a static frontend application. The deployment is configured for static hosting with the `dist` folder as the public directory.
