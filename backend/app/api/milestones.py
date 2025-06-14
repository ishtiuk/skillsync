from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import UUID4
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import UserCareerforge
from app.schemas.milestones import MilestoneCreate, MilestoneResponse, MilestoneUpdate
from app.services.milestones import MilestonesService
from app.services.user import get_active_user
from app.utils.exceptions import DatabaseException, ResourceNotFound
from core.constants import error_messages
from core.logger import logger

router = APIRouter(tags=["milestones"])
milestones_service = MilestonesService()


@router.post("/milestones", response_model=MilestoneResponse)
def create_milestone(
    milestone_in: MilestoneCreate,
    db: Session = Depends(get_db),
    current_user_info: tuple[UserCareerforge, str] = Depends(get_active_user),
):
    current_user, _ = current_user_info
    try:
        milestone = milestones_service.create_milestone(
            db=db, user_id=current_user.id, milestone_in=milestone_in
        )
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content=jsonable_encoder(MilestoneResponse.model_validate(milestone)),
        )
    except DatabaseException as e:
        logger.error(f"Failed to create milestone: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error while creating milestone: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@router.get("/milestones", response_model=list[MilestoneResponse])
def get_user_milestones(
    db: Session = Depends(get_db),
    current_user_info: tuple[UserCareerforge, str] = Depends(get_active_user),
):
    current_user, _ = current_user_info
    try:
        milestones = milestones_service.get_user_milestones(db=db, user_id=current_user.id)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=jsonable_encoder([MilestoneResponse.model_validate(m) for m in milestones]),
        )
    except DatabaseException as e:
        logger.error(f"Failed to get milestones: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error while fetching milestones: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@router.get("/milestones/{id}", response_model=MilestoneResponse)
def get_milestone(
    id: UUID4,
    db: Session = Depends(get_db),
    current_user_info: tuple[UserCareerforge, str] = Depends(get_active_user),
):
    current_user, _ = current_user_info
    try:
        milestone = milestones_service.get_milestone_by_id(db=db, id=id)
        if milestone.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this milestone",
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=jsonable_encoder(MilestoneResponse.model_validate(milestone)),
        )
    except ResourceNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error while fetching milestone: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@router.patch("/milestones/{id}", response_model=MilestoneResponse)
def update_milestone(
    id: UUID4,
    milestone_in: MilestoneUpdate,
    db: Session = Depends(get_db),
    current_user_info: tuple[UserCareerforge, str] = Depends(get_active_user),
):
    current_user, _ = current_user_info
    try:
        milestone = milestones_service.get_milestone_by_id(db=db, id=id)
        if milestone.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this milestone",
            )
        updated_milestone = milestones_service.update_milestone(
            db=db, id=id, milestone_in=milestone_in
        )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=jsonable_encoder(MilestoneResponse.model_validate(updated_milestone)),
        )
    except ResourceNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error while updating milestone: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@router.patch("/milestones/{id}/complete", response_model=MilestoneResponse)
def mark_milestone_completed(
    id: UUID4,
    db: Session = Depends(get_db),
    current_user_info: tuple[UserCareerforge, str] = Depends(get_active_user),
):
    current_user, _ = current_user_info
    try:
        milestone = milestones_service.get_milestone_by_id(db=db, id=id)
        if milestone.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this milestone",
            )
        updated_milestone = milestones_service.mark_milestone_completed(db=db, id=id)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=jsonable_encoder(MilestoneResponse.model_validate(updated_milestone)),
        )
    except ResourceNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error while completing milestone: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )
