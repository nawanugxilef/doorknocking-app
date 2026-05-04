from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

# TODO: define announcements request/response schemas

class AnnouncementsOut(BaseModel):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
