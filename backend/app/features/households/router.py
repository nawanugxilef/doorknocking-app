import csv, io
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.middleware.auth import get_current_user, require_role
from app.features.households import service
from app.features.households.schemas import HouseholdCreate, HouseholdUpdate, HouseholdOut

router = APIRouter()


@router.get("/", response_model=list[HouseholdOut])
def list_households(
    db: Session = Depends(get_db),
    _=Depends(get_current_user),          # any logged-in user
):
    return service.get_all_households(db)


@router.get("/{household_id}", response_model=HouseholdOut)
def get_household(
    household_id: UUID,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    return service.get_household_by_id(db, household_id)


@router.post("/", response_model=HouseholdOut, status_code=201)
def create_household(
    body: HouseholdCreate,
    db: Session = Depends(get_db),
    _=Depends(require_role("admin", "volunteer_coordinator")),
):
    return service.create_household(db, body)


@router.patch("/{household_id}", response_model=HouseholdOut)
def update_household(
    household_id: UUID,
    body: HouseholdUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    return service.update_household(db, household_id, body)


@router.delete("/{household_id}", status_code=204)
def delete_household(
    household_id: UUID,
    db: Session = Depends(get_db),
    _=Depends(require_role("admin")),
):
    service.delete_household(db, household_id)


# ── PERSON B: Complete this endpoint ──────────────────────────────────────────
@router.post("/import/csv", response_model=list[HouseholdOut], status_code=201)
def import_households_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _=Depends(require_role("admin", "volunteer_coordinator")),
):
    """
    Upload a CSV with columns: address, suburb, postcode, lat (optional), lng (optional)
    TODO (Person B): Add row-level validation, duplicate detection, error reporting.
    """
    content = file.file.read().decode("utf-8")
    reader  = csv.DictReader(io.StringIO(content))
    rows    = list(reader)
    return service.bulk_create_from_csv(db, rows)
