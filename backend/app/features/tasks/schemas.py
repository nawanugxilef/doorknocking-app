from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

# TODO: define tasks request/response schemas

class TasksOut(BaseModel):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
