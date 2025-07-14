"""remove pay_type column

Revision ID: remove_pay_type_column
Revises: 9bbfcb7bea25
Create Date: 2025-07-14 12:00:00.000000

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "remove_pay_type_column"
down_revision = "9bbfcb7bea25"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Simply remove the pay_type column
    op.drop_column("positions", "pay_type")


def downgrade() -> None:
    # Add pay_type column back if needed to rollback
    op.add_column("positions", sa.Column("pay_type", sa.String(length=64), nullable=True))
