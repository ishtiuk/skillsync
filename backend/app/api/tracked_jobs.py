# from core.logger import logger

# from fastapi import APIRouter, Depends, HTTPException, status
# from fastapi.encoders import jsonable_encoder
# from fastapi.responses import JSONResponse
# from pydantic import UUID4
# from sqlalchemy.orm import Session

# from app.db.session import get_db
# from app.models.user import Users
# from app.schemas.applied_jobs import AppliedJobCreate, AppliedJobResponse, AppliedJobUpdate
# from app.schemas.common import PaginationParams
# from app.services.applied_jobs import applied_jobs_service
# from app.services.user import get_active_user
# from app.utils.exceptions import (
#     ConflictException,
#     DatabaseException,
#     ResourceNotFound,
#     ValidationException,
# )
# from core.constants import error_messages


# router = APIRouter()


# @router.post("/jobs", response_model=AppliedJobResponse, tags=["tracked-jobs"])
# def create_job_application(
#     job_data: AppliedJobCreate,
#     db: Session = Depends(get_db),
#     current_user: Users = Depends(get_active_user),
# ):
#     try:
#         job = applied_jobs_service.create_job_application(
#             db=db, user=current_user, job_data=job_data
#         )
#         response_data = applied_jobs_service.format_response(db=db, applied_job=job)
#         return JSONResponse(
#             content=jsonable_encoder(response_data),
#             status_code=status.HTTP_201_CREATED,
#         )
#     except (ValidationException, ConflictException, DatabaseException) as e:
#         logger.error(f"{e.__class__.__name__} in create job application: {e.message}")
#         raise HTTPException(status_code=e.status_code, detail=e.message)
#     except Exception as e:
#         logger.error(f"Unexpected error while creating job application: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=error_messages.INTERNAL_SERVER_ERROR,
#         )


# @router.patch("/jobs/{job_id}", response_model=AppliedJobResponse, tags=["tracked-jobs"])
# def update_job_application(
#     job_id: UUID4,
#     update_data: AppliedJobUpdate,
#     db: Session = Depends(get_db),
#     current_user: Users = Depends(get_active_user),
# ):
#     try:
#         updated_job = applied_jobs_service.update_job_application(
#             db=db, user=current_user, job_id=job_id, update_data=update_data
#         )
#         response_data = applied_jobs_service.format_response(db, updated_job)
#         return JSONResponse(
#             content=jsonable_encoder(response_data),
#             status_code=status.HTTP_200_OK,
#         )
#     except (ResourceNotFound, ValidationException) as e:
#         logger.error(f"{e.__class__.__name__}: {e.message}")
#         raise HTTPException(status_code=e.status_code, detail=e.message)
#     except Exception as e:
#         logger.error(f"Unexpected error while updating job application: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=error_messages.INTERNAL_SERVER_ERROR,
#         )


# @router.get("/jobs", response_model=list[AppliedJobResponse], tags=["tracked-jobs"])
# def get_tracked_jobs(
#     db: Session = Depends(get_db),
#     current_user: Users = Depends(get_active_user),
#     pagination: PaginationParams = Depends(),
# ):
#     try:
#         jobs = applied_jobs_service.get_tracked_jobs(
#             db=db, user=current_user, page=pagination.page, limit=pagination.limit
#         )
#         response_data = [
#             applied_jobs_service.format_response(db=db, applied_job=job) for job in jobs
#         ]
#         return JSONResponse(
#             content=jsonable_encoder(response_data),
#             status_code=status.HTTP_200_OK,
#         )
#     except DatabaseException as e:
#         logger.error(f"Database error in get tracked jobs: {e.message}")
#         raise HTTPException(status_code=e.status_code, detail=e.message)
#     except Exception as e:
#         logger.error(f"Unexpected error while fetching tracked jobs: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=error_messages.INTERNAL_SERVER_ERROR,
#         )


# @router.get("/jobs/{job_id}", response_model=AppliedJobResponse, tags=["tracked-jobs"])
# def get_job_by_id(
#     job_id: UUID4,
#     db: Session = Depends(get_db),
#     current_user: Users = Depends(get_active_user),
# ):
#     try:
#         job = applied_jobs_service.get_job_by_id(db=db, user=current_user, job_id=job_id)
#         response_data = applied_jobs_service.format_response(db=db, applied_job=job)
#         return JSONResponse(
#             content=jsonable_encoder(response_data),
#             status_code=status.HTTP_200_OK,
#         )
#     except ResourceNotFound as e:
#         logger.error(f"Resource not found: {e.message}")
#         raise HTTPException(status_code=e.status_code, detail=e.message)
#     except Exception as e:
#         logger.error(f"Unexpected error while fetching job: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=error_messages.INTERNAL_SERVER_ERROR,
#         )


# @router.delete("/jobs/{job_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["tracked-jobs"])
# def delete_job_application(
#     job_id: UUID4,
#     db: Session = Depends(get_db),
#     current_user: Users = Depends(get_active_user),
# ):
#     try:
#         applied_jobs_service.delete_job_application(db=db, user=current_user, job_id=job_id)
#         return JSONResponse(
#             content={"message": "Tracked Job deleted successfully"},
#             status_code=status.HTTP_200_OK,
#         )
#     except ResourceNotFound as e:
#         logger.error(f"Job application not found: {e.message}")
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
#     except DatabaseException as e:
#         logger.error(f"Database error: {e.message}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=e.message
#         )
