from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional

from pydantic import UUID4, BaseModel, EmailStr

from app.schemas.experience import ExperienceResponse
from app.schemas.milestone import MilestoneResponse
from app.schemas.organization import OrganizationResponse
from app.schemas.portfolio import PortfolioResponse
from app.schemas.position import PositionResponse


class Platform(str, Enum):
    careerforge = "careerforge"
    talenthub = "talenthub"


class BaseUserCreate(BaseModel):
    provider: str = "self"
    provider_id: str
    platform: Platform
    account_tier: str = "free"


class UserBase(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    role: str = "user"
    is_active: bool = True


class UserCareerForgeCreate(UserBase):
    base_user_id: UUID4


class UserTalentHubCreate(UserBase):
    base_user_id: UUID4
    organization_id: Optional[UUID4] = None


class UserCreateRequest(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str
    platform: Platform = Platform.careerforge


class UserCareerForgeProfile(BaseModel):
    # Basic Info
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    profile_picture_url: Optional[str] = None

    # Profile Metrics
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

    class Config:
        from_attributes = True


class UserTalentHubProfile(BaseModel):
    # Basic Info
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    profile_picture_url: Optional[str] = None

    # Organization Info
    organization_id: Optional[UUID4] = None
    department: Optional[str] = None
    role: Optional[str] = None
    hiring_capacity: Optional[int] = None
    recruitment_focus: Optional[List[str]] = None

    # Additional profile fields
    verified: bool = False
    talent_pipeline_size: int = 0
    success_metrics: Optional[dict] = None
    verification_date: Optional[datetime] = None
    verification_method: Optional[str] = None

    # Preferences & Settings
    notification_preferences: Optional[Dict] = None
    candidate_scoring_weights: Optional[Dict] = None
    interview_availability: Optional[Dict] = None

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: UUID4
    provider: str
    provider_id: str
    platform: Platform
    account_tier: str

    class Config:
        from_attributes = True


class UserCareerForgeResponse(UserResponse):
    careerforge_profile: UserCareerForgeProfile
    experiences: Optional[List[ExperienceResponse]] = None
    portfolios: Optional[List[PortfolioResponse]] = None
    milestones: Optional[List[MilestoneResponse]] = None

    class Config:
        from_attributes = True


class UserTalentHubResponse(UserResponse):
    talenthub_profile: UserTalentHubProfile
    organization: Optional[OrganizationResponse] = None
    positions: Optional[List[PositionResponse]] = None

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
