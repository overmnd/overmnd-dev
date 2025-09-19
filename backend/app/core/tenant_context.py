from __future__ import annotations

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.user import User


def with_tenant_context(db: Session, tenant: int | User) -> None:
    """
    Set the GUC app.current_tenant_id for the current transaction.
    Accepts either a tenant_id (int) or a User instance.
    """
    if isinstance(tenant, int):
        tid = tenant
    else:
        tid = tenant.tenant_id

    # Ensure there's an active transaction so SET LOCAL applies
    if not db.in_transaction():
        db.begin()

    db.execute(text("SET LOCAL app.current_tenant_id = :tid"), {"tid": tid})
