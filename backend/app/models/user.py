import uuid

from sqlalchemy import ARRAY, Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, backref

from app.db.base_class import Base, Timestamp


class BaseUser(Base, Timestamp):
    __tablename__ = "base_users"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    provider = Column(String(32), nullable=False)
    provider_id = Column(String, nullable=False)
    platform = Column(String(32), nullable=False)  # 'pathways' or 'candid'

    user_pathways = relationship("UserPathways", backref="base_user", uselist=False)
    user_candid = relationship("UserCandid", backref="base_user", uselist=False)
    payments = relationship("Payments", backref="base_user")
    feature_tracking = relationship("FeatureTracking", backref="user")


class UserPathways(Base, Timestamp):
    __tablename__ = "user_pathways"
    __table_args__ = {"extend_existing": True}

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    base_user_id = Column(UUID(as_uuid=True), ForeignKey("base_users.id"), nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    first_name = Column(String(64), nullable=True)
    last_name = Column(String(64), nullable=True)
    gender = Column(String(32), nullable=True)
    ethnicity = Column(String(32), nullable=True)
    nationality = Column(String(64), nullable=True)
    phone_number = Column(String(32), nullable=True)
    city = Column(String(64), nullable=True)
    state = Column(String(64), nullable=True)
    country = Column(String(64), nullable=True)
    linkedin_url = Column(String(512), nullable=True)
    instagram_url = Column(String(512), nullable=True)
    facebook_url = Column(String(512), nullable=True)
    x_twitter_url = Column(String(512), nullable=True)
    personal_website_url = Column(String(512), nullable=True)
    current_career = Column(String(512), nullable=True)
    job_search_phase = Column(String(512), nullable=True)
    skills = Column(ARRAY(String), nullable=True)
    interests = Column(ARRAY(String), nullable=True)
    career_summary = Column(String(4096), nullable=True)
    birthday = Column(String(32), nullable=True)
    current_job_title = Column(String(512), nullable=True)
    profile_picture_url = Column(String(512), nullable=True)
    background_image_url = Column(String(512), nullable=True)

    user_files_fk = relationship("UserFiles", backref="user_pathways")
    job_experiences_fk = relationship("JobExperiences", backref="user_pathways")
    applied_jobs_fk = relationship("AppliedJobs", backref="user_pathways")
    cover_letters_fk = relationship("CoverLetters", backref="user_pathways")
    goals_fk = relationship("Goals", backref="user_pathways")


class UserCandid(Base, Timestamp):
    __tablename__ = "user_candid"
    __table_args__ = {"extend_existing": True}

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    base_user_id = Column(UUID(as_uuid=True), ForeignKey("base_users.id"), nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    first_name = Column(String(64), nullable=True)
    last_name = Column(String(64), nullable=True)
    gender = Column(String(32), nullable=True)
    nationality = Column(String(64), nullable=True)
    phone_number = Column(String(32), nullable=True)
    country = Column(String(64), nullable=True)
    personal_website_url = Column(String(512), nullable=True)
    profile_picture_url = Column(String(512), nullable=True)
    current_job_title = Column(String(64), nullable=True)

    companies_fk = relationship(
        "Companies", 
        backref=backref("user_candid", overlaps="companies_fk"),
        overlaps="user_candid"
    )
    job_roles_fk = relationship(
        "JobRoles", 
        backref=backref("user_candid", overlaps="job_roles_fk"),
        overlaps="user_candid"
    )


class UserFiles(Base, Timestamp):
    __tablename__ = "user_files"
    __table_args__ = {"extend_existing": True}

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_pathways.id"), nullable=False)
    file_name = Column(String(512), nullable=False)
    file_url = Column(String(512), nullable=False)
    file_type = Column(String(32), nullable=False)
