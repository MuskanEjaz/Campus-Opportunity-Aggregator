# Campus Opportunity Aggregator

A web-based platform for centralized discovery and management of student opportunities — internships, scholarships, hackathons, workshops, research positions, and more — built with React, Node.js, and Oracle Database.

---

## Team Members

| Name | ID | Responsibilities |
|---|---|---|
| Juwairiya Haroon | 505494 | Schema · Indexes · Views · Search SP · Backend Core · Listings Page · Detail Page · Navbar |
| Zainab Hashmi | 501868 | Triggers · Transactions · Bookmark SP · Frontend Auth · Saved Page · Notifications |
| Muskan Ejaz | 522695 | Recommendations SP · Trending View · Analytics · Admin Dashboard · Expiring Soon |

**Submitted To:** Ms. Ayesha Hakim

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | Node.js + Express |
| Database | Oracle Database (PL/SQL) |
| Authentication | JSON Web Tokens (JWT) |
| Password Security | bcrypt |

---

## Project Structure

```
Campus_Opportunity_Aggregator/
│
├── backend/
│   ├── config/
│   │   └── db.js              # Oracle connection pool (Juwairiya)
│   ├── middleware/
│   │   └── auth.js            # JWT verification middleware (Juwairiya)
│   ├── routes/
│   │   ├── search.js          # Search & filter API (Juwairiya)
│   │   ├── bookmarks.js       # Bookmark API (Zainab)
│   │   └── admin.js           # Admin dashboard API (Muskan)
│   ├── server.js              # Express server entry point (Juwairiya)
│   ├── package.json
│   └── .env                   # create this manually (see setup)
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── ListingsPage.jsx     # Opportunity listings (Juwairiya)
│       │   ├── DetailPage.jsx       # Single opportunity view (Juwairiya)
│       │   ├── LoginPage.jsx        # Login page (Zainab)
│       │   ├── RegisterPage.jsx     # Register page (Zainab)
│       │   ├── SavedPage.jsx        # Bookmarks page (Zainab)
│       │   └── AdminDashboard.jsx   # Admin panel (Muskan)
│       ├── components/
│       │   ├── Navbar.jsx           # Responsive navbar (Juwairiya)
│       │   ├── OpportunityCard.jsx  # Reusable card (Juwairiya)
│       │   ├── FilterBar.jsx        # Search + filters (Juwairiya)
│       │   └── NotificationBell.jsx # Notifications (Zainab)
│       └── context/
│           └── AuthContext.jsx      # JWT token storage (Juwairiya)
│
├── database/
│   ├── schema.sql             # All tables, indexes, views, procedures, triggers
│   └── seed.sql               # Sample data for development
│
└── README.md
```

---

## Database Design

The database is normalized to **Third Normal Form (3NF)** and consists of 12 tables.

### Tables

| Table | Description |
|---|---|
| `roles` | Student and admin roles |
| `departments` | University departments |
| `categories` | Opportunity categories (internship, scholarship, etc.) |
| `tags` | Searchable tags (remote, funded, beginner-friendly, etc.) |
| `users` | Registered users with hashed passwords |
| `opportunities` | Core opportunity listings |
| `opportunity_tags` | Many-to-many: opportunities and tags |
| `saved_opportunities` | Student bookmarks |
| `user_interests` | Student category preferences for recommendations |
| `notifications` | System and deadline notifications |
| `opportunity_views` | View tracking per user per opportunity |
| `applications_log` | Action history (applied, withdrawn, etc.) |

### ADMS Concepts Implemented

| Concept | Details | Implemented By |
|---|---|---|
| **Normalization** | 3NF across all 12 tables | Juwairiya |
| **Indexes** | B-Tree, Composite, and Function-Based | Juwairiya |
| **Views** | `active_opportunities`, `expiring_soon`, `trending_opportunities` | Juwairiya / Muskan |
| **Stored Procedures** | `filter_opportunities`, `add_opportunity`, `get_user_recommendations` | Juwairiya / Muskan |
| **Triggers** | `trg_update_save_count`, `trg_decrease_save_count`, `trg_update_views_count`, `trg_auto_expire`, `trg_notify_on_new` | Juwairiya / Zainab |
| **Transactions** | Atomic opportunity posting with tag assignment and rollback on failure | Zainab |
| **Constraints** | Primary keys, foreign keys, unique, not null, check constraints throughout | Juwairiya |

---

