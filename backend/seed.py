"""
Seed script — populate the database with sample data for development.

Usage:
    cd backend
    source venv/bin/activate
    python seed.py

This will create:
  - 1 admin user (Felix)
  - 1 volunteer coordinator
  - 2 doorknocker users
  - 10 sample households in Brisbane suburbs
"""

import sys, os
sys.path.append(os.path.dirname(__file__))

from app.core.database import SessionLocal, engine, Base
from app.features.users.models import User, RoleEnum
from app.features.households.models import Household, HouseholdStatus
from app.core.security import hash_password

# Create all tables (same as alembic upgrade head, but simpler for dev)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed_users():
    users = [
        {"name": "Felix (Admin)",      "email": "felix@dk.app",     "password": "password123", "role": RoleEnum.admin},
        {"name": "Coordinator",        "email": "coord@dk.app",     "password": "password123", "role": RoleEnum.volunteer_coordinator},
        {"name": "Person C (Doorknocker)", "email": "personc@dk.app", "password": "password123", "role": RoleEnum.doorknocker},
        {"name": "Person D (Doorknocker)", "email": "persond@dk.app", "password": "password123", "role": RoleEnum.doorknocker},
    ]
    created = []
    for u in users:
        existing = db.query(User).filter(User.email == u["email"]).first()
        if not existing:
            user = User(
                name          = u["name"],
                email         = u["email"],
                password_hash = hash_password(u["password"]),
                role          = u["role"],
            )
            db.add(user)
            created.append(u["email"])
    db.commit()
    print(f"✅ Users seeded: {created or 'already exist'}")


def seed_households():
    sample = [
        {"address": "12 Queen St",       "suburb": "Brisbane City", "postcode": "4000"},
        {"address": "45 George St",      "suburb": "Brisbane City", "postcode": "4000"},
        {"address": "7 Park Rd",         "suburb": "Milton",        "postcode": "4064"},
        {"address": "88 Coronation Dr",  "suburb": "Toowong",       "postcode": "4066"},
        {"address": "3 Rosalie St",      "suburb": "Paddington",    "postcode": "4064"},
        {"address": "22 Given Tce",      "suburb": "Paddington",    "postcode": "4064"},
        {"address": "5 Mollison St",     "suburb": "West End",      "postcode": "4101"},
        {"address": "101 Boundary St",   "suburb": "West End",      "postcode": "4101"},
        {"address": "14 Vulture St",     "suburb": "South Brisbane", "postcode": "4101"},
        {"address": "60 Melbourne St",   "suburb": "South Brisbane", "postcode": "4101"},
    ]
    count = db.query(Household).count()
    if count == 0:
        for h in sample:
            db.add(Household(**h))
        db.commit()
        print(f"✅ Households seeded: {len(sample)} records")
    else:
        print(f"⏭️  Households already exist ({count} records), skipping")


if __name__ == "__main__":
    print("🌱 Seeding database...")
    seed_users()
    seed_households()
    db.close()
    print("\n✨ Done! Default login:")
    print("   Admin:       felix@dk.app / password123")
    print("   Coordinator: coord@dk.app / password123")
    print("   Doorknocker: personc@dk.app / password123")
