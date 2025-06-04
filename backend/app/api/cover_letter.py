from core.logger import logger

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import Users
from app.schemas.cover_letter import CoverLetterRequest, CoverLetterResponse
from app.services.cover_letter import cover_letter_service
from app.services.user import get_active_user



cover_letter_router = APIRouter()

@cover_letter_router.post("/generate", response_model=CoverLetterResponse, tags=["cover_letter"])
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
