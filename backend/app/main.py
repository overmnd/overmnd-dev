from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routers.health import router as health_router
from app.api.routers.auth import router as auth_router

app = FastAPI(title="OVERMND API")

origins = settings.cors_origins_list()
if origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Mount routers at root
app.include_router(health_router)
app.include_router(auth_router)

# Also mount under /api to satisfy frontends that call /api/*
app.include_router(health_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
