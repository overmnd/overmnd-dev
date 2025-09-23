from datetime import datetime, timedelta, timezone
from typing import Any, Dict
from jose import jwt

from app.core.config import settings

ALGORITHM = "HS256"

def _expiry(minutes: int = 15) -> datetime:
    return datetime.now(timezone.utc) + timedelta(minutes=minutes)

def create_access_token(subject: str, extra: Dict[str, Any] | None = None) -> str:
    payload: Dict[str, Any] = {"sub": subject, "type": "access", "exp": _expiry(settings.JWT_ACCESS_MINUTES)}
    if extra:
        payload.update(extra)
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=ALGORITHM)

def create_refresh_token(subject: str, days: int | None = None) -> str:
    if days is None:
        days = settings.JWT_REFRESH_DAYS
    exp = datetime.now(timezone.utc) + timedelta(days=days)
    payload: Dict[str, Any] = {"sub": subject, "type": "refresh", "exp": exp}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=ALGORITHM)
