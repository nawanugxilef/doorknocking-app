from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.features.visits.router      import router as visits_router
from app.features.households.router  import router as households_router
from app.features.tasks.router       import router as tasks_router
from app.features.users.router       import router as users_router
from app.features.announcements.router import router as announcements_router
from app.features.sync.router        import router as sync_router

app = FastAPI(title="Doorknocking PWA API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(visits_router,       prefix="/api/visits",       tags=["visits"])
app.include_router(households_router,   prefix="/api/households",   tags=["households"])
app.include_router(tasks_router,        prefix="/api/tasks",        tags=["tasks"])
app.include_router(users_router,        prefix="/api/users",        tags=["users"])
app.include_router(announcements_router,prefix="/api/announcements",tags=["announcements"])
app.include_router(sync_router,         prefix="/api/sync",         tags=["sync"])

@app.get("/")
def health():
    return {"status": "ok", "app": "Doorknock PWA API"}
