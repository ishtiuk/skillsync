from enum import Enum
from typing import List, Optional

from pydantic import UUID4, BaseModel


class Sector(str, Enum):
    wildlife_protection = "Wildlife Protection"
    renewable_power = "Renewable Power"
    eco_farming = "Eco-Farming"
    green_education = "Green Education"
    sustainable_building = "Sustainable Building"
    ethical_fintech = "Ethical Fintech"
    forest_ecology = "Forest Ecology"
    clean_manufacturing = "Clean Manufacturing"
    cultural_initiatives = "Cultural Initiatives"
    smart_housing = "Smart Housing"
    healthcare_innovation = "Healthcare Innovation"
    public_governance = "Public Governance"
    environmental_research = "Environmental Research"
    wellness_sports = "Wellness & Sports"
    clean_tech = "Clean Tech"
    eco_travel = "Eco Travel"
    mobility_solutions = "Mobility Solutions"
    city_design = "City Design"
    recycling_services = "Recycling Services"
    aqua_stewardship = "Aqua Stewardship"
    climate_communications = "Climate Communications"


class OrganizationBase(BaseModel):
    name: str
    type: str
    size: str
    no_of_employees: Optional[int] = 0
    is_bipoc_owned: Optional[bool] = False
    location: str
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    overview: Optional[str] = None
    benefits: Optional[List[str]] = None
    sector_focus: Optional[Sector] = None
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
    sector_focus: Optional[Sector] = None


class OrganizationResponse(OrganizationBase):
    id: UUID4
    created_by: UUID4

    class Config:
        from_attributes = True
