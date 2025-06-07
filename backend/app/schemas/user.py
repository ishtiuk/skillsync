from enum import Enum
from typing import List, Optional

from pydantic import UUID4, BaseModel, EmailStr


class Platform(str, Enum):
    careerforge = "careerforge"
    talenthub = "talenthub"


class UserCreate(BaseModel):
    email: EmailStr
    password_hash: str
    provider: str = "self"
    provider_id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[str] = None
    ethnicity: Optional[str] = None
    nationality: Optional[str] = "American"
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
    platform: Platform = Platform.careerforge
    current_job_title: Optional[str] = None
    profile_picture_url: Optional[str] = None
    background_image_url: Optional[str] = None


class UserCreateRequest(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str
    provider: str = "self"
    platform: Platform = Platform.careerforge


class UserResponse(BaseModel):
    id: str
    email: str
    provider: str
    platform: Platform = Platform
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[str] = None
    ethnicity: Optional[str] = None
    nationality: Optional[str] = "American"
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
    profile_picture_url: Optional[str] = None


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
    email: EmailStr
    password: str
    platform: Platform = Platform.careerforge


class UserUpdateRequest(BaseModel):
    # Common fields for both platforms
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[str] = None
    nationality: Optional[str] = "American"
    phone_number: Optional[str] = None
    country: Optional[str] = None
    personal_website_url: Optional[str] = None
    current_job_title: Optional[str] = None
    profile_picture_url: Optional[str] = None

    # careerforge-specific fields
    ethnicity: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    linkedin_url: Optional[str] = None
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    x_twitter_url: Optional[str] = None
    current_career: Optional[str] = None
    job_search_phase: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    career_summary: Optional[str] = None
    birthday: Optional[str] = None
    background_image_url: Optional[str] = None


class GoogleLoginRequest(BaseModel):
    access_token: str
    platform: Optional[Platform] = Platform.careerforge


class GoogleUserCreate(BaseModel):
    access_token: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    provider: Optional[str] = "google"
    platform: Platform = Platform.careerforge
    email: EmailStr


class PasswordResetRequest(BaseModel):
    email: EmailStr
    platform: Platform


class UpdatePasswordRequest(BaseModel):
    password: str
    token: str


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
    logo_url: Optional[str] = None


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
