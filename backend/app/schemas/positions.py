from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional

from pydantic import UUID4, BaseModel


class WorkplaceType(str, Enum):
    onsite = "Onsite"
    remote = "Remote"
    hybrid = "Hybrid"


class PayFrequency(str, Enum):
    weekly = "Weekly"
    biweekly = "Bi-Weekly"
    monthly = "Monthly"


class LevelOfExperience(str, Enum):
    entry = "Entry"
    mid = "Mid"
    senior = "Senior"
    executive = "Executive"
    intermediate = "Intermediate"


class PositionType(str, Enum):
    full_time = "Full-Time"
    part_time = "Part-Time"
    contract = "Contract"
    internship = "Internship"
    volunteer = "Volunteer"


class Category(str, Enum):
    software_engineering = "software-engineering"
    supply_chain = "supply-chain"
    hr = "HR"
    advocacy_policy = "advocacy-policy"
    climate_sustainability = "climate-sustainability"
    investment = "investment"
    sales_account_management = "sales-account-management"
    content = "content"
    marketing_design = "marketing-design"
    product = "product"
    data = "data"
    education = "education"
    finance_legal_compliance = "finance-legal-compliance"
    operations_program_management_strategy = "operations-program-management-strategy"
    science = "science"


class PositionBase(BaseModel):
    title: str
    job_category: Category
    position_type: PositionType
    level_of_experience: LevelOfExperience
    role_description: Optional[str] = None
    education_level: Optional[str] = None
    special_educational_requirements: Optional[str] = None
    workplace_type: Optional[WorkplaceType] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pay_type: Optional[str] = None
    minimum_pay: Optional[float] = None
    maximum_pay: Optional[float] = None
    pay_frequency: Optional[PayFrequency] = None
    closing_date: Optional[str] = None
    external_link: Optional[str] = None
    required_files: Optional[List[str]] = None
    status: Optional[str] = None
    primary_responsibilities: Optional[str] = None
    required_qualifications: Optional[str] = None
    desired_qualifications: Optional[str] = None
    compensation_benefits: Optional[str] = None


class PositionCreate(PositionBase):
    show_recruiter: bool = False


class PositionUpdate(BaseModel):
    title: Optional[str] = None
    job_category: Optional[Category] = None
    position_type: Optional[PositionType] = None
    level_of_experience: Optional[LevelOfExperience] = None
    role_description: Optional[str] = None
    education_level: Optional[str] = None
    special_educational_requirements: Optional[str] = None
    workplace_type: Optional[WorkplaceType] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pay_type: Optional[str] = None
    minimum_pay: Optional[float] = None
    maximum_pay: Optional[float] = None
    pay_frequency: Optional[PayFrequency] = None
    closing_date: Optional[str] = None
    external_link: Optional[str] = None
    required_files: Optional[List[str]] = None
    status: Optional[str] = None
    primary_responsibilities: Optional[str] = None
    required_qualifications: Optional[str] = None
    desired_qualifications: Optional[str] = None
    compensation_benefits: Optional[str] = None
    show_recruiter: Optional[bool] = None


class PositionFilters(BaseModel):
    title: Optional[str] = None
    job_category: Optional[List[Category]] = None
    position_type: Optional[List[PositionType]] = None
    level_of_experience: Optional[List[LevelOfExperience]] = None
    workplace_type: Optional[List[WorkplaceType]] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pay_type: Optional[str] = None
    minimum_pay: Optional[List[float]] = None
    maximum_pay: Optional[List[float]] = None
    pay_frequency: Optional[List[PayFrequency]] = None
    company_name: Optional[str] = None
    pathway: Optional[List[str]] = None


class PositionResponse(PositionBase):
    id: UUID4
    company_name: str
    company_logo_url: str
    created_at: datetime
    pathway: str
    recruiter_name: Optional[str] = None
    recruiter_job_title: Optional[str] = None
    recruiter_email: Optional[str] = None
    recruiter_profile_picture_url: Optional[str] = None
    stage: Optional[Dict[str, bool]] = None

    class Config:
        from_attributes = True


class PathwayCountResponse(BaseModel):
    pathways_count: Dict[str, int]
