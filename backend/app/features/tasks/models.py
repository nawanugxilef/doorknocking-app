import uuid, datetime, enum
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class TaskStatus(str, enum.Enum):
    pending     = "pending"
    in_progress = "in_progress"
    done        = "done"


class TaskPriority(str, enum.Enum):
    low    = "low"
    medium = "medium"
    high   = "high"


class Task(Base):
    __tablename__ = "tasks"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title       = Column(String(255), nullable=False)
    description = Column(Text, default="")
    status      = Column(Enum(TaskStatus),   nullable=False, default=TaskStatus.pending)
    priority    = Column(Enum(TaskPriority), nullable=False, default=TaskPriority.medium)
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_by  = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    due_date    = Column(DateTime, nullable=True)
    created_at  = Column(DateTime, default=datetime.datetime.utcnow)
