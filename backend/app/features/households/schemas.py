from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
import enum


class HouseholdStatus(str, enum.Enum):
    not_visited  = "not_visited"
    visited      = "visited"
    callback     = "callback"
    do_not_knock = "do_not_knock"


class HouseholdCreate(BaseModel):
    address:  str
    suburb:   str
    postcode: str
    notes:    str = ""
    lat:      Optional[float] = None
    lng:      Optional[float] = None


class HouseholdUpdate(BaseModel):
    address:  Optional[str]             = None
    suburb:   Optional[str]             = None
    postcode: Optional[str]             = None
    notes:    Optional[str]             = None
    status:   Optional[HouseholdStatus] = None
    lat:      Optional[float]           = None
    lng:      Optional[float]           = None


class HouseholdOut(BaseModel):
    id:         UUID
    address:    str
    suburb:     str
    postcode:   str
    notes:      str
    status:     HouseholdStatus
    lat:        Optional[float]
    lng:        Optional[float]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
