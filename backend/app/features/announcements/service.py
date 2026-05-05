from sqlalchemy.orm import Session
from uuid import UUID

# ── PERSON D: Implement this file ─────────────────────────────────────────────
# Follow the same pattern as households/service.py — it's your reference.
#
# Functions to implement:
#
#   create_announcement(db, data: AnnouncementCreate, created_by: UUID) -> Announcement
#   get_all_announcements(db) -> list[Announcement]
#     - Pinned ones first, then newest
#   delete_announcement(db, announcement_id: UUID) -> None
# ──────────────────────────────────────────────────────────────────────────────


def create_announcement(db: Session, data, created_by: UUID):
    raise NotImplementedError("TODO (Person D): implement create_announcement")


def get_all_announcements(db: Session):
    raise NotImplementedError("TODO (Person D): implement get_all_announcements")


def delete_announcement(db: Session, announcement_id: UUID):
    raise NotImplementedError("TODO (Person D): implement delete_announcement")
