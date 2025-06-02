import uuid

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_careerforge.id"))
    milestone_type = Column(String(64))
    title = Column(String(256))
    description = Column(String(1024))
    achievement_points = Column(Integer)
    verified = Column(Boolean, server_default="false")
    proof_url = Column(String)
    completed_at = Column(DateTime)

    user = relationship("UserCareerForge", backref="milestones")
