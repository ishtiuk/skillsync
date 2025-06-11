from datetime import datetime
from enum import Enum
from typing import Dict, Optional

from pydantic import UUID4, BaseModel, validator


class MilestoneType(str, Enum):
    skill_development = "skill_development"  # Learning new skills, certifications, courses
    job_search = "job_search"  # Application targets, resume updates, interview prep
    networking = "networking"  # Professional connections, events, meetups
    career_advancement = "career_advancement"  # Promotions, role transitions, leadership goals
    education = "education"  # Degrees, bootcamps, formal education
    project_completion = "project_completion"  # Portfolio projects, side hustles
    work_life_balance = "work_life_balance"  # Time management, stress reduction, boundaries
    financial = "financial"  # Salary negotiations, savings goals, benefits
    entrepreneurship = "entrepreneurship"  # Starting a business, freelancing
    mentorship = "mentorship"  # Finding mentors or becoming a mentor
    professional_brand = "professional_brand"  # Personal website, social media presence, speaking
    remote_work = "remote_work"  # Remote job transition, workspace setup


class MilestoneBase(BaseModel):
    name: str
    type: Optional[MilestoneType] = None
    description: Optional[str] = None
    tasks: Optional[Dict[str, bool]] = None
    is_completed: Optional[bool] = False

    @validator("tasks")
    def validate_tasks(cls, value):
        if value is not None and not isinstance(value, dict):
            raise ValueError("Tasks must be a dictionary")
        if value is not None:
            for key, val in value.items():
                if not isinstance(val, bool):
                    raise ValueError("Task status must be boolean")
        return value


class MilestoneCreate(MilestoneBase):
    pass


class MilestoneUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[MilestoneType] = None
    description: Optional[str] = None
    tasks: Optional[Dict[str, bool]] = None
    is_completed: Optional[bool] = None


class MilestoneResponse(MilestoneBase):
    id: UUID4
    user_id: UUID4
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
