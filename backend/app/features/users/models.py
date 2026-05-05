import uuid, datetime, enum
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class RoleEnum(str, enum.Enum):
    admin                 = "admin"
    volunteer_coordinator = "volunteer_coordinator"
    doorknocker           = "doorknocker"

class User(Base):
    __tablename__ = "users"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name          = Column(String(100), nullable=False)
    email         = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role          = Column(Enum(RoleEnum), nullable=False, default=RoleEnum.doorknocker)
    created_at    = Column(DateTime, default=datetime.datetime.utcnow)
