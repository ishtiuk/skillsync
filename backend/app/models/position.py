from sqlalchemy import ARRAY, Column, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID

from app.db.base_class import Base


class Position(Base):
    __tablename__ = "positions"

    id = Column(UUID(as_uuid=True), primary_key=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"))
    recruiter_id = Column(UUID(as_uuid=True), ForeignKey("user_talenthub.id"))
    title = Column(String, nullable=False)
    job_category = Column(String)
    position_type = Column(String)
    level_of_experience = Column(String)
    role_description = Column(String)
    education_level = Column(String)
    special_educational_requirements = Column(String)
    workplace_type = Column(String)
    city = Column(String)
    state = Column(String)
    country = Column(String)
    pay_type = Column(String)
    minimum_pay = Column(Integer)
    maximum_pay = Column(Integer)
    status = Column(String, default="active")
    required_skills = Column(ARRAY(String))
    preferred_skills = Column(ARRAY(String))
