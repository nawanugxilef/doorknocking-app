from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
import enum


class OutcomeEnum(str, enum.Enum):
    answered = "answered"
    not_home = "not_home"
    refused  = "refused"
    callback = "callback"


class VisitCreate(BaseModel):
    household_id: UUID
    outcome:      OutcomeEnum
    notes:        str = ""
    visited_at:   Optional[datetime] = None
    client_id:    Optional[str] = None    # offline dedup key


class VisitOut(BaseModel):
    id:           UUID
    household_id: UUID
    volunteer_id: UUID
    outcome:      OutcomeEnum
    notes:        str
    visited_at:   datetime
    client_id:    Optional[str]
    created_at:   datetime

    class Config:
        from_attributes = True

# TODO (Person C): Add VisitUpdate schema if needed
