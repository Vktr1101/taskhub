# TaskHub

A full-stack task management web application with user accounts, an admin dashboard, and Google OAuth authentication. Users can create, edit, and track tasks with deadlines and statuses; administrators can manage users through a protected dashboard.

## Tech Stack

**Frontend**
- React + TypeScript
- Vite (build tool / dev server)
- React Router (client-side routing)
- Context API (global auth state)
- Axios (HTTP requests)

**Backend**
- Node.js + Express + TypeScript
- Sequelize (ORM)
- Passport + passport-google-oauth20 (Google OAuth)
- express-session (session management)
- bcrypt (password hashing)
- dotenv (environment variables)
- cors (cross-origin requests)

**Database**
- MySQL (running in a Docker container)

## Features

### Authentication
- Classic registration and login with username, email, and password (passwords hashed with bcrypt)
- Session-based authentication using cookies
- Login state persists across page refreshes (verified via `/api/me`)
- Protected routes: `/tasks` and `/profile` redirect to login when the user is not authenticated

### Tasks
- Create tasks with a title, description, priority, category, deadline (date), and hour
- Field validation with red borders on empty fields, plus a deadline-must-be-in-the-future check
- "Time left" calculation for each task (more than 1 week / 1 week or less / 3 days or less / 24 hours or less / expired)
- Automatic status: **Active** / **Inactive** (derived from the deadline) or **Done** / **Canceled** (set manually)
- Edit tasks through a modal that reuses the task form (disabled for done/canceled tasks)
- Checkbox selection with a bottom action bar: mark selected tasks as Done, Cancel them, or Delete them, plus Select All / Deselect All
- Logged-out visitors can create temporary tasks stored locally (not saved to the database)

### Profile
- View username and email
- Edit username through a modal
- Logout
- Delete account (removes the user and all their tasks)

### Admin dashboard
- Accessed at `/admin` behind a password gate; entering the correct admin password reveals a **Login with Google** button
- Google OAuth is used exclusively for admin access (accounts created through Google login become admins automatically)
- Dashboard lists all users with per-user task counts (undone / done / canceled)
- Toggle to show or hide other admins
- **Ban** a user with a required reason (entered in a modal); banned users see the ban reason and a logout button on the main page and cannot log in normally
- **Unban** a user
- **Delete** a user (removes the user and their tasks)

## Project Structure

```
taskhub/
├── backend/
│   ├── models/          # Sequelize models (User, Task)
│   ├── routes/          # Express routers (auth, tasks, admin)
│   ├── database.ts      # Sequelize connection
│   ├── passport.ts      # Google OAuth strategy
│   ├── server.ts        # Express app entry point
│   ├── .env             # secrets (NOT committed)
│   └── env-example.txt  # template for .env
├── public/
├── src/
│   ├── components/      # reusable components (Header, TaskForm, Button, ...)
│   ├── context/         # UserContext + UserProvider
│   ├── pages/           # page components (TaskHub, Tasks, Profile, Login, Register, Admin)
│   ├── styles/          # CSS (index.css, layout.css, tasks.css)
│   └── api.ts           # centralized axios instance
└── index.html
```

## Prerequisites

- Node.js (v22+ recommended, so TypeScript files run directly)
- Docker (for the MySQL database)
- A Google Cloud project with OAuth credentials (for admin login)

## Local Setup

### 1. Clone the repository

```
git clone https://github.com/Vktr1101/taskhub.git
cd taskhub
```

### 2. Start the MySQL database (Docker)

Create and run a MySQL container:

```
docker run --name taskhub-mysql -e MYSQL_ROOT_PASSWORD=taskhub123 -p 3307:3306 -d mysql
```

To start/stop it later:

```
docker start taskhub-mysql
docker stop taskhub-mysql
```

### 3. Create the database and tables

Connect to MySQL inside the container:

```
docker exec -it taskhub-mysql mysql -u root -p
```

Then create the database and tables:

```sql
CREATE DATABASE taskhub;
USE taskhub;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    parola VARCHAR(255) NULL,
    googleId VARCHAR(255),
    admin BOOLEAN DEFAULT false,
    banned BOOLEAN DEFAULT false,
    banReason TEXT
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titlu VARCHAR(255) NOT NULL,
    descriere TEXT NOT NULL,
    prioritate VARCHAR(20) NOT NULL,
    categorie VARCHAR(20) NOT NULL,
    deadline DATE NOT NULL,
    ora VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'undone',
    userId INT
);
```

### 4. Configure environment variables

In the `backend/` folder, create a `.env` file based on `env-example.txt`:

```
DB_NAME=taskhub
DB_USER=root
DB_PASSWORD=taskhub123
DB_HOST=localhost
DB_PORT=3306
SESSION_SECRET=your-session-secret
PORT=3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
ADMIN_PASSWORD=your-admin-password
```

> The `.env` file holds secrets and must never be committed. It is already listed in `.gitignore`.

**Google OAuth setup:** create OAuth credentials in the Google Cloud Console with:
- Authorized JavaScript origin: `http://localhost:5173`
- Authorized redirect URI: `http://localhost:3000/api/auth/google/callback`

Add your Google account under "test users" on the OAuth consent screen while the app is unverified.

### 5. Install dependencies

Backend:

```
cd backend
npm install
```

Frontend (from the project root):

```
cd ..
npm install
```

### 6. Run the app

Start the backend (from `backend/`, with the MySQL container running):

```
node server.ts
```

Start the frontend (from the project root, in a separate terminal):

```
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## API Overview

**Auth** (`/api`)
- `POST /register` — create an account (auto-login)
- `POST /login` — log in (rejects banned users with their ban reason)
- `POST /logout` — end the session
- `GET /me` — current auth status (also reports ban status)
- `PATCH /update-username` — change username
- `DELETE /delete-account` — delete own account and tasks
- `GET /auth/google` — start Google OAuth
- `GET /auth/google/callback` — Google OAuth callback

**Tasks** (`/api/tasks`)
- `GET /` — list the logged-in user's tasks
- `POST /` — create a task
- `PATCH /:id` — edit a task
- `DELETE /:id` — delete a task

**Admin** (`/api/admin`, admin only)
- `GET /users` — list all users with task counts
- `PATCH /ban/:id` — ban a user with a reason
- `PATCH /unban/:id` — unban a user
- `DELETE /delete-user/:id` — delete a user and their tasks

## Notes

- The MySQL data lives inside the Docker container; stopping the container keeps the data, but removing (`docker rm`) it deletes the data.
- Because the backend runs TypeScript directly with `node`, restart the server after any backend change.
