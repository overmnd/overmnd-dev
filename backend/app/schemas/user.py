from __future__ import annotations

from typing import Any

from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str | None = None
    role: str
    preferences: dict[str, Any] = {}

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: str | None = None
    role: str | None = None
    preferences: dict[str, Any] | None = None


class InviteIn(BaseModel):
    email: EmailStr
    role: str = "member"


class InviteOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    status: str

    class Config:
        from_attributes = True


class PreferencesIn(BaseModel):
    preferences: dict[str, Any]
