from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class AnnouncementCreate(BaseModel):
    title:     str
    body:      str
    is_pinned: bool = False


class AnnouncementUpdate(BaseModel):
    title:     Optional[str]  = None
    body:      Optional[str]  = None
    is_pinned: Optional[bool] = None


class AnnouncementOut(BaseModel):
    id:         UUID
    title:      str
    body:       str
    is_pinned:  bool
    created_by: UUID
    created_at: datetime

    class Config:
        from_attributes = True
