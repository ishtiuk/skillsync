from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import UUID4
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import Users
from app.schemas.common import PaginationParams
from app.schemas.job_role import (
    JobRoleCreate,
    JobRoleFilters,
    JobRoleResponse,
    JobRoleUpdate,
    PathwayCountResponse,
)
from app.services.job_role import job_role_service
from app.services.user import get_active_user
from app.utils.exceptions import DatabaseException, PermissionDeniedException, ResourceNotFound
from core.constants import error_messages
from core.logger import logger

router = APIRouter()


@router.post("/job-role", response_model=JobRoleResponse, tags=["job-roles"])
def create_job_role(
    job_role_in: JobRoleCreate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_active_user),
):
    try:
        job_role = job_role_service.create_job_role(
            db=db, job_role_in=job_role_in, user=current_user
        )
        response_data = job_role_service.format_job_role_response(job_role=job_role, db=db)
        return JSONResponse(
            content=jsonable_encoder(response_data),
            status_code=status.HTTP_201_CREATED,
        )
    except (ResourceNotFound, DatabaseException) as e:
        logger.error(f"{e.__class__.__name__}: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error while creating job role: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@router.patch("/job-role/{id}", response_model=JobRoleResponse, tags=["job-roles"])
def update_job_role(
    id: UUID4,
    job_role_in: JobRoleUpdate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_active_user),
):
    try:
        job_role = job_role_service.update_job_role(
            db=db, job_role_id=id, job_role_in=job_role_in, user=current_user
        )
        response_data = job_role_service.format_job_role_response(job_role=job_role, db=db)
        return JSONResponse(
            content=jsonable_encoder(response_data),
            status_code=status.HTTP_200_OK,
        )
    except (ResourceNotFound, DatabaseException, PermissionDeniedException) as e:
        logger.error(f"{e.__class__.__name__}: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error while updating job role: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@router.post("/job-roles/pathways", response_model=list[JobRoleResponse], tags=["job-roles"])
def get_job_roles_for_pathways(
    filters: JobRoleFilters,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_active_user),
    pagination: PaginationParams = Depends(),
):
    try:
        job_roles = job_role_service.get_job_roles_for_pathways(
            db=db,
            user=current_user,
            filters=filters.model_dump(exclude_none=True, exclude_unset=True),
            page=pagination.page,
            limit=pagination.limit,
        )
        response_data = [
            job_role_service.format_job_role_response(
                job_role=job_role, db=db, include_stage=True, user_id=current_user.id
            )
            for job_role in job_roles
        ]
        return JSONResponse(
            content=jsonable_encoder(response_data),
            status_code=status.HTTP_200_OK,
        )
    except (ResourceNotFound, DatabaseException) as e:
        logger.error(f"{e.__class__.__name__}: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Failed to get job roles for pathways: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@router.get("/job-roles/candid", response_model=list[JobRoleResponse], tags=["job-roles"])
def get_job_roles_for_candid(
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_active_user),
    pagination: PaginationParams = Depends(),
):
    try:
        job_roles = job_role_service.get_job_roles_for_candid(
            db=db, user=current_user, page=pagination.page, limit=pagination.limit
        )
        response_data = [
            job_role_service.format_job_role_response(job_role=job_role, db=db)
            for job_role in job_roles
        ]
        return JSONResponse(
            content=jsonable_encoder(response_data),
            status_code=status.HTTP_200_OK,
        )
    except (ResourceNotFound, DatabaseException) as e:
        logger.error(f"{e.__class__.__name__}: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Failed to get job roles for candid: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@router.get("/job-role/public/{id}", response_model=JobRoleResponse, tags=["job-roles"])
def get_single_job_role(
    id: UUID4,
    db: Session = Depends(get_db),
):
    try:
        job_role = job_role_service.get_single_job_role(db=db, job_role_id=id)
        response_data = job_role_service.format_job_role_response(
            job_role=job_role, db=db, include_stage=False
        )
        return JSONResponse(
            content=jsonable_encoder(response_data),
            status_code=status.HTTP_200_OK,
        )
    except ResourceNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Failed to get job role: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@router.get("/job-roles/pathways/count", response_model=PathwayCountResponse, tags=["job-roles"])
def get_pathway_job_counts(
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_active_user),
):
    try:
        counts = job_role_service.get_pathway_job_counts(db=db)
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
