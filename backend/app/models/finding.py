from __future__ import annotations

from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, text
from sqlalchemy.orm import relationship

from app.db.base import Base


class Finding(Base):
    __tablename__ = "findings"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)

    category = Column(String, nullable=False)
    severity = Column(String, nullable=False, default="medium")
    risk_score = Column(Integer, nullable=False)
    evidence_json = Column(JSON, nullable=False, default=dict)
    status = Column(String, nullable=False, default="open")

    first_seen_at = Column(DateTime(timezone=True), server_default=text("now()"))
    last_seen_at = Column(DateTime(timezone=True), server_default=text("now()"))

    tenant = relationship("Tenant", back_populates="findings")
