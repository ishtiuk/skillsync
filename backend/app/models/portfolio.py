import uuid

from sqlalchemy import ARRAY, Column, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID

from app.db.base_class import Base


class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_careerforge.id"))
    project_title = Column(String(256))
    description = Column(String(4096))
    technologies = Column(ARRAY(String))
    project_url = Column(String)
    github_url = Column(String)
    showcase_priority = Column(Integer)
    visibility = Column(String(32))
