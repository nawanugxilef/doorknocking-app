from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

# TODO: define users request/response schemas

class UsersOut(BaseModel):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
