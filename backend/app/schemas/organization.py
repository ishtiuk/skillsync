from enum import Enum
from typing import List, Optional

from pydantic import UUID4, BaseModel


class CareerPath(str, Enum):
    conservation = "Conservation"
    energy = "Energy"
    agriculture = "Agriculture"
    education = "Education"
    construction = "Construction"
    finance = "Finance"
    forestry = "Forestry"
    manufacturing = "Manufacturing"
    arts_culture = "Arts & Culture"
    real_estate = "Real Estate"
    medical = "Medical"
    policy = "Policy"
    research = "Research"
    sports = "Sports"
    technology = "Technology"
    tourism = "Tourism"
    transport = "Transport"
    urban_planning = "Urban Planning"
    waste_management = "Waste Management"
    water = "Water"
    media = "Media"


class OrganizationBase(BaseModel):
    name: str
    type: str
    size: str
    no_of_employees: Optional[int] = 0
    location: str
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    overview: Optional[str] = None
    benefits: Optional[List[str]] = None
    select_career_path: Optional[CareerPath] = None
    logo_url: Optional[str] = None


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(OrganizationBase):
    name: Optional[str] = None
    type: Optional[str] = None
    size: Optional[str] = None
    no_of_employees: Optional[int] = None
    is_bipoc_owned: Optional[bool] = False
    location: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    overview: Optional[str] = None
    benefits: Optional[List[str]] = None
    select_career_path: Optional[CareerPath] = None


class OrganizationResponse(OrganizationBase):
    id: UUID4
    created_by: UUID4

    class Config:
        from_attributes = True
