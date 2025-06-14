import uuid

from sqlalchemy import ARRAY, INTEGER, Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID

from app.db.base_class import Base, Timestamp


class Organizations(Base, Timestamp):
    __tablename__ = "organizations"
    __table_args__ = {"extend_existing": True}

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    created_by = Column(
        UUID(as_uuid=True), ForeignKey("user_talenthub.id"), nullable=False
    )  # adjusted FK
    name = Column(String(128), nullable=False)
    type = Column(String(128), nullable=False)
    size = Column(String(32), nullable=False)
    no_of_employees = Column(INTEGER, nullable=True)
    location = Column(String(128), nullable=False)
    city = Column(String(64), nullable=True)
    state = Column(String(64), nullable=True)
    country = Column(String(64), nullable=True)
    overview = Column(String(4096), nullable=True)
    benefits = Column(ARRAY(String), nullable=True)
    select_a_pathway = Column(String(512), nullable=True)
    logo_url = Column(String(512), nullable=True)
