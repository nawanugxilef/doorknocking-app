import uuid, datetime, enum
from sqlalchemy import Column, String, DateTime, Float, Enum, Text
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class HouseholdStatus(str, enum.Enum):
    not_visited  = "not_visited"
    visited      = "visited"
    callback     = "callback"
    do_not_knock = "do_not_knock"


class Household(Base):
    __tablename__ = "households"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    address    = Column(String(255), nullable=False)
    suburb     = Column(String(100), nullable=False)
    postcode   = Column(String(10),  nullable=False)
    notes      = Column(Text, default="")
    status     = Column(Enum(HouseholdStatus), nullable=False, default=HouseholdStatus.not_visited)
    lat        = Column(Float, nullable=True)
    lng        = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Uncomment when Visit model is ready (Person C):
    # visits = relationship("Visit", back_populates="household")
