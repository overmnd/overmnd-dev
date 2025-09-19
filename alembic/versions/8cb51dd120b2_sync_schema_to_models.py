"""sync schema to models (safe)

Revision ID: 8cb51dd120b2
Revises: 1ef1a25b2300
Create Date: 2025-09-12 12:09:57.681613
"""

from collections.abc import Sequence

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "8cb51dd120b2"
down_revision: str | Sequence[str] | None = "1ef1a25b2300"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Add tenants.name if missing; try to backfill from display_name; set NOT NULL
    op.execute(
        """
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'tenants' AND column_name = 'name'
        ) THEN
            ALTER TABLE tenants ADD COLUMN name varchar;
            -- Backfill from display_name if present (use dynamic SQL so we can catch undefined_column)
            BEGIN
                EXECUTE 'UPDATE tenants SET name = display_name WHERE name IS NULL';
            EXCEPTION WHEN undefined_column THEN
                NULL;
            END;
            UPDATE tenants SET name = COALESCE(name, 'default') WHERE name IS NULL;
            ALTER TABLE tenants ALTER COLUMN name SET NOT NULL;
        END IF;
    END$$;
    """
    )

    # Ensure unique index on users.email (create if missing)
    op.execute(
        """
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE c.relkind = 'i' AND c.relname = 'ix_users_email'
        ) THEN
            CREATE UNIQUE INDEX ix_users_email ON users (email);
        END IF;
    END$$;
    """
    )


def downgrade() -> None:
    # Drop unique index if it exists
    op.execute(
        """
    DO $$
    BEGIN
        IF EXISTS (
            SELECT 1
            FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE c.relkind = 'i' AND c.relname = 'ix_users_email'
        ) THEN
            DROP INDEX ix_users_email;
        END IF;
    END$$;
    """
    )

    # Make tenants.name nullable again if it exists
    op.execute(
        """
    DO $$
    BEGIN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'tenants' AND column_name = 'name'
        ) THEN
            ALTER TABLE tenants ALTER COLUMN name DROP NOT NULL;
        END IF;
    END$$;
    """
    )
