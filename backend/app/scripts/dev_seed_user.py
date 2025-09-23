import argparse
from typing import Any
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.session import SessionLocal, engine
try:
    # Base import ensures metadata is available for create_all
    from app.db.base import Base  # type: ignore
except Exception as e:  # fallback if project structure differs
    Base = None  # type: ignore

from app.core.security import get_password_hash
try:
    from app.models.user import User  # type: ignore
except Exception as e:
    raise SystemExit(f"Cannot import app.models.user: {e}")

def ensure_schema():
    if Base is not None:
        try:
            Base.metadata.create_all(bind=engine)
        except Exception as e:
            print(f"[warn] create_all failed: {e}")

def upsert_user(db: Session, email: str, password: str, superuser: bool) -> Any:
    # lookup by email
    stmt = select(User).where(getattr(User, "email") == email)
    inst = db.scalar(stmt)
    if inst:
        print(f"[ok] user already exists: {email}")
        return inst

    inst = User()
    # set common fields if they exist on the model
    if hasattr(User, "email"):
        setattr(inst, "email", email)
    hashed = get_password_hash(password)
    if hasattr(User, "hashed_password"):
        setattr(inst, "hashed_password", hashed)
    elif hasattr(User, "password_hash"):
        setattr(inst, "password_hash", hashed)
    if hasattr(User, "is_active"):
        setattr(inst, "is_active", True)
    if hasattr(User, "is_superuser"):
        setattr(inst, "is_superuser", bool(superuser))
    if hasattr(User, "full_name"):
        setattr(inst, "full_name", "Dev Admin")
    db.add(inst)
    db.commit()
    db.refresh(inst)
    print(f"[ok] created user: {email}")
    return inst

def main():
    p = argparse.ArgumentParser(description="Seed a dev user into the database.")
    p.add_argument("--email", required=True)
    p.add_argument("--password", required=True)
    p.add_argument("--superuser", action="store_true")
    args = p.parse_args()

    ensure_schema()
    with SessionLocal() as db:
        upsert_user(db, args.email, args.password, args.superuser)

if __name__ == "__main__":
    main()
