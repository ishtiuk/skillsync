import uuid

from sqlalchemy import INTEGER, Boolean, Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID

from app.db.base_class import Base, Timestamp


class Experiences(Base, Timestamp):
    __tablename__ = "experiences"
    __table_args__ = {"extend_existing": True}

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_careerforge.id"), nullable=False)
    position_title = Column(String(128), nullable=False)
    organization_name = Column(String(128), nullable=False)
    employment_type = Column(String(128), nullable=False)
    is_current = Column(Boolean, default=False)
    start_month = Column(INTEGER, nullable=True)
    start_year = Column(INTEGER, nullable=True)
    end_month = Column(INTEGER, nullable=True)
    end_year = Column(INTEGER, nullable=True)
    logo_url = Column(String(512), nullable=True)
