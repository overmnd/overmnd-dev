from __future__ import annotations

from sqlalchemy import Column, ForeignKey, Integer, String, text
from sqlalchemy.orm import relationship

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)

    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)

    # Add these if they’re not present yet:
    role = Column(
        String, nullable=False, server_default=text("'member'")
    )  # or 'owner' for seeded user
    status = Column(
        String, nullable=False, server_default=text("'active'")
    )  # <- this is the key one

    tenant = relationship("Tenant", back_populates="users")
