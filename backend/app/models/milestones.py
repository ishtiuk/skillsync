import uuid

from sqlalchemy import JSON, Boolean, Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID

from app.db.base_class import Base, Timestamp


class Milestones(Base, Timestamp):
    __tablename__ = "milestones"
    __table_args__ = {"extend_existing": True}

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_careerforge.id"), nullable=False)
    name = Column(String(128), nullable=False)
    type = Column(String(64), nullable=True)
    description = Column(String(2048), nullable=True)
    tasks = Column(JSON, nullable=True)
    is_completed = Column(Boolean, default=False, server_default="false")
