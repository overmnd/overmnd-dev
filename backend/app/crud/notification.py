# backend/app/crud/notification.py
from __future__ import annotations

from sqlalchemy.orm import Session

from app.models.notification import Notification


def list_for_user(db: Session, user_id: int) -> list[Notification]:
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )


def create_for_user(
    db: Session,
    *,
    user_id: int,
    kind: str,
    title: str,
    body: str | None = None,
) -> Notification:
    n = Notification(user_id=user_id, kind=kind, title=title, body=body, read=False)
    db.add(n)
    db.commit()
    db.refresh(n)
    return n


def mark_read(db: Session, user_id: int, notif_id: int) -> bool:
    """
    UPDATE-style write avoids the Pylance 'assign to Column' warning.
    """
    q = db.query(Notification).filter(
        Notification.id == notif_id,
        Notification.user_id == user_id,
        Notification.read.is_(False),
    )
    updated = q.update({Notification.read: True}, synchronize_session=False)
    db.commit()
    return bool(updated)


def mark_all_read(db: Session, user_id: int) -> int:
    q = db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.read.is_(False),
    )
    count = q.update({Notification.read: True}, synchronize_session=False)
    db.commit()
    return int(count)
