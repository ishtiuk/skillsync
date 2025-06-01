from datetime import datetime
from typing import Dict, List
from uuid import UUID

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, JSON, ARRAY, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class BaseUser(Base):
    __tablename__ = "base_users"
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    auth_provider = Column(String(32), nullable=False)
    provider_uid = Column(String, nullable=False)
    platform = Column(String(32), nullable=False)  # 'careerforge' or 'talenthub'
    account_tier = Column(String(32), server_default='free')
    last_active = Column(DateTime(timezone=True))
    
    # Authentication & Security
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String(32), server_default='user')  # user, admin, moderator
    
    # Basic Info
    first_name = Column(String)
    last_name = Column(String)
    phone_number = Column(String)
    profile_picture_url = Column(String)
    
    # Timestamps
    email_verified_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    last_password_change = Column(DateTime(timezone=True))

    careerforge_profile = relationship("UserCareerForge", back_populates="base_user", uselist=False)
    talenthub_profile = relationship("UserTalentHub", back_populates="base_user", uselist=False)
    subscription = relationship("Subscription", back_populates="user", uselist=False)
    feature_usage = relationship("FeatureUsage", back_populates="user", uselist=False)

class UserCareerForge(Base):
    __tablename__ = "user_careerforge"
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    base_user_id = Column(UUID(as_uuid=True), ForeignKey("base_users.id"))
    
    # Profile Metrics
    profile_strength = Column(Integer, server_default='0')  # 0-100%
    achievement_score = Column(Integer, server_default='0')
    
    # Career Data
    parsed_resume = Column(JSON)
    skill_vector = Column(ARRAY(Float))  # For ML matching
    skills = Column(ARRAY(String))
    career_stage = Column(String(64))  # entry, mid, senior, expert
    industry_focus = Column(ARRAY(String))
    interests = Column(ARRAY(String))
    current_career = Column(String)
    job_search_phase = Column(String)
    current_job_title = Column(String)
    career_summary = Column(String)

    # Personal Info
    gender = Column(String)
    ethnicity = Column(String)
    nationality = Column(String)
    birthday = Column(String)
    city = Column(String)
    state = Column(String)
    country = Column(String)
    
    # Social & Professional Links
    linkedin_url = Column(String)
    instagram_url = Column(String)
    facebook_url = Column(String)
    x_twitter_url = Column(String)
    personal_website_url = Column(String)
    github_url = Column(String)
    
    # UI Customization
    background_image_url = Column(String)
    
    base_user = relationship("BaseUser", back_populates="careerforge_profile")
    experiences = relationship("Experience", back_populates="user")
    portfolios = relationship("Portfolio", back_populates="user")
    milestones = relationship("Milestone", back_populates="user")

class UserTalentHub(Base):
    __tablename__ = "user_talenthub"
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    base_user_id = Column(UUID(as_uuid=True), ForeignKey("base_users.id"))
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"))
    
    # Role Information
    department = Column(String)
    role = Column(String)  # role within organization
    hiring_capacity = Column(Integer)
    recruitment_focus = Column(ARRAY(String))
    
    # Verification & Metrics
    verified = Column(Boolean, server_default='false')
    verification_date = Column(DateTime(timezone=True))
    verification_method = Column(String)
    talent_pipeline_size = Column(Integer, server_default='0')
    success_metrics = Column(JSON)
    
    # Preferences & Settings
    notification_preferences = Column(JSON)
    candidate_scoring_weights = Column(JSON)  # Customized weights for candidate matching
    interview_availability = Column(JSON)  # Recruiter's available time slots
    
    base_user = relationship("BaseUser", back_populates="talenthub_profile")
    organization = relationship("Organization", back_populates="members")
    positions = relationship("Position", back_populates="recruiter")