## Setup Instructions

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) v18 or above
- [Oracle Database](https://www.oracle.com/database/technologies/appdev/xe.html) (XE edition is fine)
- [Git](https://git-scm.com/)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/campus-opportunity-aggregator.git
cd Campus_Opportunity_Aggregator
```

---

### Step 2 — Set Up the Database

Open your Oracle environment (SQL Developer, SQLPlus, or VS Code with SQLTools) and run the following files **in order**:

```sql
-- 1. Create all tables, indexes, views, procedures, and triggers
@database/schema.sql

-- 2. Insert sample data
@database/seed.sql
```

> Make sure you have the required privileges before running. If not, connect as SYSDBA and run:
> ```sql
> GRANT CREATE VIEW, CREATE PROCEDURE, CREATE TRIGGER TO your_username;
> ```

> The connection string in `.env` should point to your pluggable database — typically `localhost/XEPDB1` for Oracle XE 21c and above.

---

### Step 3 — Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder with your own Oracle credentials:

```
PORT=5000
DB_USER=your_oracle_username
DB_PASSWORD=your_oracle_password
DB_CONNECTION=localhost/XEPDB1
JWT_SECRET=campus_opportunity_secret_key_2025
```

> The `JWT_SECRET` must be **identical** across all team members' machines, otherwise login tokens generated on one machine will be rejected on another.

---

### Step 4 — Run the Backend Server

```bash
npm run dev
```

You should see:

```
Oracle connection pool created successfully
Server running on http://localhost:5000
```

Verify the server is running by visiting: http://localhost:5000/api/health

---

### Step 5 — Set Up the Frontend

```bash
cd ../frontend
npm install
npm start
```

The React app will open at http://localhost:3000

---

## API Endpoints

### Search & Filter (Juwairiya)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/search` | Filter opportunities by category, dept, mode, paid, deadline | None |
| GET | `/api/search/:id` | Get single opportunity by ID | None |
| POST | `/api/search/:id/view` | Log a view, trigger increments views_count | None |
| GET | `/api/health` | Server health check | None |

**Example request:**
```
GET /api/search?category_id=1&dept_id=1&opp_mode=remote&is_paid=1
```

### Bookmarks & Auth (Zainab)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new student | None |
| POST | `/api/auth/login` | Login and receive JWT token | None |
| POST | `/api/bookmarks` | Save an opportunity | Required |
| DELETE | `/api/bookmarks/:opp_id` | Remove a bookmark | Required |
| GET | `/api/bookmarks` | Get all saved opportunities for logged-in user | Required |

### Admin (Muskan)

| Method | Endpoint | Description | Auth (Admin only) |
|---|---|---|---|
| POST | `/api/admin/opportunities` | Add a new opportunity with tags | Required |
| PUT | `/api/admin/opportunities/:id` | Edit an opportunity | Required |
| DELETE | `/api/admin/opportunities/:id` | Delete an opportunity | Required |
| GET | `/api/admin/stats` | Get dashboard analytics | Required |

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the backend server runs on | `5000` |
| `DB_USER` | Your Oracle database username | `campus_user` |
| `DB_PASSWORD` | Your Oracle database password | `yourpassword` |
| `DB_CONNECTION` | Oracle connection string | `localhost/XEPDB1` |
| `JWT_SECRET` | Secret key for signing JWT tokens — must match across all machines | `campus_opportunity_secret_key_2025` |

> Never commit your `.env` file to GitHub. It is listed in `.gitignore` and each team member must create their own locally.

---

## After Pulling From GitHub

If you have just pulled the latest changes, run:

```bash
# Reinstall backend dependencies if package.json changed
cd backend
npm install

# Reinstall frontend dependencies if package.json changed
cd ../frontend
npm install

# Re-run the database files if schema.sql changed
# Open Oracle and run @database/schema.sql then @database/seed.sql
```

---

## Completed Features

| Feature | Status | Built By |
|---|---|---|
| 12-table Oracle schema normalized to 3NF | Done | Juwairiya |
| B-Tree, Composite, Function-Based indexes | Done | Juwairiya |
| Active, ExpiringSoon, Trending views | Done | Juwairiya / Muskan |
| FilterOpportunities stored procedure | Done | Juwairiya |
| AddOpportunity stored procedure with transaction | Done | Juwairiya |
| GetRecommendations stored procedure | Pending | Muskan |
| views_count + save_count triggers | Done | Juwairiya |
| Auto-expire + notify triggers | Pending | Zainab |
| Seed data (10 opportunities) | Done | Juwairiya |
| Node.js + Express backend | Done | Juwairiya |
| Oracle connection pool | Done | Juwairiya |
| JWT middleware | Done | Juwairiya |
| Search + filter API route | Done | Juwairiya |
| Responsive navbar | Done | Juwairiya |
| Listings page with 4 filters | Done | Juwairiya |
| Opportunity detail page | Done | Juwairiya |
| Login / Register pages | Pending | Zainab |
| Bookmark feature + saved page | Pending | Zainab |
| Notifications bell | Pending | Zainab |
| Admin dashboard + Chart.js | Pending | Muskan |
| Recommendations section | Pending | Muskan |
| Expiring soon section | Pending | Muskan |
| Responsive audit + final polish | Pending | Muskan |

---

## Key Notes for Teammates

**For Zainab** — pull the latest code before starting. The backend server, db.js, auth middleware, and frontend structure are all set up and working. You need to add `routes/bookmarks.js` and `routes/auth.js` to the backend, and build `LoginPage.jsx`, `RegisterPage.jsx`, `SavedPage.jsx`, and `NotificationBell.jsx` on the frontend. Your triggers `trg_auto_expire` and `trg_notify_on_new` also need to be added to `schema.sql`.

**For Muskan** — pull the latest code before starting. Add `routes/admin.js` to the backend and build `AdminDashboard.jsx` on the frontend. The `get_user_recommendations` stored procedure and `trending_opportunities` view are already in `schema.sql` waiting to be called from your routes.

---

## License

This project was developed for academic purposes as part of the Web Technologies and Advanced Database Management Systems courses.