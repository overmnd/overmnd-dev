"""add X feature

Revision ID: d5c4f6169a3b
Revises: 8cb51dd120b2
Create Date: 2025-09-12 13:23:52.373968
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "d5c4f6169a3b"
down_revision: str | Sequence[str] | None = "8cb51dd120b2"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema.

    IMPORTANT: Do not alter identity primary keys or change BIGINT<->INT types.
    We only drop the legacy feature tables and their indexes.
    """
    # --- notifications ---
    op.drop_index(op.f("notifications_tenant_idx"), table_name="notifications")
    op.drop_index(op.f("notifications_user_idx"), table_name="notifications")
    op.drop_table("notifications")

    # --- remediations ---
    op.drop_index(op.f("remediations_finding_idx"), table_name="remediations")
    op.drop_index(op.f("remediations_tenant_idx"), table_name="remediations")
    op.drop_table("remediations")

    # --- audit_events ---
    op.drop_index(op.f("audit_events_tenant_idx"), table_name="audit_events")
    op.drop_table("audit_events")

    # --- user_preferences ---
    op.drop_index(op.f("user_prefs_tenant_idx"), table_name="user_preferences")
    op.drop_table("user_preferences")

    # --- invitations ---
    op.drop_index(op.f("invitations_email_idx"), table_name="invitations")
    op.drop_index(op.f("invitations_tenant_idx"), table_name="invitations")
    op.drop_table("invitations")

    # --- consents ---
    op.drop_index(op.f("consents_tenant_idx"), table_name="consents")
    op.drop_table("consents")

    # --- tenant_data ---
    op.drop_index(op.f("tenant_data_tenant_idx"), table_name="tenant_data")
    op.drop_table("tenant_data")

    # NOTE: intentionally no op.alter_column() calls on findings/users/tenants.
    # Leave PKs (IDENTITY) and BIGINT FK types as-is to avoid Postgres errors.


