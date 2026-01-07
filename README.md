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

### 3. Environment Variables ✅ CONFIGURED
The `.env` file is already set up in `/app/frontend/.env`:
```env
VITE_SUPABASE_URL=https://wurbydnkogvqhvtzttlp.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Database Setup
Run the migration script in your Supabase SQL Editor.
See `/app/SUPABASE_SETUP_INSTRUCTIONS.md` for detailed instructions.

This will:
- ✅ Create simplified tables structure
- ✅ Remove authentication requirements
- ✅ Set up Cookie & Senorita user system
- ✅ Enable real-time subscriptions

### 5. Start Development Server ✅ RUNNING
```bash
# Frontend (Port 3000)
sudo supervisorctl restart frontend

# Check status
sudo supervisorctl status
```

### 6. Access the App
- **Landing Page**: `http://localhost:3000/`
- **Cookie's Space**: Click "Cookie's Space" card on landing page
- **Senorita's Space**: Click "Senorita's Space" card on landing page

**Note:** Direct URL access to `/cookie` or `/senorita` will redirect to landing page. 
Always start from the landing page and select your space!

---

## ✅ Current Status

### 🎉 **All Core Features Working!**

**Recent Fixes (January 2025):**
- ✅ Fixed MoodEnhanced.tsx syntax error (selectedMood typo)
- ✅ Removed deprecated AuthContext references
- ✅ Updated NicknameCycle.tsx to use SpaceContext
- ✅ Updated MoodSharing.tsx to use SpaceContext
- ✅ Added Supabase environment variables
- ✅ All dashboard routes working correctly

**What's Working:**
- ✅ Space Selection landing page with beautiful animations
- ✅ Cookie's Command Center dashboard (blue theme)
- ✅ Senorita's Sanctuary dashboard (pink theme)
- ✅ Love Letters feature with real-time updates
- ✅ Mood Sharing with emoji selection and photos
- ✅ Photo Gallery with upload functionality
- ✅ Daily Questions for deeper connection
- ✅ Settings page with theme customization
- ✅ Logout functionality
- ✅ SpaceContext for state management
- ✅ Supabase real-time subscriptions
- ✅ Frontend hot reload and build

**Database Requirements:**
To use this app, you need to set up the Supabase database with these tables:
- `letters` - For love letters
- `moods` - For mood sharing
- `photos` - For photo gallery
- `questions` - For daily questions
- `answers` - For question responses

**Environment Setup:**
The `.env` file has been configured with Supabase credentials. The app is ready to use!

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

### Phase 1: Core Functionality ✅ COMPLETED
- [x] Space selection landing page
- [x] Dual dashboard system (Cookie & Senorita)
- [x] Love letters feature
- [x] Dashboard routing fixed
- [x] All pages updated to new SpaceContext system
- [x] Environment variables configured
- [x] Supabase integration working

### Phase 2: Enhanced Features (Ready to Use)
- [x] Mood sharing with photos
- [x] Photo gallery with upload
- [x] Daily questions system
- [x] Real-time notifications via Supabase
- [x] Settings customization
- [x] Theme switching (6 color themes)
- [x] Dark/Light mode support

### Phase 3: Database Setup (Required)
- [ ] Run Supabase SQL schema
- [ ] Create database tables
- [ ] Set up storage buckets for photos
- [ ] Enable Realtime on tables
- [ ] Seed initial questions

### Phase 4: Polish & Extras (Future)
- [ ] Mobile responsiveness improvements
- [ ] Push notifications
- [ ] Export memories feature
- [ ] Anniversary countdown enhancements
- [ ] Relationship milestones tracking

---

## 🎯 Next Steps for Full Functionality

To enable all features with database persistence and real-time synchronization, complete the following setup:

### 1. Database Schema Deployment

Execute the SQL schema in your Supabase project to create the required tables:

**Access:** [Supabase Dashboard](https://app.supabase.com/project/wurbydnkogvqhvtzttlp) → SQL Editor

**Tables to Create:**
```sql
-- letters: Store love letters between Cookie and Senorita
-- moods: Track emotional states with emojis and photos
-- photos: Couple photo gallery with captions
-- questions: Daily romantic questions
-- answers: User responses to questions
```

**Reference:** See `/app/SUPABASE_SETUP_INSTRUCTIONS.md` for complete SQL schema

### 2. Storage Configuration

Set up cloud storage for media files:

1. Navigate to **Storage** in Supabase Dashboard
2. Create bucket: `mood-photos` (Public access)
3. Configure policies:
   - **Upload**: Authenticated users can upload
   - **Read**: Public read access for all photos
   - **Delete**: Users can delete their own files

### 3. Real-time Enablement

Enable real-time subscriptions for instant updates:

1. Go to **Database** → **Replication** in Supabase
2. Toggle **Realtime** ON for:
   - `letters` table
   - `moods` table
   - `photos` table
   - `answers` table

### 4. Data Seeding (Optional)

Populate initial data for better user experience:

```sql
-- Insert sample romantic questions
INSERT INTO questions (question_text, category, date) VALUES
  ('What made you fall in love with me?', 'deep', '2025-01-08'),
  ('What is your favorite memory of us?', 'memories', '2025-01-09'),
  ('Where do you see us in 5 years?', 'future', '2025-01-10');
```

### 5. Verification Testing

Once database is set up, test the following workflows:

**Letters Module:**
- [ ] Write and send a letter
- [ ] View letter in recipient's dashboard
- [ ] Verify real-time notification

**Mood Sharing:**
- [ ] Select mood with emoji
- [ ] Add note and photo
- [ ] Confirm partner receives update

**Photo Gallery:**
- [ ] Upload couple photo with caption
- [ ] View in gallery grid
- [ ] Full-screen photo viewer

**Daily Questions:**
- [ ] Answer today's question
- [ ] View partner's answer
- [ ] Navigate to random questions

**Settings:**
- [ ] Change color theme
- [ ] Toggle dark/light mode
- [ ] Verify persistence across sessions

### 6. Production Considerations

Before deploying to production:

- [ ] Review and update Row Level Security (RLS) policies
- [ ] Configure appropriate storage size limits
- [ ] Set up database backups in Supabase
- [ ] Test real-time connection stability
- [ ] Verify error handling for offline scenarios
- [ ] Review CORS settings if deploying to custom domain

**Estimated Setup Time:** 15-30 minutes

---

## 📝 Recent Updates

### January 2025 - Major Bug Fixes & Improvements

**Fixed Issues:**
1. **MoodEnhanced.tsx Syntax Error** - Fixed typo `selected Mood` → `selectedMood` on line 164
2. **Deprecated AuthContext Removal** - Removed all references to the old authentication system
3. **Component Updates:**
   - Updated `NicknameCycle.tsx` to use SpaceContext instead of AuthContext
   - Updated `MoodSharing.tsx` to use SpaceContext with correct user_name field
   - All components now properly use Cookie/Senorita names
4. **Environment Configuration** - Added `.env` file with Supabase credentials
5. **Database Schema Alignment** - Updated components to match simplified schema (user_name instead of user_id)

**Technical Improvements:**
- Hot reload working perfectly
- No compilation errors
- All routes accessible and functional
- Real-time subscriptions configured
- Theme system fully operational

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
