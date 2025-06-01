# Standard library imports
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Union, ForwardRef, Annotated

from pydantic import BaseModel, EmailStr, Field, UUID4, root_validator, ConfigDict

# Platform Definition
class Platform(str, Enum):
    careerforge = "careerforge"
    talenthub = "talenthub"

# Base Configuration
model_config = ConfigDict(from_attributes=True)

# Base User Models
class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    platform: Platform
    auth_provider: str = "self"
    provider_uid: Optional[str] = None
    account_tier: str = "free"

class UserCreate(UserBase):
    password: str
    
class UserCareerForgeProfile(BaseModel):
    profile_strength: int = 0
    parsed_resume: Optional[dict] = None
    skill_vector: Optional[List[float]] = None
    career_stage: Optional[str] = None  # entry, mid, senior, expert
    industry_focus: Optional[List[str]] = None
    achievement_score: int = 0
    
    # Additional profile fields
    gender: Optional[str] = None
    ethnicity: Optional[str] = None
    nationality: Optional[str] = None
    phone_number: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    linkedin_url: Optional[str] = None
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    x_twitter_url: Optional[str] = None
    personal_website_url: Optional[str] = None
    current_career: Optional[str] = None
    job_search_phase: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    career_summary: Optional[str] = None
    birthday: Optional[str] = None
    current_job_title: Optional[str] = None
    profile_picture_url: Optional[str] = None
    background_image_url: Optional[str] = None

    class Config:
        from_attributes = True

class UserTalentHubProfile(BaseModel):
    organization_id: Optional[UUID4] = None
    hiring_capacity: Optional[int] = None
    recruitment_focus: Optional[List[str]] = None
    verified: bool = False
    talent_pipeline_size: int = 0
    success_metrics: Optional[dict] = None
    verification_date: Optional[datetime] = None
    verification_method: Optional[str] = None
    
    # Additional profile fields
    department: Optional[str] = None
    role: Optional[str] = None
    phone_number: Optional[str] = None
    profile_picture_url: Optional[str] = None

    # Preferences & Settings
    notification_preferences: Optional[Dict] = None
    candidate_scoring_weights: Optional[Dict] = None
    interview_availability: Optional[Dict] = None

    class Config:
        from_attributes = True

