# backend/app/api/v1/notifications.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.security import get_current_user  # your existing dependency
from app.db.session import get_db
from app.models.notification import Notification
from app.models.user import User

router = APIRouter()  # IMPORTANT: no prefix here. Main mounts it at /api/v1/notifications


def _to_dict(n: Notification) -> dict:
    return {
        "id": n.id,
        "type": n.type,
        "title": n.title,
        "body": n.body,
        "payload": n.payload,
        "read": n.read,
        "created_at": n.created_at.isoformat() if n.created_at else None,
    }


@router.get("", status_code=200)
def list_notifications(
    only_unread: bool = Query(False),
    limit: int = Query(20, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[dict]:
    q = db.query(Notification).filter(Notification.user_id == current_user.id)
    if only_unread:
        q = q.filter(Notification.read.is_(False))
    items = q.order_by(Notification.created_at.desc()).offset(offset).limit(limit).all()
    return [_to_dict(n) for n in items]


@router.patch("/{notif_id}/read", status_code=200)
def mark_read(
    notif_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    n = (
        db.query(Notification)
        .filter(Notification.id == notif_id, Notification.user_id == current_user.id)
        .first()
    )
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    n.read = True
    db.add(n)
    db.commit()
    db.refresh(n)
    return _to_dict(n)


# (Optional) simple dev seeder to see the bell working quickly.
@router.post("/_seed", status_code=201)
def seed_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    samples = [
        Notification(
            user_id=current_user.id,
            type="tenant_missing_consent",
            title="Grant Microsoft consent",
            body="Your new tenant requires admin consent to finish setup.",
            payload={"tenant_id": "demo-123"},
        ),
        Notification(
            user_id=current_user.id,
            type="license_overspend",
            title="Potential license savings",
            body="You may save ~$230/mo by right-sizing unused licenses.",
            payload={"report": "license-optimizer"},
        ),
    ]
    for s in samples:
        db.add(s)
    db.commit()
    return {"created": len(samples)}
