from datetime import datetime
from typing import Dict, List
from uuid import UUID

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, JSON, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String, nullable=False)
    type = Column(String)
    size = Column(String)
    no_of_employees = Column(Integer)
    is_bipoc_owned = Column(Boolean, default=False)
    location = Column(String)
    city = Column(String)
    state = Column(String)
    country = Column(String)
    overview = Column(String)
    benefits = Column(JSON)
    select_a_pathway = Column(String)
    logo_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    members = relationship("UserTalentHub", back_populates="organization")
    positions = relationship("Position", back_populates="organization")

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
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="positions")
    recruiter = relationship("UserTalentHub", back_populates="positions")
    applications = relationship("JobApplication", back_populates="position")
