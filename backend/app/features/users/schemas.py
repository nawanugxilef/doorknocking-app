from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from app.features.users.models import RoleEnum

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: RoleEnum = RoleEnum.doorknocker

class UserOut(BaseModel):
    id: UUID
    name: str
    email: str
    role: RoleEnum
    created_at: datetime
    class Config:
        from_attributes = True

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
