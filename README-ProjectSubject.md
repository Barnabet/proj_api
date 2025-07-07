# 📌 Project Summary

A simple, efficient multi-service project including:

- A **Profile Management micro-service** where users can personalize their avatar, bio, and preferences.
- A **To-Do List & Calendar micro-service** to manage tasks, track deadlines, and display weekly productivity stats.
- A **React + Vite + Tailwind dashboard frontend** to connect it all.

---

## 📦 Micro-services Description

### 🧑 Profile Service (Micro-service 1)

**Purpose:**  
Allow users to manage their personal profile with:
- Avatar (emoji, color, or image URL)
- Bio
- Nickname
- Theme color or preferences

**REST API Endpoints:**

| Method | URL                | Description              |
|:--------|:---------------------|:---------------------------|
| `GET`  | `/profiles/:userId`    | Retrieve a user profile      |
| `POST` | `/profiles`            | Create a user profile        |
| `PUT`  | `/profiles/:userId`    | Update a user profile        |

**Database:** PostgreSQL (table `profiles`)

---

### 📝 To-Do List & Calendar Service (Micro-service 2)

**Purpose:**  
Allow users to:
- Create tasks with deadlines (linked to their profile)
- See their tasks in a calendar view
- Track completed vs pending tasks
- View stats: number of tasks completed per week

**REST API Endpoints:**

| Method   | URL                     | Description                 |
|:------------|:--------------------------|:-------------------------------|
| `GET`    | `/todos/:userId`              | Get all user tasks               |
| `POST`   | `/todos`                      | Create a new task                |
| `PUT`    | `/todos/:todoId`              | Update a task                    |
| `DELETE` | `/todos/:todoId`              | Delete a task                    |
| `GET`    | `/todos/:userId/stats`        | Retrieve user's weekly stats     |

**Database:** PostgreSQL (table `todos`)

---

## 📊 Frontend Dashboard (React + Vite + Tailwind)

**Pages:**

| URL            | Page                           | Auth |
|:----------------|:--------------------------------|:------|
| `/login`       | Google OAuth login              | Public |
| `/dashboard`   | Global profile + weekly stats   | Private |
| `/profile`     | Profile management form         | Private |
| `/todos`       | To-do list + calendar view      | Private |

---

## 📌 Functional Features

### Authentication
✅ Google OAuth via `/auth/google`  
✅ Store JWT in httpOnly cookie  
✅ Route guards on frontend using React Router  

---

### Profile Management
✅ Form to update nickname, avatar, bio  
✅ API calls: GET / POST / PUT via Axios or React Query  

---

### To-Do List & Calendar
✅ List all tasks  
✅ Add / edit / delete tasks  
✅ Integrate a calendar view (`react-calendar` or `fullcalendar.io`)  
✅ Dashboard stats: completed vs total tasks per week  

---

## 📦 Deployment (Docker Compose)
- One container per micro-service
- One for frontend
- One for API gateway
- One for PostgreSQL  
Optional: Swagger UI for each API

---

## 📋 Roadmap

1️⃣ Set up Profile micro-service (API + DB)  
2️⃣ Set up To-Do micro-service (API + DB)  
3️⃣ Integrate both into the API gateway  
4️⃣ Build frontend: login → dashboard → profile → to-do list  
5️⃣ Add dashboard stats  
6️⃣ Bonus: image avatar upload, theme color selector  

---