from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.middleware.auth import get_current_user, require_role

router = APIRouter()

# ── PERSON C: Add visit endpoints here ────────────────────────────────────────
# See households/router.py for a complete working example to follow.
#
# Suggested endpoints:
#
#   POST /
#     - Any doorknocker can log a visit
#     - volunteer_id comes from the JWT token (current_user.id)
#     - Call service.create_visit(db, body, current_user.id)
#
#   GET /mine
#     - Returns visits logged by the current user
#     - Call service.get_my_visits(db, current_user.id)
#
#   GET /household/{household_id}
#     - Returns all visits for one household
#     - Any logged-in user
#
#   GET /
#     - Returns all visits (admin + coordinator only)
# ──────────────────────────────────────────────────────────────────────────────
