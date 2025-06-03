import uuid

from sqlalchemy import JSON, Boolean, Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_careerforge.id"))
    position_id = Column(UUID(as_uuid=True), ForeignKey("positions.id"))
    activity = Column(String(512), nullable=True)
    reaction = Column(String(512), nullable=True)
    notes = Column(String(4096), nullable=True)
    stage = Column(JSON, nullable=True)
    is_favourite = Column(Boolean, nullable=False, server_default="false")

    position = relationship("Position", backref="applications")
