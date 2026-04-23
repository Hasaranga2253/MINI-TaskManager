# Mini Task Manager App

## Overview

This is a full-stack task management application where users can register, log in, and manage their personal tasks.

## Tech Stack

* Frontend: React.js (Vite)
* Backend: ASP.NET Core Web API (C#)
* Database: MySQL
* Authentication: Firebase (Email & Password)

---

## Features

* User Registration & Login (Firebase)
* Add new tasks
* View tasks
* Mark tasks as completed
* Delete tasks
* Filter tasks (All / Completed / Pending)

---

## Backend Setup (ASP.NET Core)

1. Navigate to backend folder:

```
cd backend
```

2. Install dependencies:

```
dotnet restore
```

3. Update connection string in `appsettings.json`:

```
"server=localhost;port=3306;database=taskdb;user=root;password=YOUR_PASSWORD;"
```

4. Run migrations:

```
dotnet ef database update
```

5. Run backend:

```
dotnet run
```

Backend will run on:

```
https://localhost:XXXX
```

---

## Frontend Setup (React)

1. Navigate to frontend:

```
cd frontend
```

2. Install dependencies:

```
npm install
```

3. Add Firebase config in:

```
src/firebase.js
```

4. Run frontend:

```
npm run dev
```

Frontend runs on:

```
http://localhost:5173 or 5175
```

---

## Firebase Setup

1. Create Firebase project
2. Enable Email/Password authentication
3. Register Web App
4. Copy config into `firebase.js`

---

## Deployment

Frontend deployed using Vercel:
👉 [Add your Vercel link here]

---

## API Endpoints

* GET /api/tasks
* POST /api/tasks
* PUT /api/tasks/{id}
* DELETE /api/tasks/{id}

---

## Notes

* Tasks are linked to logged-in Firebase users
* Only authenticated users can access tasks
