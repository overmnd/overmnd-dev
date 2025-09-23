from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Read .env; ignore extra keys so legacy names don't crash
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Canonical uppercase names (match .env we suggested)
    DATABASE_URL: str = Field(default="sqlite:///./dev.db")
    JWT_SECRET: str = Field(default="CHANGE_ME")
    JWT_ACCESS_MINUTES: int = Field(default=30)
    JWT_REFRESH_DAYS: int = Field(default=7)
    BACKEND_CORS_ORIGINS: Union[str, List[str]] = Field(default="")

    # ---- Backward-compat attribute accessors (lowercase) ----
    @property
    def database_url(self) -> str:
        return self.DATABASE_URL

    @property
    def jwt_secret(self) -> str:
        return self.JWT_SECRET

    @property
    def jwt_access_minutes(self) -> int:
        return self.JWT_ACCESS_MINUTES

    @property
    def jwt_refresh_days(self) -> int:
        return self.JWT_REFRESH_DAYS

    @property
    def backend_cors_origins(self) -> List[str]:
        # Return normalized list form
        return self.cors_origins_list()

    # ---- Helpers ----
    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def _normalize_cors(cls, v):
        if isinstance(v, list):
            return v
        if not v:
            return []
        return [x.strip() for x in str(v).split(",") if x.strip()]

    def cors_origins_list(self) -> List[str]:
        return self.BACKEND_CORS_ORIGINS if isinstance(self.BACKEND_CORS_ORIGINS, list) else []

settings = Settings()
