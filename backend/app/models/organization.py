import uuid

from sqlalchemy import ARRAY, Column, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_by = Column(UUID(as_uuid=True), ForeignKey("base_users.id"), nullable=False)
    name = Column(String, nullable=False)
    type = Column(String)
    size = Column(String)
    no_of_employees = Column(Integer, default=0)
    location = Column(String)
    city = Column(String)
    state = Column(String)
    country = Column(String)
    overview = Column(String)
    benefits = Column(ARRAY(String))
    select_career_path = Column(String)
    logo_url = Column(String)

    positions = relationship("Position", backref="organization")
