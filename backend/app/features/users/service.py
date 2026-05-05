from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.features.users.models import User
from app.features.users.schemas import UserCreate, UserLogin
from app.core.security import hash_password, verify_password, create_access_token

def register_user(db: Session, data: UserCreate) -> User:
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role=data.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def login_user(db: Session, data: UserLogin) -> dict:
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}

def get_all_users(db: Session) -> list[User]:
    return db.query(User).all()

def get_doorknockers(db: Session) -> list[User]:
    from app.features.users.models import RoleEnum
    return db.query(User).filter(User.role == RoleEnum.doorknocker).all()
