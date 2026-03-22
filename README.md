# Expense Tracker

A full-stack expense tracking application with a Python FastAPI backend and a React (Vite) mobile-optimized frontend.

## Project Structure

```
Expenses Tracker/
├── backend/           # FastAPI API server
│   └── api.py
├── auth/              # Authentication (login, register)
│   ├── login.py
│   └── register.py
├── database/          # MySQL database layer
│   ├── connection.py
│   ├── queries.py
│   └── schema.sql
├── utils/             # Utilities (password hashing)
│   └── hashing.py
├── tools/             # Admin scripts
│   ├── init_remote_db.py
│   └── list_users.py
├── frontend/          # React Mobile UI (Vite + Tailwind)
│   ├── src/
│   │   ├── app/screens/   # All app screens
│   │   ├── lib/api.ts     # API client
│   │   └── styles/        # CSS themes
│   ├── package.json
│   └── vite.config.ts
├── requirements.txt   # Python dependencies
└── README.md
```

## How to Run Locally

### 1. Start the Backend

```bash
cd "Expenses Tracker"
.\venv\Scripts\Activate.ps1
uvicorn backend.api:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Start the Frontend

```bash
cd "Expenses Tracker\frontend"
npm install
npm run dev
```

### 3. Open the App

Open **http://localhost:5173/** in your browser.

> **Note:** Both servers must be running at the same time.

## Environment Variables

Create a `.env` file in the project root with your database credentials:

```env
DB_HOST=your_host
DB_PORT=your_port
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
```

## Tech Stack

- **Backend:** Python, FastAPI, MySQL
- **Frontend:** React, Vite, Tailwind CSS, Recharts
- **Database:** MySQL (Aiven cloud or local)
