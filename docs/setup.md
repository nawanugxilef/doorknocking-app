# Local Setup Guide

## Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL 15+

## 1. Clone the repo
```bash
git clone https://github.com/YOUR_ORG/doorknock.git
cd doorknock
```

## 2. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env — set DATABASE_URL and SECRET_KEY
alembic upgrade head            # run DB migrations
uvicorn app.main:app --reload   # starts on http://localhost:8000
# API docs at http://localhost:8000/docs
```

## 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env — set VITE_API_BASE_URL=http://localhost:8000/api
npm run dev                     # starts on http://localhost:5173
```

## 4. Test credentials (seed data)
| Role | Username | Password |
|------|----------|----------|
| Admin | admin1 | password |
| Volunteer | volunteer1 | password |
