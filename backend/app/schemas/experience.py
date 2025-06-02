from datetime import datetime
from typing import List, Optional

from pydantic import UUID4, BaseModel


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


class ExperienceUpdate(ExperienceBase):
    id: UUID4
    user_id: Optional[UUID4] = None
    company_name: Optional[str] = None
    position_title: Optional[str] = None
    employment_type: Optional[str] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    skills: Optional[List[str]] = None
    achievements: Optional[List[str]] = None
    location: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class ExperienceResponse(ExperienceBase):
    id: UUID4
    user_id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
