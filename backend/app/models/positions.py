import uuid

from sqlalchemy import ARRAY, Boolean, Column, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID

from app.db.base_class import Base, Timestamp


class Positions(Base, Timestamp):
    __tablename__ = "positions"
    __table_args__ = {"extend_existing": True}

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_talenthub.id"), nullable=False)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    title = Column(String(128), nullable=False)
    job_category = Column(String(128), nullable=False)
    position_type = Column(String(128), nullable=False)
    level_of_experience = Column(String(64), nullable=False)
    role_description = Column(String(4096), nullable=True)
    education_level = Column(String(512), nullable=True)
    special_educational_requirements = Column(String(2048), nullable=True)
    workplace_type = Column(String(512), nullable=True)
    city = Column(String(64), nullable=True)
    state = Column(String(64), nullable=True)
    country = Column(String(64), nullable=True)
    minimum_pay = Column(Float, nullable=True)
    maximum_pay = Column(Float, nullable=True)
    pay_frequency = Column(String(64), nullable=True)
    closing_date = Column(String(64), nullable=True)
    external_link = Column(String(512), nullable=True)
    required_files = Column(ARRAY(String), nullable=True)
    status = Column(String(32), nullable=True)
    primary_responsibilities = Column(String(4096), nullable=True)
    required_qualifications = Column(String(4096), nullable=True)
    desired_qualifications = Column(String(4096), nullable=True)
    compensation_benefits = Column(String(4096), nullable=True)
    show_recruiter = Column(Boolean, default=False, server_default="false")
