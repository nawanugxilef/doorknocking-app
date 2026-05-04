from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

# TODO: define households request/response schemas

class HouseholdsOut(BaseModel):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
