# alembic/env.py (root)
import os
import sys
from logging.config import fileConfig
from pathlib import Path

from alembic import context
from sqlalchemy import engine_from_config, pool

# --- Make backend importable ---
PROJECT_ROOT = Path(__file__).resolve().parent.parent  # repo root
BACKEND_DIR = PROJECT_ROOT / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.db.base import Base  # noqa: E402

config = context.config

if config.config_file_name:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def get_url() -> str:
    return os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://overmnd:password@localhost:5432/overmnd",
    )


def run_migrations_offline():
    context.configure(
        url=get_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        # Avoid noisy diffs on PG identity/defaults
        compare_type=False,
        compare_server_default=False,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    config.set_main_option("sqlalchemy.url", get_url())
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        future=True,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=False,
            compare_server_default=False,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
