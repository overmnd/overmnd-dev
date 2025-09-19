# backend/app/crud/user.py
from __future__ import annotations

import builtins
from typing import Any

from sqlalchemy.orm import Session

from app.models.user import User


def list(db: Session) -> builtins.list[User]:
    return db.query(User).order_by(User.id.asc()).all()


def get(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def update(db: Session, user_id: int, data: dict[str, Any]) -> User | None:
    user = get(db, user_id)
    if not user:
        return None

    for k, v in data.items():
        # Keep it safe: only allow a curated set if you prefer.
        setattr(user, k, v)

    db.add(user)
    db.commit()
    db.refresh(user)
    return user
