from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

# TODO: define visits request/response schemas

class VisitsOut(BaseModel):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
