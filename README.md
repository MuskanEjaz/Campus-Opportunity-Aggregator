# 🎓 Campus Opportunity Aggregator

A full-stack web application that centralizes internships, scholarships, hackathons, research positions, exchange programs, workshops, and competitions for NUST students — all in one searchable, filterable, and personalized platform.

> **Course:** Web Technologies · **Department:** SEECS · **Section:** BSCS-14B  
> **Instructor:** Dr. Farzana Jabeen  
> **Team:** Juwairiya Haroon (505494) · Muskan Ejaz (522695) · Zainab Hashmi (501868)

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Known Limitations](#known-limitations)

---

## Overview

University students at NUST face a fragmented landscape when searching for opportunities — notices scattered across department boards, WhatsApp groups, faculty emails, and LinkedIn. Deadlines slip by, and nothing is personalized.

The Campus Opportunity Aggregator fixes this with:
- A curated, searchable database of 100+ opportunities
- Real-time notifications whenever new opportunities are posted
- Bookmark management with instant sync across the UI
- An admin dashboard for posting, managing, and analyzing opportunities
- A personalized recommendation engine based on each user's saving history

---

## Features

### 👩‍🎓 Student Features
| Feature | Description |
|---|---|
| **Opportunity Discovery** | Browse and search active listings; filter by category, department, mode, and stipend |
| **Deadline Badges** | Color-coded urgency: 🔴 < 3 days · 🟡 < 1 week · 🟢 > 1 week |
| **Bookmarks** | Save/unsave with one click; synced globally via `SavedContext`; duplicate saves blocked by unique index |
| **Notifications** | Auto-notified when an admin posts a new opportunity; bell icon shows unread count; mark as read/unread |
| **Opportunity Detail** | Full description, eligibility, skills, location, stipend, and apply link; background view count tracked atomically |
| **Responsive Design** | Tailwind CSS grid adapts from 1 column (mobile) to 3 columns (desktop); hamburger nav on small screens |

### 🛠️ Admin Features
| Feature | Description |
|---|---|
| **Dashboard Stats** | Live counts of active/expired opportunities, registered students, and total saves |
| **Post Opportunity** | Full form with tags, skills, eligibility, and application link; triggers fan-out notification to all students |
| **Manage Listings** | View all opportunities (active and expired); delete with confirmation; cascade-deletes bookmarks and notifications |
| **Expiring Soon** | Highlights opportunities closing within 3 days |
| **Recommendations** | Personalized suggestions per user based on bookmarking history, scored by `(views × 0.4) + (saves × 0.6)` |

### 🏠 Landing Page
- Auto-cycling hero carousel (6 slides, 4.5 s interval)
- Animated live stats counters (zero → target over 2 s via `requestAnimationFrame`)
- Category cards with hover effects that deep-link to filtered listings
- No API calls — fully public and fast

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.2.0 | Component-based UI framework |
| React Router DOM | 6.20.0 | Client-side routing |
| Axios | 1.15.2 | HTTP client for API requests |
| Tailwind CSS | 3.3.0 | Utility-first styling |
| React Scripts | 5.0.1 | CRA build toolchain |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | LTS | JavaScript runtime |
| Express | 5.2.1 | Web framework and router |
| Mongoose | latest | MongoDB ODM and schema modelling |
| bcrypt | 6.0.0 | Password hashing (10 salt rounds) |
| jsonwebtoken | 9.0.3 | Stateless JWT authentication (7-day expiry) |
| Nodemailer | 8.0.7 | Welcome emails via Gmail SMTP |
| cors | 2.8.6 | Cross-Origin Resource Sharing |
| dotenv | 17.4.2 | Environment variable management |
| nodemon | 3.1.14 | Dev auto-reload |

### Infrastructure
| Technology | Purpose |
|---|---|
| MongoDB Atlas | Hosted NoSQL database |
| Render | Cloud deployment (frontend + backend) |

---

## Project Structure

```
campus-opportunity-aggregator/
├── frontend/
│   ├── public/
│   └── src/
│       ├── context/
│       │   ├── AuthContext.jsx       # Global auth state + localStorage
│       │   └── SavedContext.jsx      # Global bookmark Set (O(1) lookups)
│       ├── components/
│       │   ├── NotificationBell.jsx  # Polls /api/notifications every 30s
│       │   ├── OpportunityCard.jsx   # Reusable card with bookmark toggle
│       │   ├── FilterBar.jsx         # Search + 4 dropdown filters
│       │   └── Navbar.jsx
│       └── pages/
│           ├── Landing.jsx           # Public hero + stats + category cards
│           ├── Register.jsx          # Real-time validation + password strength
│           ├── Login.jsx             # Student/Admin toggle → role-based redirect
│           ├── Opportunities.jsx     # Server-side filtered listings
│           ├── OpportunityDetail.jsx # Full detail + view tracking + apply modal
│           ├── Saved.jsx             # Protected; uses .populate() data
│           └── Admin.jsx             # Protected (role_id === 1); tabbed dashboard
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Opportunity.js            # pre('save') hook for auto-expiry
│   │   ├── SavedOpportunity.js       # Unique index: { user_id, opp_id }
│   │   └── Notification.js           # Compound index: { user_id, created_at }
│   ├── routes/
│   │   ├── auth.js                   # Register + Login
│   │   ├── search.js                 # Browse, filter, detail, view tracking
│   │   ├── bookmarks.js              # Save/unsave + notifications endpoint
│   │   └── admin.js                  # Stats, CRUD, fan-out, recommendations
│   ├── middleware/
│   │   └── auth.js                   # JWT verification → req.user
│   ├── utils/
│   │   └── email.js                  # Nodemailer SMTP helper
│   └── server.js
│
├── database/
│   └── seed.mongo.js                 # Static seed data
│
└── render.yaml                       # Render deployment config
```

---

## Getting Started

### Prerequisites
- Node.js (LTS)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (free M0 tier works for development)
- A Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) for Nodemailer