def downgrade() -> None:
    """Recreate the dropped tables and indexes (as previously generated)."""
    # --- tenant_data ---
    op.create_table(
        "tenant_data",
        sa.Column(
            "id",
            sa.BIGINT(),
            sa.Identity(
                always=True,
                start=1,
                increment=1,
                minvalue=1,
                maxvalue=9223372036854775807,
                cycle=False,
                cache=1,
            ),
            autoincrement=True,
            nullable=False,
        ),
        sa.Column("tenant_id", sa.BIGINT(), autoincrement=False, nullable=False),
        sa.Column(
            "data", postgresql.JSONB(astext_type=sa.Text()), autoincrement=False, nullable=False
        ),
        sa.Column(
            "created_at",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["tenant_id"],
            ["tenants.id"],
            name=op.f("tenant_data_tenant_id_fkey"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("tenant_data_pkey")),
    )
    op.create_index(op.f("tenant_data_tenant_idx"), "tenant_data", ["tenant_id"], unique=False)

    # --- consents ---
    op.create_table(
        "consents",
        sa.Column(
            "id",
            sa.BIGINT(),
            sa.Identity(
                always=True,
                start=1,
                increment=1,
                minvalue=1,
                maxvalue=9223372036854775807,
                cycle=False,
                cache=1,
            ),
            autoincrement=True,
            nullable=False,
        ),
        sa.Column("tenant_id", sa.BIGINT(), autoincrement=False, nullable=True),
        sa.Column("user_id", sa.BIGINT(), autoincrement=False, nullable=True),
        sa.Column("scope_set", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column(
            "granted_at",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column("granted_by_upn", sa.TEXT(), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(
            ["tenant_id"], ["tenants.id"], name=op.f("consents_tenant_id_fkey"), ondelete="CASCADE"
        ),
        sa.ForeignKeyConstraint(
            ["user_id"], ["users.id"], name=op.f("consents_user_id_fkey"), ondelete="SET NULL"
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("consents_pkey")),
    )
    op.create_index(op.f("consents_tenant_idx"), "consents", ["tenant_id"], unique=False)

    # --- invitations ---
    op.create_table(
        "invitations",
        sa.Column(
            "id",
            sa.BIGINT(),
            sa.Identity(
                always=True,
                start=1,
                increment=1,
                minvalue=1,
                maxvalue=9223372036854775807,
                cycle=False,
                cache=1,
            ),
            autoincrement=True,
            nullable=False,
        ),
        sa.Column("tenant_id", sa.BIGINT(), autoincrement=False, nullable=False),
        sa.Column("email", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column(
            "role",
            postgresql.ENUM("owner", "admin", "member", "viewer", name="user_role"),
            server_default=sa.text("'member'::user_role"),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column("token", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column(
            "status",
            sa.TEXT(),
            server_default=sa.text("'pending'::text"),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column("invited_by", sa.BIGINT(), autoincrement=False, nullable=True),
        sa.Column(
            "expires_at", postgresql.TIMESTAMP(timezone=True), autoincrement=False, nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["invited_by"],
            ["users.id"],
            name=op.f("invitations_invited_by_fkey"),
            ondelete="SET NULL",
        ),
        sa.ForeignKeyConstraint(
            ["tenant_id"],
            ["tenants.id"],
            name=op.f("invitations_tenant_id_fkey"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("invitations_pkey")),
    )
    op.create_index(op.f("invitations_tenant_idx"), "invitations", ["tenant_id"], unique=False)
    op.create_index(op.f("invitations_email_idx"), "invitations", ["email"], unique=False)

    # --- user_preferences ---
    op.create_table(
        "user_preferences",
        sa.Column("user_id", sa.BIGINT(), autoincrement=False, nullable=False),
        sa.Column("tenant_id", sa.BIGINT(), autoincrement=False, nullable=False),
        sa.Column(
            "preferences_json",
            postgresql.JSONB(astext_type=sa.Text()),
            server_default=sa.text("'{}'::jsonb"),
            autoincrement=False,
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["tenant_id"],
            ["tenants.id"],
            name=op.f("user_preferences_tenant_id_fkey"),
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name=op.f("user_preferences_user_id_fkey"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("user_id", name=op.f("user_preferences_pkey")),
    )
    op.create_index(op.f("user_prefs_tenant_idx"), "user_preferences", ["tenant_id"], unique=False)

    # --- audit_events ---
    op.create_table(
        "audit_events",
        sa.Column(
            "id",
            sa.BIGINT(),
            sa.Identity(
                always=True,
                start=1,
                increment=1,
                minvalue=1,
                maxvalue=9223372036854775807,
                cycle=False,
                cache=1,
            ),
            autoincrement=True,
            nullable=False,
        ),
        sa.Column("tenant_id", sa.BIGINT(), autoincrement=False, nullable=True),
        sa.Column("actor_user_id", sa.BIGINT(), autoincrement=False, nullable=True),
        sa.Column("action", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column(
            "payload_json",
            postgresql.JSONB(astext_type=sa.Text()),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "created_at",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=True,
        ),
        sa.ForeignKeyConstraint(
            ["actor_user_id"],
            ["users.id"],
            name=op.f("audit_events_actor_user_id_fkey"),
            ondelete="SET NULL",
        ),
        sa.ForeignKeyConstraint(
            ["tenant_id"],
            ["tenants.id"],
            name=op.f("audit_events_tenant_id_fkey"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("audit_events_pkey")),
    )
    op.create_index(op.f("audit_events_tenant_idx"), "audit_events", ["tenant_id"], unique=False)

    # --- remediations ---
    op.create_table(
        "remediations",
        sa.Column(
            "id",
            sa.BIGINT(),
            sa.Identity(
                always=True,
                start=1,
                increment=1,
                minvalue=1,
                maxvalue=9223372036854775807,
                cycle=False,
                cache=1,
            ),
            autoincrement=True,
            nullable=False,
        ),
        sa.Column("tenant_id", sa.BIGINT(), autoincrement=False, nullable=False),
        sa.Column("finding_id", sa.BIGINT(), autoincrement=False, nullable=True),
        sa.Column("action_type", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column(
            "pre_state_json",
            postgresql.JSONB(astext_type=sa.Text()),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "post_state_json",
            postgresql.JSONB(astext_type=sa.Text()),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column("actor_user_id", sa.BIGINT(), autoincrement=False, nullable=True),
        sa.Column(
            "status",
            postgresql.ENUM(
                "pending", "applied", "failed", "rolled_back", name="remediation_status"
            ),
            server_default=sa.text("'pending'::remediation_status"),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "created_at",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "rolled_back_at",
            postgresql.TIMESTAMP(timezone=True),
            autoincrement=False,
            nullable=True,
        ),
        sa.ForeignKeyConstraint(
            ["actor_user_id"],
            ["users.id"],
            name=op.f("remediations_actor_user_id_fkey"),
            ondelete="SET NULL",
        ),
        sa.ForeignKeyConstraint(
            ["finding_id"],
            ["findings.id"],
            name=op.f("remediations_finding_id_fkey"),
            ondelete="SET NULL",
        ),
        sa.ForeignKeyConstraint(
            ["tenant_id"],
            ["tenants.id"],
            name=op.f("remediations_tenant_id_fkey"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("remediations_pkey")),
    )
    op.create_index(op.f("remediations_tenant_idx"), "remediations", ["tenant_id"], unique=False)
    op.create_index(op.f("remediations_finding_idx"), "remediations", ["finding_id"], unique=False)

    # --- notifications ---
    op.create_table(
        "notifications",
        sa.Column(
            "id",
            sa.BIGINT(),
            sa.Identity(
                always=True,
                start=1,
                increment=1,
                minvalue=1,
                maxvalue=9223372036854775807,
                cycle=False,
                cache=1,
            ),
            autoincrement=True,
            nullable=False,
        ),
        sa.Column("tenant_id", sa.BIGINT(), autoincrement=False, nullable=False),
        sa.Column("user_id", sa.BIGINT(), autoincrement=False, nullable=True),
        sa.Column("type", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column("title", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column("body", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column("route", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column(
            "payload_json",
            postgresql.JSONB(astext_type=sa.Text()),
            server_default=sa.text("'{}'::jsonb"),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "read",
            sa.BOOLEAN(),
            server_default=sa.text("false"),
            autoincrement=False,
            nullable=True,
        ),
        sa.Column(
            "created_at",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=True,
        ),
        sa.ForeignKeyConstraint(
            ["tenant_id"],
            ["tenants.id"],
            name=op.f("notifications_tenant_id_fkey"),
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["user_id"], ["users.id"], name=op.f("notifications_user_id_fkey"), ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("notifications_pkey")),
    )
    op.create_index(op.f("notifications_user_idx"), "notifications", ["user_id"], unique=False)
    op.create_index(op.f("notifications_tenant_idx"), "notifications", ["tenant_id"], unique=False)
