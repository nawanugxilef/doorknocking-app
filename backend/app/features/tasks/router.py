from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.middleware.auth import get_current_user, require_role

router = APIRouter()

# ── PERSON D: Add task endpoints here ─────────────────────────────────────────
# See households/router.py for a complete working example to follow.
#
# Suggested endpoints:
#
#   POST /
#     - Coordinator/admin creates a task and optionally assigns it to a doorknocker
#     - created_by comes from the JWT token (current_user.id)
#
#   GET /
#     - All tasks (admin + coordinator)
#
#   GET /mine
#     - My assigned tasks (doorknocker)
#
#   PATCH /{task_id}
#     - Update status, notes, etc. (assignee or admin)
#
#   DELETE /{task_id}
#     - Admin only
# ──────────────────────────────────────────────────────────────────────────────
