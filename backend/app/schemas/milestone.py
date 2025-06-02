from datetime import datetime
from typing import Optional

from pydantic import UUID4, BaseModel


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


class MilestoneUpdate(MilestoneBase):
    id: UUID4
    user_id: Optional[UUID4] = None
    milestone_type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    achievement_points: Optional[int] = None
    verified: Optional[bool] = None
    proof_url: Optional[str] = None
    completed_at: Optional[datetime] = None


class MilestoneResponse(MilestoneBase):
    id: UUID4
    user_id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
