from datetime import datetime
from enum import Enum
from typing import Dict, Optional

from pydantic import UUID4, BaseModel, validator


class MilestoneType(str, Enum):
    interviewing = "interviewing"
    networking = "networking"
    compensation = "compensation"
    organization = "organization"


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
