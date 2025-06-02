from datetime import datetime
from uuid import UUID

from sqlalchemy import ARRAY, Boolean, Column, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_careerforge.id"))
    company_name = Column(String, nullable=False)
    position_title = Column(String, nullable=False)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    is_current = Column(Boolean, default=False)
    description = Column(String)
    skills = Column(ARRAY(String))
    achievements = Column(ARRAY(String))
    location = Column(String)
    employment_type = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserCareerForge", backref="experiences")
