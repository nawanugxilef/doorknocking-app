from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.middleware.auth import get_current_user, require_role

router = APIRouter()

# ── PERSON D: Add announcement endpoints here ─────────────────────────────────
# See households/router.py for a complete working example to follow.
#
# Suggested endpoints:
#
#   GET /
#     - List all announcements, pinned first (any logged-in user)
#
#   POST /
#     - Create announcement (coordinator/admin only)
#     - created_by comes from JWT token (current_user.id)
#
#   DELETE /{announcement_id}
#     - Admin only
# ──────────────────────────────────────────────────────────────────────────────
