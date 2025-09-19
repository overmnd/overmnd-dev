from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class CreateFindingIn(BaseModel):
    category: str
    risk_score: int = Field(ge=0, le=100)
    severity: str | None = Field(default="medium")
    evidence_json: dict[str, Any] = Field(default_factory=dict)


class FindingOut(BaseModel):
    id: int
    tenant_id: int
    category: str
    severity: str
    risk_score: int
    evidence_json: dict[str, Any]
    status: str
    first_seen_at: datetime
    last_seen_at: datetime

    class Config:
        from_attributes = True  # pydantic v2: allow ORM -> model