class UserCreateRequest(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str
    provider: str = "self"
    platform: Platform = Platform.careerforge


class UserResponse(UserBase):
    id: UUID4
    is_active: bool
    last_active: Optional[datetime]
    email_verified_at: Optional[datetime] = None
    last_password_change: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    role: str
    profile_picture_url: Optional[str] = None
    phone_number: Optional[str] = None
    subscription: Optional['SubscriptionResponse'] = None
    feature_usage: Optional['FeatureUsageResponse'] = None

    class Config:
        from_attributes = True

class UserCareerForgeResponse(UserResponse):
    careerforge_profile: UserCareerForgeProfile
    experiences: Optional[List['ExperienceResponse']] = None
    portfolios: Optional[List['PortfolioResponse']] = None
    milestones: Optional[List['MilestoneResponse']] = None

    class Config:
        from_attributes = True

class UserTalentHubResponse(UserResponse):
    talenthub_profile: UserTalentHubProfile
    organization: Optional['OrganizationResponse'] = None
    positions: Optional[List['PositionResponse']] = None

    class Config:
        from_attributes = True


class PublicUserResponse(BaseModel):
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    linkedin_url: Optional[str] = None
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    x_twitter_url: Optional[str] = None
    personal_website_url: Optional[str] = None
    skills: Optional[List[str]] = None
    career_summary: Optional[str] = (None,)
    profile_picture_url: Optional[str] = None
    current_career: Optional[str] = None
    background_image_url: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str
    platform: Platform = Platform.careerforge


class GoogleLoginRequest(BaseModel):
    access_token: str
    platform: Platform = Platform.careerforge


class GoogleUserCreate(BaseModel):
    access_token: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    provider: str = "google"
    platform: Platform = Platform.careerforge


class PasswordResetRequest(BaseModel):
    email: EmailStr


class UpdatePasswordRequest(BaseModel):
    password: str
    token: str


class UserUpdateRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[str] = None
    ethnicity: Optional[str] = None
    nationality: Optional[str] = None
    phone_number: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    linkedin_url: Optional[str] = None
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    x_twitter_url: Optional[str] = None
    personal_website_url: Optional[str] = None
    current_career: Optional[str] = None
    job_search_phase: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    career_summary: Optional[str] = None
    birthday: Optional[str] = None
    current_job_title: Optional[str] = None
    background_image_url: Optional[str] = None


# CareerForge Experience schemas
class ExperienceBase(BaseModel):
    company_name: str
    position_title: str
    employment_type: str
    is_current: bool
    description: Optional[str] = None
    skills: Optional[List[str]] = None
    achievements: Optional[List[str]] = None
    location: Optional[str] = None
    start_date: datetime
    end_date: Optional[datetime] = None

class ExperienceCreate(ExperienceBase):
    user_id: Optional[UUID4] = None

class ExperienceResponse(ExperienceBase):
    id: UUID4
    user_id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# CareerForge Portfolio schemas
class PortfolioBase(BaseModel):
    project_title: str
    description: str
    technologies: List[str]
    project_url: Optional[str] = None
    github_url: Optional[str] = None
    showcase_priority: int = 0
    visibility: str = "public"

    @root_validator(pre=True)
    def set_defaults(cls, values):
        values.setdefault('showcase_priority', 0)
        values.setdefault('visibility', 'public')
        return values

class PortfolioCreate(PortfolioBase):
    user_id: Optional[UUID4] = None

class PortfolioResponse(PortfolioBase):
    id: UUID4
    user_id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# CareerForge Milestone schemas
class MilestoneBase(BaseModel):
    milestone_type: str
    title: str
    description: str
    achievement_points: int = 0
    verified: bool = False
    proof_url: Optional[str] = None
    completed_at: Optional[datetime] = None

class MilestoneCreate(MilestoneBase):
    user_id: Optional[UUID4] = None

class MilestoneResponse(MilestoneBase):
    id: UUID4
    user_id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Backward compatible experience schemas
class CreateExp(BaseModel):
    user_id: Optional[UUID4] = None
    position_title: str
    company_name: str
    employment_type: str
    is_current: bool
    start_month: int
    start_year: int
    end_month: Optional[int] = None
    end_year: Optional[int] = None
    logo_url: Optional[str] = None

class ExpResponse(BaseModel):
    id: UUID4
    position_title: str
    company_name: str
    employment_type: str
    is_current: bool
    start_month: int
    start_year: int
    end_month: Optional[int] = None
    end_year: Optional[int] = None

class UpdateExp(BaseModel):
    position_title: Optional[str] = None
    company_name: Optional[str] = None
    employment_type: Optional[str] = None
    is_current: Optional[bool] = None
    start_month: Optional[int] = None
    start_year: Optional[int] = None
    end_month: Optional[int] = None
    end_year: Optional[int] = None
    logo_url: Optional[str] = None

# Job Application schemas
class JobApplicationBase(BaseModel):
    status: str = "applied"
    stages: Optional[Dict] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True

class JobApplicationCreate(JobApplicationBase):
    position_id: UUID4

class JobApplicationResponse(JobApplicationBase):
    id: UUID4
    user_id: UUID4
    position_id: UUID4
    application_date: datetime
    created_at: datetime
    updated_at: datetime
    position: Optional["PositionResponse"] = None

    class Config:
        from_attributes = True

# Model Update functions
def update_forward_refs(position_schemas=None, organization_schemas=None):
    """Update forward references for circular imports"""
    if position_schemas and organization_schemas:
        UserTalentHubResponse.update_forward_refs(**{
            "OrganizationResponse": organization_schemas.OrganizationResponse,
            "PositionResponse": position_schemas.PositionResponse
        })
        JobApplicationResponse.update_forward_refs(**{
            "PositionResponse": position_schemas.PositionResponse
        })
