"""baseline (existing schema)

Revision ID: 1ef1a25b2300
Revises:
Create Date: 2025-09-12 12:03:25.098300
"""

from collections.abc import Sequence

# revision identifiers, used by Alembic.
revision: str = "1ef1a25b2300"
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
