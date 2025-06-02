from datetime import datetime
from typing import List, Optional

from pydantic import UUID4, BaseModel


class PositionBase(BaseModel):
    title: str
    job_category: Optional[str] = None
    position_type: Optional[str] = None
    level_of_experience: Optional[str] = None
    role_description: Optional[str] = None
    education_level: Optional[str] = None
    special_educational_requirements: Optional[str] = None
    workplace_type: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pay_type: Optional[str] = None
    minimum_pay: Optional[int] = None
    maximum_pay: Optional[int] = None
    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None


class PositionCreate(PositionBase):
    organization_id: Optional[UUID4] = None
    recruiter_id: Optional[UUID4] = None


class PositionUpdate(PositionBase):
    id: UUID4
    organization_id: Optional[UUID4] = None
    recruiter_id: Optional[UUID4] = None
    status: Optional[str] = None


class PositionResponse(PositionBase):
    id: UUID4
    organization_id: UUID4
    recruiter_id: UUID4
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
