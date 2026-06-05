# 🎓 Campus Opportunity Aggregator

A full-stack web application designed to centralize the discovery and management of student opportunities including internships, scholarships, hackathons, workshops, research positions, competitions, fellowships, and career development programs.

The platform enables students to search, filter, save, and track opportunities while providing administrators with tools to manage listings and monitor platform activity.

Built using **React.js**, **Node.js**, **Express.js**, and **Oracle Database (PL/SQL)**.

---

## 📚 Submitted To

**Ms. Ayesha Hakim**

---

# 👥 Team Members

| Name | ID | Responsibilities |
|--------|--------|--------|
| **Juwairiya Haroon** | 505494 | Database Schema Design · Normalization (3NF) · Indexes · Views · Search Stored Procedures · Backend Core Development · Listings Page · Opportunity Detail Page · Responsive Navbar |
| **Zainab Hashmi** | 501868 | Database Triggers & Transactions · Bookmark Stored Procedures · Authentication System (Login/Register) · Saved Opportunities Module · Notifications Module · Frontend Enhancement & Responsive Design · UI/UX Improvements · Application Deployment (Frontend & Backend) · Bug Fixing · Debugging · Integration Testing |
| **Muskan Ejaz** | 522695 | Recommendation Engine · Trending Opportunities View · Analytics Dashboard · Admin Dashboard · Expiring Opportunities Module |

---

# 🚀 Features

## Student Features

- User Registration
- Secure Login Authentication
- Browse Opportunities
- Search Opportunities
- Advanced Filtering
- Opportunity Detail View
- Save/Bookmark Opportunities
- Personalized Notifications
- Responsive User Interface
- Trending Opportunities
- Expiring Soon Opportunities

## Admin Features

- Add Opportunities
- Update Opportunities
- Delete Opportunities
- Dashboard Analytics
- Opportunity Management
- User Activity Monitoring

---

# 🛠 Tech Stack

| Layer | Technology |
|---------|-----------|
| Frontend | React.js |
| Styling | Tailwind CSS |
| Backend | Node.js |
| Framework | Express.js |
| Database | Oracle Database |
| Database Language | PL/SQL |
| Authentication | JSON Web Tokens (JWT) |
| Password Security | bcrypt |
| API Communication | REST APIs |

---

# 🏗 System Architecture

```text
React Frontend
      │
      ▼
Node.js + Express Backend
      │
      ▼
Oracle Database (PL/SQL)
      │
      ▼
Tables + Views + Procedures + Triggers
```

---

# 📂 Project Structure

```text
Campus_Opportunity_Aggregator/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── routes/
│   │   ├── search.js
│   │   ├── bookmarks.js
│   │   ├── auth.js
│   │   └── admin.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   │
│   └── src/
│       │
│       ├── pages/
│       │   ├── ListingsPage.jsx
│       │   ├── DetailPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── SavedPage.jsx
│       │   └── AdminDashboard.jsx
│       │
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── OpportunityCard.jsx
│       │   ├── FilterBar.jsx
│       │   └── NotificationBell.jsx
│       │
│       └── context/
│           └── AuthContext.jsx
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
└── README.md
```

---

# 🗄 Database Design

The database is normalized to **Third Normal Form (3NF)** and contains 12 interconnected tables.

## Tables

| Table Name | Description |
|------------|-------------|
| roles | Student and Admin Roles |
| departments | University Departments |
| categories | Opportunity Categories |
| tags | Searchable Tags |
| users | Registered Users |
| opportunities | Opportunity Listings |
| opportunity_tags | Opportunity-Tag Mapping |
| saved_opportunities | User Bookmarks |
| user_interests | User Preferences |
| notifications | User Notifications |
| opportunity_views | View Tracking |
| applications_log | User Activity History |

---

# 🧠 Advanced Database Concepts Implemented

