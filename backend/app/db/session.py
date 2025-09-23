from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from ..core.config import settings

if not settings.database_url:
    raise RuntimeError("DATABASE_URL is not set")

engine = create_engine(settings.database_url, pool_pre_ping=True, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
