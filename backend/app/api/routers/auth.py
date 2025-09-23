from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from jose import jwt, JWTError

from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import verify_password, get_password_hash
from app.core.jwt import create_access_token, create_refresh_token, ALGORITHM
from app.core.config import settings
from app.schemas.auth import LoginRequest, RegisterRequest, TokenPair, RefreshRequest

router = APIRouter(prefix="/v1/auth", tags=["auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=TokenPair)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    user = User(email=payload.email, hashed_password=get_password_hash(payload.password), is_active=True)
    db.add(user)
    db.commit()
    db.refresh(user)
    sub = str(user.id)
    return TokenPair(
        access_token=create_access_token(sub),
        refresh_token=create_refresh_token(sub),
    )

@router.post("/login", response_model=TokenPair)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if not user or not getattr(user, "is_active", True):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    sub = str(user.id)
    return TokenPair(
        access_token=create_access_token(sub),
        refresh_token=create_refresh_token(sub),
    )

@router.post("/refresh", response_model=TokenPair)
def refresh(payload: RefreshRequest):
    try:
        data = jwt.decode(payload.refresh_token, settings.JWT_SECRET, algorithms=[ALGORITHM])
        if data.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not a refresh token")
        sub = data.get("sub")
        if not sub:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing subject")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return TokenPair(
        access_token=create_access_token(sub),
        refresh_token=create_refresh_token(sub),
    )
