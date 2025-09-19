from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel

Kind = Literal["info", "success", "warning", "error"]


class NotificationCreate(BaseModel):
    title: str
    body: str | None = None
    kind: Kind = "info"


class NotificationOut(BaseModel):
    id: int
    title: str
    body: str | None
    kind: Kind
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True
