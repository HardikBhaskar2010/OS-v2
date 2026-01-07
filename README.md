# 💕 Love OS - Cookie & Senorita's Personal Love Space

<div align="center">

![Love OS Banner](https://img.shields.io/badge/Love%20OS-v2.0-ff69b4?style=for-the-badge&logo=heart&logoColor=white)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/License-Personal-blue?style=for-the-badge)

**A beautiful, personalized relationship app built with love for Cookie 🍪 and Senorita 💃**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Setup](#-setup) • [Current Issues](#-current-issues) • [Roadmap](#-roadmap)

</div>

---

## 📖 About

**Love OS** is a personalized digital sanctuary for couples to share their love, memories, and daily moments. No login required - just two dedicated spaces for Cookie and Senorita to express their feelings, share moods, write love letters, and create beautiful memories together.

### ✨ The Concept

Instead of a traditional authentication system, Love OS features two dedicated spaces:
- 🍪 **Cookie's Space** - A command center with blue/primary theme for the boyfriend
- 💃 **Senorita's Space** - A sanctuary with pink/rose theme for the girlfriend

Both spaces are synced in real-time via Supabase, so when one person posts, the other gets instant notifications!

---

## 🎯 Features

### 🏠 **Dual Dashboard System**
- **Cookie's Command Center**: Personalized boyfriend dashboard with blue theme
- **Senorita's Sanctuary**: Personalized girlfriend dashboard with pink theme
- Beautiful animated landing page with space selection cards
- Logout functionality to switch between spaces

### 💌 **Love Letters**
- Write heartfelt letters to each other
- Beautiful card-based letter display
- Full-screen letter reading experience
- Real-time notifications when partner sends a letter

### 💖 **Mood Sharing**
- Share your current mood with emojis
- Add notes and photos to mood updates
- React to partner's moods with emoji reactions
- View mood history timeline

### 📸 **Photo Gallery**
- Upload and share couple photos
- Add captions to memories
- Grid-based gallery view
- Cloud storage via Supabase

### ❓ **Daily Questions**
- Answer romantic daily questions
- See your partner's answers
- Strengthen connection through shared responses
- Pre-loaded with 50+ thoughtful questions

### 🎨 **Theme Customization**
- Multiple color themes (Pink, Purple, Blue, Green, Orange, Red)
- Light/Dark/System appearance modes
- Personalized settings for each space

### ⚡ **Real-time Sync**
- Instant updates across both spaces
- Push notifications for new content
- Live mood updates
- Powered by Supabase Realtime

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Vite** - Build Tool
- **React Router** - Navigation
- **Tanstack Query** - Data Fetching

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Real-time Subscriptions
  - Storage for Photos
  - Row Level Security (Open Policies)

### Infrastructure
- **FastAPI** - Python Backend (Optional)
- **MongoDB** - Additional Data Storage (Optional)
- **Nginx** - Reverse Proxy
- **Supervisor** - Process Management

---

## 🚀 Setup

### Prerequisites
- Node.js 18+ and Yarn
- Supabase Account
- Access to the repository

### 1. Clone the Repository
```bash
cd /app
```

### 2. Frontend Setup
```bash
cd frontend
yarn install
```

### 3. Environment Variables
Create `.env` file in `/app/frontend/`:
```env
VITE_SUPABASE_URL=https://wurbydnkogvqhvtzttlp.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Database Setup
Run the migration script in your Supabase SQL Editor:
```sql
-- Copy and paste contents of /app/migration-to-simplified-schema.sql
```

This will:
- ✅ Convert existing tables to simplified structure
- ✅ Remove authentication requirements
- ✅ Set up Cookie & Senorita user system
- ✅ Enable real-time subscriptions

### 5. Start Development Server
```bash
# Frontend
sudo supervisorctl restart frontend

# Backend (if needed)
sudo supervisorctl restart backend

# Check status
sudo supervisorctl status
```

### 6. Access the App
- **Landing Page**: `http://localhost:3000/`
- **Cookie's Space**: `http://localhost:3000/cookie`
- **Senorita's Space**: `http://localhost:3000/senorita`

---

## ⚠️ Current Issues

### 🔴 **Critical Issue: Dashboard Routes Not Working**

**Problem:**
When clicking on "Cookie's Space" or "Senorita's Space" cards, the dashboards (`/cookie` and `/senorita` routes) are not loading properly.

**Symptoms:**
- ❌ Blank page or loading error on `/cookie` route
- ❌ Blank page or loading error on `/senorita` route
- ✅ Landing page (`/`) works fine
- ✅ Space selection cards are clickable

**Possible Causes:**
1. **Missing Dependencies**: Some pages still reference old `useAuth` context
2. **Component Errors**: Dashboard components may have compilation errors
3. **Route Configuration**: Potential routing issues in App.tsx
4. **Context Providers**: Missing or incorrectly ordered context providers

**What Works:**
- ✅ Space Selection landing page
- ✅ SpaceContext for managing selected space
- ✅ Frontend build and hot reload
- ✅ Database migration completed
- ✅ Supabase connection configured

**What Needs Fixing:**
- 🔧 Update MoodEnhanced.tsx to use SpaceContext
- 🔧 Update Gallery.tsx to use SpaceContext
- 🔧 Update Questions.tsx to use SpaceContext
- 🔧 Update Settings.tsx to use SpaceContext
- 🔧 Fix any component import errors
- 🔧 Test all routes thoroughly

**Next Steps:**
1. Update remaining pages to remove AuthContext dependencies
2. Replace all `useAuth()` with `useSpace()`
3. Update user ID references to use 'Cookie' or 'Senorita'
4. Test navigation flow from landing → dashboard → features

---

## 📁 Project Structure

```
/app/
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Shadcn UI components
│   │   │   ├── FloatingHearts.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── DaysCounter.tsx
│   │   │   └── ...
│   │   ├── contexts/          # React Context providers
│   │   │   ├── SpaceContext.tsx      # NEW: Space management
│   │   │   ├── CoupleContext.tsx     # Couple data
│   │   │   ├── ThemeContext.tsx      # Theme settings
│   │   │   └── AuthContext.tsx       # DEPRECATED
│   │   ├── pages/             # Route pages
│   │   │   ├── SpaceSelection.tsx    # Landing page
│   │   │   ├── CookieDashboard.tsx   # Cookie's dashboard
│   │   │   ├── SenoritaDashboard.tsx # Senorita's dashboard
│   │   │   ├── Letters.tsx           # ✅ Updated
│   │   │   ├── MoodEnhanced.tsx      # ⚠️ Needs update
│   │   │   ├── Gallery.tsx           # ⚠️ Needs update
│   │   │   ├── Questions.tsx         # ⚠️ Needs update
│   │   │   └── Settings.tsx          # ⚠️ Needs update
│   │   ├── lib/               # Utilities
│   │   │   └── supabase.ts    # Supabase client
│   │   └── App.tsx            # Main app with routes
│   ├── .env                   # Environment variables
│   └── package.json
├── backend/                   # FastAPI backend (optional)
├── migration-to-simplified-schema.sql  # ✅ Database migration
├── simplified-supabase-schema.sql      # Fresh install schema
└── README.md                  # This file
```

---

## 🗃️ Database Schema

### Simplified Tables (No Authentication)

**letters**
```sql
- id (UUID)
- title (TEXT)
- content (TEXT)
- from_user (TEXT)  # 'Cookie' or 'Senorita'
- to_user (TEXT)    # 'Cookie' or 'Senorita'
- created_at (TIMESTAMP)
```

**moods**
```sql
- id (UUID)
- user_name (TEXT)  # 'Cookie' or 'Senorita'
- mood_emoji (TEXT)
- mood_label (TEXT)
- mood_color (TEXT)
- note (TEXT)
- photo_url (TEXT)
- created_at (TIMESTAMP)
```

**photos**
```sql
- id (UUID)
- image_url (TEXT)
- caption (TEXT)
- uploaded_by (TEXT)  # 'Cookie' or 'Senorita'
- created_at (TIMESTAMP)
```

**questions** & **answers**
```sql
questions:
  - id, question_text, category, date, created_at

answers:
  - id, question_id, user_name, answer_text, created_at
```

---

## 🎨 Design System

### Color Themes
- **Primary (Pink)**: `#ec4899`
- **Purple**: `#8b5cf6`
- **Blue**: `#3b82f6`
- **Green**: `#22c55e`
- **Orange**: `#f97316`
- **Red**: `#ef4444`

### Cookie's Space Theme
- Primary Color: Blue (`#3b82f6`)
- Icon: 🍪 Cookie
- Style: Command Center, Guardian, Masculine

### Senorita's Space Theme
- Primary Color: Pink (`#ec4899`)
- Icon: 💃 Sparkles
- Style: Sanctuary, Princess, Feminine

---

## 🗺️ Roadmap

### Phase 1: Core Functionality (Current)
- [x] Space selection landing page
- [x] Dual dashboard system
- [x] Love letters feature
- [ ] Fix dashboard routing issues
- [ ] Update all pages to new system

### Phase 2: Enhanced Features
- [ ] Mood sharing with photos
- [ ] Photo gallery with upload
- [ ] Daily questions system
- [ ] Real-time notifications
- [ ] Settings customization

### Phase 3: Polish & Extras
- [ ] Mobile responsiveness
- [ ] Push notifications
- [ ] Export memories feature
- [ ] Anniversary countdown
- [ ] Relationship milestones

---

## 🤝 Contributing

This is a personal project for Cookie and Senorita. If you want to build something similar for your relationship, feel free to fork and customize!

---

## 📝 License

**Personal Use Only** - This project is built exclusively for Cookie 🍪 and Senorita 💃

---

## 💝 Made With Love

<div align="center">

**Built with ❤️ for Cookie & Senorita**

*Because every love story deserves its own OS*

---

### Quick Links
[Report Bug](mailto:your-email@example.com) • [Request Feature](mailto:your-email@example.com) • [View Demo](#)

</div>
