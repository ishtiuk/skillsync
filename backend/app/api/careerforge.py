from fastapi import APIRouter, Depends, HTTPException, status, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.user import get_active_user
from app.models.user import Users
from app.services.resume import resume_service  # We'll create this later
from app.services.portfolio import portfolio_service  # We'll create this later
from app.services.job_matching import job_matching_service  # We'll create this later

router = APIRouter(tags=["careerforge"])

@router.post("/resume/analyze")
async def analyze_resume(
    file: UploadFile,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_active_user)
):
    """Analyze resume and extract skills, experience, etc."""
    return {"message": "Resume analysis endpoint"}

@router.post("/portfolio/showcase")
async def create_showcase(
    project: PortfolioCreate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_active_user)
):
    """Create or update portfolio showcase"""
    return {"message": "Portfolio showcase endpoint"}

@router.get("/jobs/match")
async def match_jobs(
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_active_user)
):
    """Get job matches based on user profile and preferences"""
    return {"message": "Job matching endpoint"}

@router.get("/achievements/progress")
async def get_achievements(
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_active_user)
):
    """Get user's achievement progress"""
    return {"message": "Achievements endpoint"}


@cover_letter_router.post("/generate", response_model=CoverLetterResponse)
def generate_cover_letter(
    cov_data: CoverLetterRequest,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_active_user),
):
    try:
        generated_cover_letter = cover_letter_service.get_cover_letter(cover_letter_request=cov_data, db=db, user=current_user)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=jsonable_encoder({"cover_letter": generated_cover_letter}),
        )
    except Exception as e:
        logger.error(f"Error generating cover letter: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while generating the cover letter.",
        )
