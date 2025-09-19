# Re-export the health router cleanly so imports pass lints.
from app.api.health import router as router

__all__ = ["router"]
