from __future__ import annotations

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, get_current_user
from app.db.base import get_db
from app.models.tenant import Tenant  # if you have a Tenant model defined
from app.models.user import User
from app.schemas.auth import LoginRequest, MeResponse, RegisterRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    # Is this email taken?
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        # Same behavior you observed earlier
        raise HTTPException(status_code=400, detail="Email already registered")

    # Very simple defaulting: put new users under the first tenant if you don’t
    # have a UI/flow yet. Adjust as your business rules evolve.
    tenant = db.query(Tenant).order_by(Tenant.id.asc()).first()
    if not tenant:
        # create a default tenant if db was emptied
        tenant = Tenant(display_name="Default", primary_domain="example.com", plan_tier="standard")
        db.add(tenant)
        db.flush()

    pwd_hash = bcrypt.hashpw(payload.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    user = User(
        tenant_id=tenant.id,
        email=payload.email.lower().strip(),
        password_hash=pwd_hash,
        role="member",
        status="active",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.email, tenant_id=user.tenant_id)
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user or user.status != "active":
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.password_hash:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    good = bcrypt.checkpw(payload.password.encode("utf-8"), user.password_hash.encode("utf-8"))
    if not good:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(subject=user.email, tenant_id=user.tenant_id)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=MeResponse)
def me(current_user: User = Depends(get_current_user)) -> MeResponse:
    return MeResponse(
        id=current_user.id,
        email=current_user.email,
        tenant_id=current_user.tenant_id,
        role=current_user.role,
        status=current_user.status,
    )
