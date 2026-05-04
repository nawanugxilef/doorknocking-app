# Doorknock PWA

A purpose-built Progressive Web App for managing community doorknocking campaigns in Queensland.

## Roles
- **Admin** — full access
- **Volunteer Coordinator** — same as admin, cannot delete users
- **Doorknocker** — view tasks, log visits, offline support

## Stack
- Frontend: React + TailwindCSS + Vite (PWA)
- Backend: Python FastAPI
- Database: PostgreSQL
- Offline: IndexedDB via Dexie

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # fill in your values
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env          # fill in your values
npm run dev
```

## Branches
- `main` — stable, production
- `dev` — active development, merge here first
- `frontend/feature-name`
- `backend/feature-name`

## Team
- Felix
- Linh
- William
- Martin
