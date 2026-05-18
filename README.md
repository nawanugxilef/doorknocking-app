# Doorknock PWA

A Progressive Web App for managing community doorknocking campaigns in Queensland.

## Roles
| Role | Can do |
|---|---|
| **Admin** | Full access — manage users, households, visits, tasks, announcements |
| **Volunteer Coordinator** | Same as Admin except cannot delete users |
| **Doorknocker** | View tasks, log visits, see households — offline support |

## Stack
| Layer | Technology |
|---|---|
| Frontend | TailwindCSS  |
| Backend | Java Spring Boot |
| Database | PostgreSQL |
| Offline | IndexedDB via Dexie |
| Auth | JWT (python-jose) + bcrypt |

---

## Team Split (A / B / C / D)

> ⚠️ **Person A must finish first.** Everyone else's backend endpoints need the JWT auth middleware from Person A's feature.

| Person | Feature | Backend path | Frontend path |
|---|---|---|---|
| **Person A** | Auth + Users | `backend/app/features/users/` | `frontend/src/features/users/` |
| **Person B** | Households + CSV Import | `backend/app/features/households/` | `frontend/src/features/households/` |
| **Person C** | Visits + Offline Sync | `backend/app/features/visits/` | `frontend/src/features/visits/` |
| **Person D** | Tasks + Announcements | `backend/app/features/tasks/` + `announcements/` | `frontend/src/features/tasks/` + `announcements/` |

Each person works **end-to-end** on their feature — both frontend and backend.

### What's already built (use as your reference)
- **Person A (Users)** — `users/` is a **complete, working example**. Study it before building your own feature.
- **Person B (Households)** — `households/` is a **complete, working example**. This is what a finished feature looks like.

### What needs to be built
Search for `TODO (Person X)` comments in your feature folder — they tell you exactly what to implement.

---

## Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/nawanugxilef/doorknocking-app.git
cd doorknocking-app
git checkout dev
```

### 2. Backend setup
```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env           # then edit .env with your database URL + secret key
alembic upgrade head           # create database tables
python seed.py                 # populate sample data
uvicorn app.main:app --reload  # start the API
```
API will be at: http://localhost:8000  
API docs at: http://localhost:8000/docs

### 3. Frontend setup
```bash
cd frontend
npm install
cp .env.example .env           # set VITE_API_BASE_URL=http://localhost:8000/api
npm run dev
```
App will be at: http://localhost:5173

### 4. Default login (after running seed.py)
| Role | Email | Password |
|---|---|---|
| Admin | felix@dk.app | password123 |
| Coordinator | coord@dk.app | password123 |
| Doorknocker | personc@dk.app | password123 |

---

## Git Workflow

### Branches
- `main` — stable, production only
- `dev` — active development, **everyone merges here first**
- Feature branches: `feature/person-b-households`, `feature/person-c-visits`, etc.

### Daily workflow
```bash
# Start your day
git checkout dev && git pull origin dev

# Create your branch (once)
git checkout -b feature/person-b-households

# Save your work
git add .
git commit -m "feat: add household list endpoint"
git push origin feature/person-b-households

# When your feature is ready, open a Pull Request into dev
# Never push directly to main or dev
```

### Avoiding merge conflicts
- **Never edit another person's feature folder**
- If you need a shared component, add it to `frontend/src/shared/` and open a PR
- If you need a shared utility, add it to `backend/app/shared/`
- Database schema changes (`alembic/`) — coordinate with the team before creating a new migration

---

## Project Structure

```
doorknocking-app/
├── backend/
│   ├── app/
│   │   ├── features/          # One folder per feature
│   │   │   ├── users/         # Person A — COMPLETE (reference)
│   │   │   ├── households/    # Person B — COMPLETE (reference)
│   │   │   ├── visits/        # Person C — TODO
│   │   │   ├── tasks/         # Person D — TODO
│   │   │   └── announcements/ # Person D — TODO
│   │   ├── core/              # DB, config, security
│   │   └── middleware/        # JWT auth, role guard
│   ├── alembic/               # Database migrations
│   ├── seed.py                # Sample data
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── features/          # One folder per feature (mirrors backend)
        │   ├── users/         # Person A
        │   ├── households/    # Person B — COMPLETE (reference)
        │   ├── visits/        # Person C — TODO
        │   ├── tasks/         # Person D — TODO
        │   └── announcements/ # Person D — TODO
        ├── shared/            # Reusable components + hooks
        ├── offline/           # IndexedDB + sync queue
        ├── store/             # Zustand (auth, sync state)
        └── api/               # Axios client
```
