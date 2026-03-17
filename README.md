# CODEVERSE Quiz Platform

A full-stack, two-round competitive coding quiz application built for the **VAHGFINIX'26** event. Students register, attempt a timed MCQ round, and top performers advance to a code debugging round — all in a secure, proctored browser environment.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running with Docker Compose](#running-with-docker-compose)
  - [Running Locally (without Docker)](#running-locally-without-docker)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Admin Panel](#admin-panel)

---

## Overview

CODEVERSE is a competitive quiz platform designed for college-level coding events. It supports:

- **Round 1** — Timed multiple-choice questions (MCQ) with anti-cheating measures
- **Round 2** — Code debugging questions for students who qualify (top 50% by score)
- **Live leaderboard** — Rankings by round score or total score
- **Online compiler** — Built-in code editor supporting Python, Java, and C
- **Admin dashboard** — Create, manage, and delete questions per round

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Vite |
| Backend | Django 4.2, Django REST Framework |
| Database | PostgreSQL (production), SQLite (local dev) |
| Server | Gunicorn + WhiteNoise |
| Containerization | Docker, Docker Compose |
| Deployment | Render (backend + frontend), Vercel (frontend alt) |

---

## Project Structure

```
project-v2/
├── backend/
│   ├── quiz_api/               # Core Django app
│   │   ├── models.py           # Student, Question, StudentAnswer, Leaderboard
│   │   ├── views.py            # All API endpoints + code compiler
│   │   ├── serializers.py      # DRF serializers
│   │   ├── admin.py            # Django admin config
│   │   └── migrations/         # Database migrations
│   ├── quiz_backend/           # Django project settings & URL routing
│   ├── requirements.txt
│   ├── Dockerfile
│   └── Procfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Route definitions
│   │   └── pages/
│   │       ├── Welcome.jsx
│   │       ├── StudentEntry.jsx
│   │       ├── Instructions.jsx
│   │       ├── Quiz.jsx             # Round 1 (MCQ + compiler)
│   │       ├── Round1Results.jsx
│   │       ├── Round2Instructions.jsx
│   │       ├── Round2.jsx           # Round 2 (code debugging)
│   │       ├── ThankYou.jsx
│   │       ├── AdminQuestions.jsx   # Admin question manager
│   │       ├── Header.jsx
│   │       └── Footer.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.js
├── docker-compose.yml
└── render.yaml
```

---

## Features

### Student Flow
1. **Welcome** → **Student Registration** → **Instructions** → **Round 1 Quiz** → **Results** → (if qualified) **Round 2** → **Thank You**

### Round 1 — MCQ Quiz
- Randomized questions served from the backend
- Per-question countdown timer (2 minutes each)
- Anti-cheating suite:
  - Forced fullscreen mode with re-entry prompt
  - Tab switch detection (3-strike auto-submit)
  - Window blur detection
  - Copy/paste and right-click disabled
  - Keyboard shortcut blocking
- Built-in code compiler (Python, Java, C) available alongside questions

### Round 2 — Code Debugging
- Available only to students who scored in the top 50% of Round 1
- Code debugging questions with configurable point values
- Same compiler and security measures as Round 1
- Result email sent automatically on completion

### Admin
- Superuser login with token-based auth
- Add / delete questions per round
- View all students and leaderboard

### Code Compiler
- Supports Python 3, Java, C (gcc)
- Input size limit: 10 KB
- Execution timeout: 10 seconds
- Python sandbox: blocks dangerous imports (`os`, `sys`, `subprocess`, `socket`, etc.)
- Path sanitization in error output

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- OR: Python 3.10+, Node.js 18+, and PostgreSQL

### Running with Docker Compose

```bash
# Clone the repo
git clone https://github.com/Sameerr06/project-v2.git
cd project-v2

# Copy and configure environment variables
cp .env.example .env   # edit as needed

# Build and start all services
docker-compose up --build
```

Services will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:8000
- Django Admin: http://localhost:8000/admin

Default admin credentials (created automatically): `admin` / `admin123`

To stop and remove containers:
```bash
docker-compose down        # stop containers
docker-compose down -v     # also remove database volume
```

### Running Locally (without Docker)

**Backend:**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `DJANGO_SECRET_KEY` | Django secret key |
| `DEBUG` | `True` for development, `False` for production |
| `ALLOWED_HOSTS` | Comma-separated list of allowed hosts |
| `EMAIL_HOST_USER` | Gmail address for result emails |
| `EMAIL_HOST_PASSWORD` | Gmail app password |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

---

## API Reference

### Student

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/student/` | Register a new student |
| DELETE | `/api/delete-student/<id>/` | Delete a student |

### Questions

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/questions/?round=1` | Get randomized questions for a round |
| GET | `/api/admin/questions/` | List all questions (admin) |
| POST | `/api/admin/questions/create/` | Create a question (admin) |
| DELETE | `/api/admin/questions/delete/<id>/` | Delete a question (admin) |

### Quiz Flow

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/submit-answer/` | Submit an answer |
| POST | `/api/complete-round1/` | Finish Round 1, get qualification result |
| GET | `/api/check-qualification/<student_id>/` | Check Round 2 eligibility |
| POST | `/api/start-round2/` | Mark student as starting Round 2 |
| POST | `/api/complete-round2/` | Finish Round 2, triggers result email |

### Other

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/leaderboard/` | Overall leaderboard (optional `?round=1` or `?round=2`) |
| POST | `/api/login/` | Admin superuser login |
| POST | `/api/compile/` | Run code (Python/Java/C) |

---

## Deployment

The project is pre-configured for deployment on **Render** via `render.yaml`:

- **Backend**: Docker-based web service connected to a free PostgreSQL instance
- **Frontend**: Static site built with `npm run build`, served via Render's CDN with React Router rewrites

To deploy:
1. Push to GitHub
2. Connect the repo to Render
3. Render auto-detects `render.yaml` and provisions both services

The frontend is also deployable to **Vercel** — a `vercel.json` config is included in the `frontend/` directory.

---

## Admin Panel

Access the Django admin at `/admin/` with your superuser credentials to:
- View and manage students
- Browse submitted answers
- View the leaderboard proxy model (sorted by total score)

The custom **AdminQuestions** page at `/admin/questions` (frontend) provides a simpler interface for managing quiz questions without needing the Django admin UI.

---

## License

This project was built for CODEVERSE 2K25. All rights reserved.
