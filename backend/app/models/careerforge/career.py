from datetime import datetime
from typing import Dict, List
from uuid import UUID

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, JSON, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class JobApplication(Base):
    __tablename__ = "job_applications"
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_careerforge.id"))
    position_id = Column(UUID(as_uuid=True), ForeignKey("positions.id"))
    status = Column(String, default="applied")
    application_date = Column(DateTime, default=datetime.utcnow)
    stages = Column(JSON)  # Track application stages
    notes = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("UserCareerForge", backref="applications")
    position = relationship("Position", backref="applications")

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

    # Relationships
    user = relationship("UserCareerForge", backref="experiences")

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

    # Relationships
    user = relationship("UserCareerForge", backref="portfolios")

class Milestone(Base):
    __tablename__ = "milestones"
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_careerforge.id"))
    milestone_type = Column(String(64))
    title = Column(String(256))
    description = Column(String(1024))
    achievement_points = Column(Integer)
    verified = Column(Boolean, server_default='false')
    proof_url = Column(String)
    completed_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("UserCareerForge", backref="milestones")
