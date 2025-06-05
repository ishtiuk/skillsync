import uuid

from sqlalchemy import JSON, Boolean, Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID

from app.db.base_class import Base, Timestamp


class TrackedJobs(Base, Timestamp):
    __tablename__ = "tracked_jobs"
    __table_args__ = {"extend_existing": True}

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_careerforge.id"), nullable=False)
    job_id = Column(UUID(as_uuid=True), ForeignKey("positions.id"), nullable=False)
    activity = Column(String(512), nullable=True)
    reaction = Column(String(512), nullable=True)
    notes = Column(String(4096), nullable=True)
    stage = Column(JSON, nullable=True)
    is_favourite = Column(Boolean, nullable=False, server_default="false")
