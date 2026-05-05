from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
import enum


class TaskStatus(str, enum.Enum):
    pending     = "pending"
    in_progress = "in_progress"
    done        = "done"


class TaskPriority(str, enum.Enum):
    low    = "low"
    medium = "medium"
    high   = "high"


class TaskCreate(BaseModel):
    title:       str
    description: str = ""
    priority:    TaskPriority = TaskPriority.medium
    assigned_to: Optional[UUID] = None
    due_date:    Optional[datetime] = None


class TaskUpdate(BaseModel):
    title:       Optional[str]          = None
    description: Optional[str]          = None
    status:      Optional[TaskStatus]   = None
    priority:    Optional[TaskPriority] = None
    assigned_to: Optional[UUID]         = None
    due_date:    Optional[datetime]     = None


class TaskOut(BaseModel):
    id:          UUID
    title:       str
    description: str
    status:      TaskStatus
    priority:    TaskPriority
    assigned_to: Optional[UUID]
    created_by:  UUID
    due_date:    Optional[datetime]
    created_at:  datetime

    class Config:
        from_attributes = True