| Concept | Implementation |
|----------|---------------|
| Normalization | Third Normal Form (3NF) |
| Indexes | B-Tree, Composite, Function-Based |
| Views | Active, Trending, Expiring Soon |
| Stored Procedures | Search, Recommendations, Opportunity Posting |
| Triggers | Save Count, View Count, Notifications |
| Transactions | Atomic Opportunity Posting |
| Constraints | PK, FK, UNIQUE, CHECK, NOT NULL |

---

# 📊 Database Objects

## Views

```sql
active_opportunities
expiring_soon
trending_opportunities
```

## Stored Procedures

```sql
filter_opportunities
add_opportunity
get_user_recommendations
```

## Triggers

```sql
trg_update_save_count
trg_decrease_save_count
trg_update_views_count
trg_auto_expire
trg_notify_on_new
```

---

# 🔐 Authentication & Security

The system uses:

- JWT Authentication
- Password Hashing with bcrypt
- Protected Routes
- Role-Based Access Control
- Secure Session Management

---

# 🔌 API Endpoints

## Search & Opportunities

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | /api/search | Search opportunities |
| GET | /api/search/:id | Opportunity details |
| POST | /api/search/:id/view | Record opportunity view |
| GET | /api/health | Server health check |

---

## Authentication

| Method | Endpoint |
|----------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |

---

## Bookmarks

| Method | Endpoint |
|----------|----------|
| POST | /api/bookmarks |
| DELETE | /api/bookmarks/:id |
| GET | /api/bookmarks |

---

## Admin

| Method | Endpoint |
|----------|----------|
| POST | /api/admin/opportunities |
| PUT | /api/admin/opportunities/:id |
| DELETE | /api/admin/opportunities/:id |
| GET | /api/admin/stats |

---

# ⚙ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/zainab-hashmii/Campus-Opportunity-Aggregator.git

cd Campus-Opportunity-Aggregator
```

---

## 2️⃣ Setup Oracle Database

Run the following files in Oracle SQL Developer or SQL*Plus:

```sql
@database/schema.sql

@database/seed.sql
```

Grant privileges if required:

```sql
GRANT CREATE VIEW TO your_user;

GRANT CREATE PROCEDURE TO your_user;

GRANT CREATE TRIGGER TO your_user;
```

---

## 3️⃣ Setup Backend

Navigate to backend:

```bash
cd backend

npm install
```

Create a `.env` file:

```env
PORT=5000

DB_USER=your_username

DB_PASSWORD=your_password

DB_CONNECTION=localhost/XEPDB1

JWT_SECRET=campus_opportunity_secret_key_2025
```

Start backend server:

```bash
npm run dev
```

Expected output:

```text
Oracle connection pool created successfully

Server running on http://localhost:5000
```

---

## 4️⃣ Setup Frontend

```bash
cd frontend

npm install

npm start
```

Application will run at:

```text
http://localhost:3000
```

---

# 🧪 Testing

The application was tested for:

- User Registration & Login
- JWT Authentication
- Search & Filtering
- Opportunity Management
- Bookmark Functionality
- Notifications
- Stored Procedures
- Trigger Execution
- Database Transactions
- API Integration
- Responsive Design

---

# 📈 Future Enhancements

- AI-Based Opportunity Recommendations
- Email Notifications
- Resume Parsing
- Application Tracking System
- Mobile Application
- University Integration APIs
- Advanced Analytics
- AI Chatbot Assistance

---

# 🎯 Learning Outcomes

This project demonstrates practical implementation of:

- Full Stack Web Development
- Oracle Database Design
- PL/SQL Programming
- REST API Development
- Authentication & Authorization
- Database Optimization
- Responsive UI Design
- Software Testing
- Deployment & Integration
- Team Collaboration

---

# 📜 License

This project was developed solely for academic purposes as part of the:

**Web Technologies Course**

and

**Advanced Database Management Systems (ADMS) Course**

---

# 🙏 Acknowledgements

Special thanks to:

**Ms. Ayesha Hakim**

for her valuable guidance, support, and supervision throughout the project.

---

## ⭐ Developed Using

- React.js
- Node.js
- Express.js
- Oracle Database
- Tailwind CSS
- JWT Authentication

---

### Made with ❤️ by Team Campus Opportunity Aggregator
