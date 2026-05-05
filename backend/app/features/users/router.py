from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.middleware.auth import get_current_user, require_role
from app.features.users import service
from app.features.users.schemas import UserCreate, UserLogin, UserOut, TokenOut

router = APIRouter()

@router.post("/login", response_model=TokenOut)
def login(data: UserLogin, db: Session = Depends(get_db)):
    return service.login_user(db, data)

@router.post("/register", response_model=UserOut, status_code=201)
def register(data: UserCreate, db: Session = Depends(get_db)):
    return service.register_user(db, data)

@router.get("/me", response_model=UserOut)
def me(current_user=Depends(get_current_user)):
    return current_user

@router.get("/", response_model=list[UserOut])
def list_users(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin", "volunteer_coordinator")),
):
    return service.get_all_users(db)

@router.get("/doorknockers", response_model=list[UserOut])
def list_doorknockers(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin", "volunteer_coordinator")),
):
    return service.get_doorknockers(db)

# ── PERSON A: extend this file ─────────────────────────────────
# TODO (Person A): PATCH /users/{id} — update user
# TODO (Person A): DELETE /users/{id} — admin only
# TODO (Person A): GET /users/{id} — get single user