### 1. Clone the repository
```bash
git clone https://github.com/MuskanEjaz/Campus-Opportunity-Aggregator.git
cd campus-opportunity-aggregator
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure environment variables
Create a `.env` file in `/backend` (see [Environment Variables](#environment-variables) below).

### 4. Seed the database (optional)
```bash
cd database
node seed.mongo.js
```

### 5. Run in development

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm start
```

The frontend proxies API calls to `http://localhost:5000` via the `"proxy"` field in `package.json`.

---

## Environment Variables

Create `/backend/.env`:

```env
# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_jwt_secret_here

# Email (Gmail SMTP)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Server
PORT=5000
NODE_ENV=development

# CORS (comma-separated allowed origins)
ALLOWED_ORIGINS=http://localhost:3000
```

> ⚠️ Never commit `.env` to version control. Add it to `.gitignore`.

---

## API Reference

All protected routes require the header:
```
Authorization: Bearer <token>
```

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register new user; validates email MX records; sends welcome email |
| POST | `/login` | ❌ | Authenticate; returns JWT + user info |

### Search — `/api/search`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ❌ | List active opportunities; supports `?category_id`, `?dept_id`, `?opp_mode`, `?is_paid`, `?q` |
| GET | `/:id` | ❌ | Get full opportunity detail |
| POST | `/:id/view` | ❌ | Atomically increment view count (`$inc`) |

### Bookmarks — `/api/bookmarks`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | Get current user's saved opportunities (populated) |
| POST | `/` | ✅ | Save an opportunity; increments `save_count` |
| DELETE | `/:opp_id` | ✅ | Unsave; decrements `save_count` |
| GET | `/notifications` | ✅ | Get latest 20 notifications for current user |
| PATCH | `/notifications/:id/read` | ✅ | Mark notification as read |

### Admin — `/api/admin` *(requires `role_id === 1`)*
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/stats` | ✅ Admin | Parallel fetch: active count, expired count, student count, total saves |
| GET | `/opportunities` | ✅ Admin | All opportunities (active + expired) |
| POST | `/opportunities` | ✅ Admin | Create opportunity + fan-out `insertMany` notifications to all students |
| DELETE | `/opportunities/:id` | ✅ Admin | Delete opportunity + cascade delete bookmarks and notifications |
| GET | `/expiring` | ✅ Admin | Opportunities with deadline within 3 days |
| GET | `/recommendations/:user_id` | ✅ Admin | Top 10 scored opportunities based on user's bookmark history |

---

## Database Schema

### User
```js
{
  user_name:   String (unique),
  email:       String (unique),
  password:    String,           // bcrypt hash
  dept_id:     Number,
  dept_name:   String,
  role_id:     Number,           // 1 = Admin, 2 = Student
  created_at:  Date
}
```

### Opportunity
```js
{
  title, description, organization, category_id, category_name,
  dept_id, dept_name, opp_mode,           // Remote | On-Campus | Hybrid
  is_paid, stipend_details, location,
  eligibility, required_skills: [String], tags: [String],
  deadline: Date,
  status: String,                          // 'active' | 'expired' — auto-managed by pre-save hook
  application_link: String,
  views_count: Number,
  save_count:  Number,
  posted_by:   ObjectId → User,
  created_at:  Date
}
// Indexes: { status, deadline }, { status, category_id, deadline }, { views_count, save_count }
```

### SavedOpportunity
```js
{
  user_id: ObjectId → User,
  opp_id:  ObjectId → Opportunity,
  saved_at: Date
}
// Unique index: { user_id, opp_id }
```

### Notification
```js
{
  user_id:    ObjectId → User,
  message:    String,
  opp_id:     ObjectId → Opportunity,
  is_read:    Boolean,
  created_at: Date
}
// Indexes: { user_id, created_at DESC }, { user_id, is_read }
```

---

## Known Limitations

| # | Limitation | Potential Fix |
|---|---|---|
| 1 | Notifications poll every 30 s (not real-time) | WebSockets / Server-Sent Events |
| 2 | No pagination — all results returned at once | Keyset pagination (`?page=&limit=`) |
| 3 | No application tracking after external redirect | Internal application log collection |
| 4 | No password reset flow | Time-limited reset link via Nodemailer |
| 5 | Flat admin hierarchy (no roles within admins) | Super-admin, department-scoped roles |
| 6 | No deadline reminder emails | Cron job scanning bookmarked near-expiry items |
| 7 | No image uploads for opportunity cards | Cloudinary / AWS S3 integration |
| 8 | Seed data is static and must be entered manually | Bulk CSV import endpoint |
