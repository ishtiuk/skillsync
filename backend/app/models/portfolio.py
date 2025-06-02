from datetime import datetime
from uuid import UUID

from sqlalchemy import ARRAY, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_careerforge.id"))
    project_title = Column(String(256))
    description = Column(String(4096))
    technologies = Column(ARRAY(String))
    project_url = Column(String)
    github_url = Column(String)
    showcase_priority = Column(Integer)
    visibility = Column(String(32))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserCareerForge", backref="portfolios")
