import uuid, datetime, enum
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class OutcomeEnum(str, enum.Enum):
    answered = "answered"
    not_home = "not_home"
    refused  = "refused"
    callback = "callback"


class Visit(Base):
    __tablename__ = "visits"

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    household_id = Column(UUID(as_uuid=True), ForeignKey("households.id"), nullable=False)
    volunteer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"),      nullable=False)
    outcome      = Column(Enum(OutcomeEnum), nullable=False)
    notes        = Column(Text, default="")
    visited_at   = Column(DateTime, default=datetime.datetime.utcnow)
    client_id    = Column(String, unique=True, nullable=True)   # offline dedup key
    created_at   = Column(DateTime, default=datetime.datetime.utcnow)

    # TODO (Person C): Add relationships once Household & User models are stable:
    # household = relationship("Household", back_populates="visits")
    # volunteer = relationship("User")
