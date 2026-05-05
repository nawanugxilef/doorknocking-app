from sqlalchemy.orm import Session
from uuid import UUID

# ── PERSON D: Implement this file ─────────────────────────────────────────────
# Follow the same pattern as households/service.py — it's your reference.
#
# Functions to implement:
#
#   create_task(db, data: TaskCreate, created_by: UUID) -> Task
#   get_all_tasks(db) -> list[Task]
#   get_my_tasks(db, user_id: UUID) -> list[Task]   (tasks assigned to me)
#   update_task(db, task_id: UUID, data: TaskUpdate) -> Task
#   delete_task(db, task_id: UUID) -> None
# ──────────────────────────────────────────────────────────────────────────────


def create_task(db: Session, data, created_by: UUID):
    raise NotImplementedError("TODO (Person D): implement create_task")


def get_all_tasks(db: Session):
    raise NotImplementedError("TODO (Person D): implement get_all_tasks")


def get_my_tasks(db: Session, user_id: UUID):
    raise NotImplementedError("TODO (Person D): implement get_my_tasks")


def update_task(db: Session, task_id: UUID, data):
    raise NotImplementedError("TODO (Person D): implement update_task")


def delete_task(db: Session, task_id: UUID):
    raise NotImplementedError("TODO (Person D): implement delete_task")
