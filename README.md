# Campus Opportunity Aggregator

A web-based platform for centralized discovery and management of student opportunities — internships, scholarships, hackathons, workshops, research positions, and more — built with React, Node.js, and Oracle Database.

---

## Team Members

| Name | Role |
|---|---|---|
| Juwairiya Haroon | Database Architect · Search & Filter · Backend Core |
| Zainab Hashmi | Triggers · Transactions · Frontend Auth & Bookmarks |
| Muskan Ejaz | Recommendations · Analytics · Admin Dashboard |


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
campus-opportunity-aggregator/
│
├── backend/
│   ├── config/
│   │   └── db.js              # Oracle connection pool
│   ├── middleware/
│   │   └── auth.js            # JWT verification middleware
│   ├── routes/
│   │   ├── search.js          # Search & filter API (Juwairiya)
│   │   ├── bookmarks.js       # Bookmark API (Zainab)
│   │   └── admin.js           # Admin dashboard API (Muskan)
│   ├── server.js              # Express server entry point
│   ├── package.json
│   └── .env                   # ← create this manually (see setup)
│
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       └── ...
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

- **Normalization** — 3NF across all 12 tables
- **Indexes** — B-Tree, Composite, and Function-Based indexes
- **Views** — `active_opportunities`, `expiring_soon`, `trending_opportunities`
- **Stored Procedures** — `filter_opportunities`, `add_opportunity`, `get_user_recommendations`
- **Triggers** — `trg_update_save_count`, `trg_decrease_save_count`, `trg_update_views_count`, `trg_auto_expire`, `trg_notify_on_new`
- **Transactions** — Atomic opportunity posting with tag assignment and rollback on failure
- **Constraints** — Primary keys, foreign keys, unique, not null, and check constraints throughout

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
git clone https://github.com/MuskanEjaz/Campus-Opportunity-Aggregator.git
cd campus-opportunity-aggregator
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

> Make sure you have `CREATE TABLE`, `CREATE VIEW`, `CREATE PROCEDURE`, and `CREATE TRIGGER` privileges granted to your Oracle user before running. If not, connect as SYSDBA and run:
> ```sql
> GRANT CREATE VIEW, CREATE PROCEDURE, CREATE TRIGGER TO your_username;
> ```

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
DB_CONNECTION=localhost/XE
JWT_SECRET=campus_opportunity_secret_key_2025
```

> The `JWT_SECRET` must be identical across all team members' machines, otherwise login tokens generated on one machine will be rejected on another.

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

Verify the server is running by visiting: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

### Step 5 — Set Up the Frontend

```bash
cd ../frontend
npm install
npm start
```

The React app will open at [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

### Search & Filter (Juwairiya)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/search` | Filter opportunities by category, dept, mode, paid, deadline | Required |
| GET | `/api/health` | Server health check | None |

**Example request:**
```
GET /api/search?category_id=1&opp_mode=remote&is_paid=1
```

### Bookmarks (Zainab)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
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
| `DB_USER` | Your Oracle database username | `system` |
| `DB_PASSWORD` | Your Oracle database password | `yourpassword` |
| `DB_CONNECTION` | Oracle connection string | `localhost/XE` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `campus_opportunity_secret_key_2025` |

> Never commit your `.env` file to GitHub. It is listed in `.gitignore` and each team member must create their own.

---

## After Pulling From GitHub

If you have just pulled the latest changes, you may need to:

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

## Key Features

- Centralized opportunity listings with search and multi-filter support
- Personalized recommendations based on student interests
- Bookmark system with real-time save count tracking
- Deadline urgency indicators and expiring soon alerts
- Admin dashboard with analytics and Chart.js visualizations
- Role-based access control for students and administrators
- JWT-based authentication with bcrypt password hashing
- Fully normalized Oracle database with stored procedures, triggers, and views

---

## License

This project was developed for academic purposes as part of the Web Technologies and Advanced Database Management Systems courses.
