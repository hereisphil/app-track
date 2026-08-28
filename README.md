# App Track 🚀

A modern full-stack Job & Opportunity Tracker built with React, Express, and SQLite — TypeScript everywhere

Live App (Frontend):  
👉 <https://app-track-frontend.vercel.app/>

Backend API (Docker + Render):  
👉 <https://app-track-backendraw.onrender.com/api/v1>

Source Code:  
👉 <https://github.com/hereisphil/app-track>

---

## 🖥️ What Is App Track?

**App Track** is a full-stack web application that helps users track job applications and opportunities in one clean, centralized place.

This project was built as a **real-world prototype**, focusing on:

- Strong TypeScript typing (frontend + backend)
- Modern deployment practices
- Authentication & protected routes
- Clean, readable architecture

### 🎨 FIGMA Inspriration

I took inspriration from a public mockup on Figma, so thank you **Kevin Karma**
<https://www.figma.com/community/file/1380960317484572057>

---

## 🎯 Why This Project Exists

### For Recruiters / Employers

This project demonstrates:

- End-to-end **full-stack development**
- Real authentication (sessions + bcrypt)
- REST API design with protected routes
- Dockerized backend deployed to production
- A deployed frontend talking to a real API

### For Amateur Developers

This repo is designed to be:

- Easy to read
- Strongly typed everywhere
- A reference for building and deploying a full-stack TypeScript app properly
- A realistic example of how frontend and backend connect in production

If you’re learning full-stack TypeScript, this repo is meant to help you see how all the pieces fit together.

---

## 🧱 Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Deployed on **Vercel**

### Backend

- Node.js
- Express 5
- TypeScript
- SQLite via **better-sqlite3** (no ORM — raw SQL behind a thin repository layer)
- express-session (auth) — sessions persisted in the same SQLite file via a custom session store
- bcrypt (password hashing)
- Docker (custom image)
- Deployed on **Render**

> 🔄 The backend originally ran on MongoDB Atlas + Mongoose; it has since been migrated to SQLite, so no external database service is needed.

---

## 🔐 Authentication & Security

- Passwords are **hashed with bcrypt**
- Sessions are handled with **express-session** and stored in the SQLite database via a custom session store
- Protected API routes require authentication
- CORS is locked down to the production frontend
- Environment variables are used for all secrets

> ⚠️ Even though the app is secure, please use **fake credentials** while testing.

---

## 📦 Main Features (Current)

- User registration & login
- Session-based authentication
- Add job opportunities
- View opportunities tied to the logged-in user
- Protected backend routes
- Fully deployed frontend + backend

---

## 🧪 Public API Endpoints (Read-Only Examples)

```txt
GET /
GET /api/v1
GET /api/v1/opps
```

Some routes require authentication and will return errors if accessed without a valid session.

## 🗂️ Project Structure (Simplified)

```tree
app-track/
├── client/ # React + TypeScript frontend
│ ├── src/
│ └── public/
│
├── server/ # Express + TypeScript backend
│ ├── src/
│ ├── data/ # SQLite database file (auto-created, git-ignored)
│ ├── Dockerfile
│ └── tsconfig.json
│
└── README.md
```

---

## 🏃 Running Locally

No database service required — the SQLite database is a single file that the server creates automatically on first run.

### Prerequisites

- Node.js (v20+) and npm

That’s it. No database install, no cloud database account.

### 1. Backend

```bash
cd server
npm install
npm run dev
```

The API starts on **port 3000** (tsx watch mode), and the database file is auto-created at `./data/app_track.sqlite`.

Create a `server/.env` file:

```env
DATABASE_PATH=./data/app_track.sqlite
PORT=3000
SESSION_SECRET=your-secret-here
NODE_ENV=development
```

| Variable         | Description                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_PATH`  | Path to the SQLite file (parent directory is auto-created). Use `:memory:` for an ephemeral in-memory database.        |
| `PORT`           | Server port (defaults to `3000`)                                                                                        |
| `SESSION_SECRET` | Secret used to sign session cookies                                                                                     |
| `NODE_ENV`       | `development` locally, `production` in prod                                                                             |

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Vite serves the app on **port 5173** — keep that port, since the backend CORS allowlist expects it.

Create a `client/.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

> The `/api/v1` suffix is required — the client uses this value as the base for all API calls.

### 3. Tests

```bash
cd server
npm test
```

Runs the vitest + supertest contract suite against the API.

---

## 🗃️ Data Model

Everything lives in one SQLite file (WAL mode, foreign keys enforced):

- **users** — `_id` (TEXT UUID primary key), unique `email`, bcrypt password hash, timestamps
- **opps** — `_id` (TEXT UUID primary key), `title`, `company`, optional `location`/`website`, `status` (CHECK-constrained to `applied | interviewing | offered | rejected`), `tags` (JSON text), `userId` foreign key → users with `ON DELETE CASCADE`, timestamps
- **sessions** — express-session data, stored by the custom SQLite session store

---

## 🐳 Docker & Deployment Notes

- The backend is fully Dockerized with a multi-stage build
- A custom Docker image is built and pushed to Docker Hub
- Render pulls the image and injects environment variables
- The backend respects process.env.PORT (required for cloud platforms); the image exposes port 3000
- The runtime image sets `DATABASE_PATH=/data/app_track.sqlite` and declares `VOLUME /data` so the database lives on a mountable volume

> ⚠️ **SQLite on Render:** attach a persistent disk mounted at `/data`, or the database is wiped on every deploy/restart — the free tier’s filesystem is ephemeral. Also note that a persistent disk pins the service to a single instance (no horizontal scaling).

This setup mirrors how real production services are deployed.

---

## 🚧 Project Status

This app is:

- ✅ Functional
- ✅ Deployed
- 🚧 Still evolving

Planned future improvements include:

- Editing & deleting opportunities
- Better UI filtering & status tracking
- Improved error handling & UX
- Possibly JWT-based auth as an alternative to sessions

## 👋 Author

Hi! I’m Phillip Cantu, a current [Full Sail University](https://www.fullsail.edu/) web development student, _expected graduation February 2027_, a current Flatiron School [Accelerated AI Engineering Immersive](https://flatironschool.com/courses/work-integrated-programs/) student and paid apprentice, and a [4Geeks Academy Full Stack](https://www.phillipcantu.com/certificate.pdf) bootcamp graduate.

- **GitHub:** [hereisphil](https://github.com/hereisphil)
- **LinkedIn:** [phillipcantu](https://www.linkedin.com/in/phillipcantu/)
- **Email:** [thereisphil@gmail.com](mailto:thereisphil@gmail.com)
