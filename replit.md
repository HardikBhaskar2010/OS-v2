# Love OS - Couples App

## Overview

Love OS is a romantic relationship celebration web application for couples. It provides a private digital space where partners can share memories, write love letters, track moods, answer daily questions, and celebrate their relationship with countdown timers to anniversaries. The app features separate authentication for boyfriend and girlfriend roles with personalized dashboards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build**: React 18 with TypeScript, built using Vite. The app uses a component-based architecture with React Router for navigation.

**UI Framework**: Tailwind CSS with shadcn/ui component library. The design features a pink-themed romantic aesthetic with floating heart animations and gradient backgrounds.

**State Management**: 
- TanStack Query for server state management
- React Context (AuthContext) for authentication state
- Local component state for UI interactions

**Key Features**:
- Protected routes requiring authentication
- Role-based dashboards (boyfriend/girlfriend)
- Days counter and anniversary countdown
- Photo gallery with base64 image storage
- Love letters system
- Mood sharing between partners
- Daily relationship questions

**Directory Structure**:
- `src/pages/` - Page components (Index, Login, Register, Gallery, Letters, Mood, Questions)
- `src/components/` - Reusable UI components including shadcn/ui primitives
- `src/contexts/` - React contexts (AuthContext)
- `src/services/` - API service layers
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions including API helpers

### Backend Architecture

**Framework**: FastAPI (Python) with async support using Motor for MongoDB operations.

**Authentication**: JWT-based authentication with bcrypt password hashing. Tokens expire after 7 days.

**API Structure**: RESTful API with `/api` prefix. Routers organized by feature:
- `/api/auth` - Registration, login, partner linking
- `/api/photos` - Photo upload/retrieval (base64 encoded)
- `/api/letters` - Love letters CRUD
- `/api/moods` - Mood sharing between partners
- `/api/questions` - Daily questions and answers
- `/api/notifications` - Anniversary reminders

**Data Models** (Pydantic):
- User (with role: boyfriend/girlfriend, partner linking)
- Photo (base64 image, caption, date)
- Letter (title, content, sender/receiver)
- Mood (emoji, note, user reference)
- Question/Answer (daily question system)
- Notification (anniversary alerts)

**Middleware**: JWT verification middleware for protected endpoints.

### Data Storage

**Database**: MongoDB accessed via Motor (async driver). Collections:
- `users` - User accounts with partner relationships
- `photos` - Photos stored as base64 strings
- `letters` - Love letters between partners
- `moods` - Mood entries
- `questions` - Daily questions
- `notifications` - Anniversary notifications

**Design Decision**: Photos are stored as base64 in MongoDB rather than file storage for simplicity in this personal-use application.

## External Dependencies

### Frontend Dependencies
- React 18 with React Router DOM
- TanStack Query for data fetching
- Framer Motion for animations
- date-fns for date manipulation
- Radix UI primitives (via shadcn/ui)
- Lucide React for icons

### Backend Dependencies
- FastAPI with Uvicorn server
- Motor (async MongoDB driver)
- PyMongo
- python-jose for JWT handling
- passlib with bcrypt for password hashing
- Pydantic for data validation

### Infrastructure
- MongoDB database (connection via MONGO_URL environment variable)
- Vite dev server proxies `/api` requests to backend on port 8000
- Frontend runs on port 5000