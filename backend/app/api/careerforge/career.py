from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.db.session import get_db
from app.models.core.user import UserCareerForge
from app.services.careerforge.career import career_service
from app.services.user import get_active_user, get_career_forge_user
from app.schemas.career import (
    ApplicationResponse,
    ApplicationCreate,
    ExperienceCreate,
    ExperienceResponse,
    PortfolioCreate,
    PortfolioResponse,
    MilestoneCreate,
    MilestoneResponse
)

careers_router = APIRouter(tags=["careerforge"])

# Job Applications
@careers_router.post("/jobs/apply", response_model=ApplicationResponse)
async def apply_for_job(
    application: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: UserCareerForge = Depends(get_career_forge_user)
):
    """Apply for a job position"""
    result = career_service.apply_for_job(db, current_user, application)
    return ApplicationResponse.from_orm(result)

@careers_router.get("/jobs/applications", response_model=List[ApplicationResponse])
async def get_applications(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: UserCareerForge = Depends(get_career_forge_user)
):
    """Get user's job applications"""
    applications = career_service.get_job_applications(
        db, current_user, status, skip, limit
    )
    return [ApplicationResponse.from_orm(app) for app in applications]

# Experience
@careers_router.post("/experience", response_model=ExperienceResponse)
async def add_experience(
    experience: ExperienceCreate,
    db: Session = Depends(get_db),
    current_user: UserCareerForge = Depends(get_career_forge_user)
):
    """Add work experience"""
    result = career_service.add_experience(db, current_user, experience)
    return ExperienceResponse.from_orm(result)

# Portfolio
@careers_router.post("/portfolio", response_model=PortfolioResponse)
async def add_portfolio_project(
    project: PortfolioCreate,
    db: Session = Depends(get_db),
    current_user: UserCareerForge = Depends(get_career_forge_user)
):
    """Add portfolio project"""
    result = career_service.add_portfolio_project(db, current_user, project)
    return PortfolioResponse.from_orm(result)

# Milestones
@careers_router.post("/milestones", response_model=MilestoneResponse)
async def add_milestone(
    milestone: MilestoneCreate,
    db: Session = Depends(get_db),
    current_user: UserCareerForge = Depends(get_career_forge_user)
):
    """Add career milestone"""
    result = career_service.add_milestone(db, current_user, milestone)
    return MilestoneResponse.from_orm(result)
