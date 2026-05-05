from sqlalchemy.orm import Session
from uuid import UUID

# ── PERSON C: Implement this file ─────────────────────────────────────────────
# Follow the same pattern as households/service.py — it's your reference.
#
# Functions to implement:
#
#   create_visit(db, data: VisitCreate, volunteer_id: UUID) -> Visit
#     - Check if a Visit with the same client_id already exists (offline dedup)
#     - Create and return the new Visit
#     - Optionally update the household's status based on outcome
#
#   get_visits_by_household(db, household_id: UUID) -> list[Visit]
#     - Return all visits for a given household, newest first
#
#   get_my_visits(db, volunteer_id: UUID) -> list[Visit]
#     - Return visits logged by the current user, newest first, limit 50
#
#   get_all_visits(db) -> list[Visit]
#     - Return all visits (admin/coordinator only)
# ──────────────────────────────────────────────────────────────────────────────


def create_visit(db: Session, data, volunteer_id: UUID):
    raise NotImplementedError("TODO (Person C): implement create_visit")


def get_visits_by_household(db: Session, household_id: UUID):
    raise NotImplementedError("TODO (Person C): implement get_visits_by_household")


def get_my_visits(db: Session, volunteer_id: UUID):
    raise NotImplementedError("TODO (Person C): implement get_my_visits")


def get_all_visits(db: Session):
    raise NotImplementedError("TODO (Person C): implement get_all_visits")
