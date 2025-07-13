from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import UUID4
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import UserCareerforge, UserTalenthub
from app.schemas.common import PaginationParams
from app.schemas.positions import (
    PositionCreate,
    PositionFilters,
    PositionResponse,
    PositionUpdate,
    SectorCountResponse,
)
from app.schemas.user import Platform
from app.services.positions import position_service
from app.services.user import get_active_user, get_platform
from app.utils.exceptions import DatabaseException, PermissionDeniedException, ResourceNotFound
from core.constants import error_messages
from core.logger import logger

router = APIRouter()


@router.post("/positions", response_model=PositionResponse, tags=["positions"])
def create_position(
    position_in: PositionCreate,
    db: Session = Depends(get_db),
    current_user_info: tuple[UserTalenthub, str] = Depends(get_active_user),
    platform: Platform = Depends(get_platform),
):
    try:
        current_user, _ = current_user_info
        position = position_service.create_position(
            db=db, position_in=position_in, user=current_user, platform=platform
        )
        response_data = position_service.format_position_response(position=position, db=db)
        return JSONResponse(
            content=jsonable_encoder(response_data),
            status_code=status.HTTP_201_CREATED,
        )
    except (ResourceNotFound, DatabaseException) as e:
        logger.error(f"{e.__class__.__name__}: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error while creating position: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@router.patch("/positions/{id}", response_model=PositionResponse, tags=["positions"])
def update_position(
    id: UUID4,
    position_in: PositionUpdate,
    db: Session = Depends(get_db),
    current_user_info: tuple[UserTalenthub, str] = Depends(get_active_user),
    platform: Platform = Depends(get_platform),
):
    try:
        current_user, _ = current_user_info
        position = position_service.update_position(
            db=db, position_id=id, position_in=position_in, user=current_user, platform=platform
        )
        response_data = position_service.format_position_response(position=position, db=db)
        return JSONResponse(
            content=jsonable_encoder(response_data),
            status_code=status.HTTP_200_OK,
        )
    except (ResourceNotFound, DatabaseException, PermissionDeniedException) as e:
        logger.error(f"{e.__class__.__name__}: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error while updating position: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@router.post("/positions/careerforge", response_model=list[PositionResponse], tags=["positions"])
def get_positions_for_careerforge(
    filters: PositionFilters,
    db: Session = Depends(get_db),
    current_user_info: tuple[UserCareerforge, str] = Depends(get_active_user),
    platform: Platform = Depends(get_platform),
    pagination: PaginationParams = Depends(),
):
    try:
        current_user, _ = current_user_info
        positions = position_service.get_positions_for_careerforge(
            db=db,
            user=current_user,
            platform=platform,
            filters=filters.model_dump(exclude_none=True, exclude_unset=True),
            page=pagination.page,
            limit=pagination.limit,
        )
        response_data = [
            position_service.format_position_response(
                position=position, db=db, include_stage=True, user_id=current_user.id
            )
            for position in positions
        ]
        return JSONResponse(
            content=jsonable_encoder(response_data),
            status_code=status.HTTP_200_OK,
        )
    except (ResourceNotFound, DatabaseException) as e:
        logger.error(f"{e.__class__.__name__}: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Failed to get positions for careerforge: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@router.get("/positions/talenthub", response_model=list[PositionResponse], tags=["positions"])
def get_positions_for_talenthub(
    db: Session = Depends(get_db),
    current_user_info: tuple[UserTalenthub, str] = Depends(get_active_user),
    platform: Platform = Depends(get_platform),
    pagination: PaginationParams = Depends(),
):
    try:
        current_user, _ = current_user_info
        positions = position_service.get_positions_for_talenthub(
            db=db,
            user=current_user,
            platform=platform,
            page=pagination.page,
            limit=pagination.limit,
        )
        response_data = [
            position_service.format_position_response(position=position, db=db)
            for position in positions
        ]
        return JSONResponse(
            content=jsonable_encoder(response_data),
            status_code=status.HTTP_200_OK,
        )
    except (ResourceNotFound, DatabaseException) as e:
        logger.error(f"{e.__class__.__name__}: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Failed to get positions for candid: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@router.get("/positions/public/{id}", response_model=PositionResponse, tags=["positions"])
def get_single_position(
    id: UUID4,
    db: Session = Depends(get_db),
):
    try:
        position = position_service.get_single_position(db=db, position_id=id)
        response_data = position_service.format_position_response(
            position=position, db=db, include_stage=False
        )
        return JSONResponse(
            content=jsonable_encoder(response_data),
            status_code=status.HTTP_200_OK,
        )
    except ResourceNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Failed to get position: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@router.get("/positions/careerforge/count", response_model=SectorCountResponse, tags=["job-roles"])
def get_sector_job_counts(
    db: Session = Depends(get_db),
    current_user_info: tuple[UserCareerforge, str] = Depends(get_active_user),
    platform: Platform = Depends(get_platform),
):
    try:
        current_user, _ = current_user_info
        counts = position_service.get_sector_job_counts(db=db, user=current_user, platform=platform)
        return JSONResponse(
            content=jsonable_encoder(counts),
            status_code=status.HTTP_200_OK,
        )
    except DatabaseException as e:
        logger.error(f"DatabaseException: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Failed to get pathway job counts: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )
