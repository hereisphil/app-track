# App Track 🚀

A modern MERN Job & Opportunity Tracker built with TypeScript

Live App (Frontend):  
👉 <https://app-track-frontend.vercel.app/>

Backend API (Docker + Render):  
👉 <https://app-track-backend.onrender.com/api/v1>

Source Code:  
👉 <https://github.com/hereisphil/app-track>

---

## 🖥️ What Is App Track?

**App Track** is a full-stack MERN web application that helps users track job applications and opportunities in one clean, centralized place.

This project was built as a **real-world prototype**, focusing on:

-   Strong TypeScript typing (frontend + backend)
-   Modern deployment practices
-   Authentication & protected routes
-   Clean, readable architecture

### 🎨 FIGMA Inspriration

I took inspriration from a public mockup on Figma, so thank you **Kevin Karma**
<https://www.figma.com/community/file/1380960317484572057>

---

## 🎯 Why This Project Exists

### For Recruiters / Employers

This project demonstrates:

-   End-to-end **full-stack development**
-   Real authentication (sessions + bcrypt)
-   REST API design with protected routes
-   Dockerized backend deployed to production
-   A deployed frontend talking to a real API

In short: **this is not a tutorial app**, it’s a production-style prototype.

### For Amateur Developers

This repo is designed to be:

-   Easy to read
-   Strongly typed everywhere
-   A reference for building and deploying a MERN app properly
-   A realistic example of how frontend and backend connect in production

If you’re learning MERN + TypeScript, this repo is meant to help you see how all the pieces fit together.

---

## 🧱 Tech Stack

### Frontend

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   React Router
-   Deployed on **Vercel**

### Backend

-   Node.js
-   Express
-   TypeScript
-   MongoDB Atlas
-   Mongoose
-   express-session (auth)
-   bcrypt (password hashing)
-   Docker (custom image)
-   Deployed on **Render**

---

## 🔐 Authentication & Security

-   Passwords are **hashed with bcrypt**
-   Sessions are handled with **express-session**
-   Protected API routes require authentication
-   CORS is locked down to the production frontend
-   Environment variables are used for all secrets

> ⚠️ Even though the app is secure, please use **fake credentials** while testing.

---

## 📦 Main Features (Current)

-   User registration & login
-   Session-based authentication
-   Add job opportunities
-   View opportunities tied to the logged-in user
-   Protected backend routes
-   Fully deployed frontend + backend

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
│ ├── Dockerfile
│ └── tsconfig.json
│
└── README.md
```

---

## 🐳 Docker & Deployment Notes

-   The backend is fully Dockerized
-   A custom Docker image is built and pushed to Docker Hub
-   Render pulls the image and injects environment variables
-   The backend respects process.env.PORT (required for cloud platforms)

This setup mirrors how real production services are deployed.

---

## 🚧 Project Status

This app is:

-   ✅ Functional
-   ✅ Deployed
-   🚧 Still evolving

Planned future improvements include:

-   Editing & deleting opportunities
-   Better UI filtering & status tracking
-   Improved error handling & UX
-   Possibly JWT-based auth as an alternative to sessions

## 🙌 Final Notes

This project represents a strong foundation:

-   Not over-engineered
-   Not tutorial-only
-   Built to reflect real-world development practices

If you’re a recruiter, feel free to explore the live app and the source code.
If you’re a developer, feel free to fork it, study it, and break it.

Thanks for checking it out!

## 👋 Author

Hi! I’m Phillip Cantu, a current [Full Sail University](https://www.fullsail.edu/) web development student, _expected graduation February 2027_, and a [4Geeks Academy Full Stack](https://www.phillipcantu.com/certificate.pdf) bootcamp graduate.

-   **GitHub:** [hereisphil](https://github.com/hereisphil)
-   **LinkedIn:** [phillipcantu](https://www.linkedin.com/in/phillipcantu/)
-   **Email:** [thereisphil@gmail.com](mailto:thereisphil@gmail.com)
