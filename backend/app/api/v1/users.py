# backend/app/api/v1/users.py
from __future__ import annotations

import secrets
from datetime import datetime, timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.crud import user as user_crud
from app.db.session import get_db
from app.models.invitation import Invitation
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate  # keep your existing schemas

router = APIRouter(prefix="/api/v1/users", tags=["users"])


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user


@router.get("/", response_model=list[UserOut])
def list_users(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return user_crud.list(db)


@router.patch("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    body: UserUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    # Convert pydantic model to dict and drop unset fields.
    data: dict[str, Any] = body.model_dump(exclude_unset=True)  # type: ignore[attr-defined]
    updated = user_crud.update(db, user_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated


# ------------------ Invitations ------------------


class InviteIn(BaseModel):
    email: EmailStr
    role: str = "member"
    expires_in_days: int = 7


@router.post("/invite", response_model=dict, status_code=201)
def invite_user(
    body: InviteIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(days=body.expires_in_days)

    inv = Invitation(
        email=body.email,
        role=body.role,
        token=token,
        status="pending",
        invited_by=int(current_user.id),  # type: ignore[arg-type]
        expires_at=expires_at,
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)

    # TODO: emit audit event, send email, etc.
    return {"ok": True, "token": token, "expires_at": expires_at.isoformat()}


# ------------------ Preferences for /me ------------------


class PreferencesIn(BaseModel):
    data: dict[str, Any]


@router.post("/me/preferences", response_model=dict)
def save_preferences(
    prefs: PreferencesIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Safely coerce to a plain dict for typing tools
    existing: dict[str, Any] = {}
    raw = getattr(current_user, "preferences", None)
    if isinstance(raw, dict):
        existing = dict(raw)

    merged: dict[str, Any] = {**existing, **prefs.data}

    # Use setattr so we don't assign directly to a SQLAlchemy Column descriptor
    current_user.preferences = merged

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    # Optionally emit an audit event here

    return {"ok": True, "preferences": merged}
