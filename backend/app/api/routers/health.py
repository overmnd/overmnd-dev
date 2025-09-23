from fastapi import APIRouter
from sqlalchemy import text
from app.core.config import settings
from app.db.session import engine

router = APIRouter(tags=["health"])

@router.get("/health")
def health():
    db_ok = False
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            db_ok = True
    except Exception:
        db_ok = False
    return {"status": "ok", "version": "0.1.0", "database_ok": db_ok}
