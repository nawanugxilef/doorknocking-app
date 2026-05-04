from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.middleware.auth import get_current_user

router = APIRouter()

# TODO: add households endpoints
