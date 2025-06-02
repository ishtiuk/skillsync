from datetime import datetime
from typing import List, Optional

from pydantic import UUID4, BaseModel, root_validator


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
        values.setdefault("showcase_priority", 0)
        values.setdefault("visibility", "public")
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
