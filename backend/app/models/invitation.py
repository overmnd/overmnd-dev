# backend/app/models/invitation.py
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Invitation(Base):
    __tablename__ = "invitations"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, index=True)
    role = Column(String(50), nullable=False, default="user")

    token = Column(String(255), unique=True, nullable=False, index=True)
    status = Column(
        String(32), nullable=False, default="pending"
    )  # pending|accepted|revoked|expired

    invited_by = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    inviter = relationship("User", back_populates="invites_sent", foreign_keys=[invited_by])
