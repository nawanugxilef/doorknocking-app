from sqlalchemy.orm import Session
from fastapi import HTTPException
from uuid import UUID

from app.features.households.models import Household
from app.features.households.schemas import HouseholdCreate, HouseholdUpdate


def get_all_households(db: Session) -> list[Household]:
    return db.query(Household).order_by(Household.suburb, Household.address).all()


def get_household_by_id(db: Session, household_id: UUID) -> Household:
    hh = db.query(Household).filter(Household.id == household_id).first()
    if not hh:
        raise HTTPException(status_code=404, detail="Household not found")
    return hh


def create_household(db: Session, data: HouseholdCreate) -> Household:
    hh = Household(**data.model_dump())
    db.add(hh)
    db.commit()
    db.refresh(hh)
    return hh


def update_household(db: Session, household_id: UUID, data: HouseholdUpdate) -> Household:
    hh = get_household_by_id(db, household_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(hh, field, value)
    db.commit()
    db.refresh(hh)
    return hh


def delete_household(db: Session, household_id: UUID) -> None:
    hh = get_household_by_id(db, household_id)
    db.delete(hh)
    db.commit()


def bulk_create_from_csv(db: Session, rows: list[dict]) -> list[Household]:
    """
    Bulk-create households from parsed CSV rows.
    Expected columns: address, suburb, postcode, lat (optional), lng (optional)
    TODO (Person B): Add duplicate detection, per-row error reporting.
    """
    created = []
    for row in rows:
        hh = Household(
            address  = row.get("address", "").strip(),
            suburb   = row.get("suburb", "").strip(),
            postcode = row.get("postcode", "").strip(),
            lat      = float(row["lat"]) if row.get("lat") else None,
            lng      = float(row["lng"]) if row.get("lng") else None,
        )
        db.add(hh)
        created.append(hh)
    db.commit()
    for hh in created:
        db.refresh(hh)
    return created
