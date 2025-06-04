import uuid

from sqlalchemy import ARRAY, Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import backref, relationship

from app.db.base_class import Base, Timestamp


class BaseUser(Base, Timestamp):
    __tablename__ = "base_users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider = Column(String(32), nullable=False)
    provider_id = Column(String, nullable=False)
    platform = Column(String(32), nullable=False)  # 'careerforge' or 'talenthub'

    user_careerforge = relationship(
        "UserCareerforge", backref=backref("base_user", uselist=False), uselist=False
    )
    user_talenthub = relationship(
        "UserTalenthub", backref=backref("base_user", uselist=False), uselist=False
    )
    payments = relationship("Payments", backref="base_user")
    feature_tracking = relationship("FeatureTracking", backref="user")


class UserCareerforge(Base, Timestamp):
    __tablename__ = "user_careerforge"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
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

    user_files_fk = relationship("UserFiles", backref="user_careerforge")
    experiences_fk = relationship("Experiences", backref="user_careerforge")
    tracked_jobs_fk = relationship("TrackedJobs", backref="user_careerforge")
    cover_letters_fk = relationship("CoverLetters", backref="user_careerforge")
    milestones_fk = relationship("Milestones", backref="user_careerforge")


class UserTalenthub(Base, Timestamp):
    __tablename__ = "user_talenthub"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
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

    organizations_fk = relationship("Organizations", backref="user_talenthub")
    positions_fk = relationship("Positions", backref="user_talenthub")


class UserFiles(Base, Timestamp):
    __tablename__ = "user_files"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_careerforge.id"), nullable=False)
    file_name = Column(String(512), nullable=False)
    file_url = Column(String(512), nullable=False)
    file_type = Column(String(32), nullable=False)
