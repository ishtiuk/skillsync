from core.logger import logger
from typing import Dict, List

from pydantic import UUID4
from sqlalchemy.orm import Session

from app.db.crud import CRUDBase
from app.models.applied_jobs import AppliedJobs
from app.models.user import Users
from app.schemas.applied_jobs import AppliedJobCreate, AppliedJobUpdate
from app.services.job_role import job_role_service
from app.utils.exceptions import ConflictException, DatabaseException, ResourceNotFound
from core.constants import constants, error_messages



applied_jobs_crud = CRUDBase(model=AppliedJobs)


class AppliedJobsService:
    def __init__(self):
        self.base_stages = constants.BASE_JOB_STAGES

    def _order_stages(self, stages: Dict[str, bool]) -> Dict[str, bool]:
        ordered = {}

        for stage in constants.STAGE_ORDER_PREFIX:
            ordered[stage] = stages.get(stage, False)

        interview_stages = sorted(
            [k for k in stages.keys() if k.startswith("interview-")],
            key=lambda x: int(x.split("-")[1]) if x.split("-")[1].isdigit() else float("inf"),
        )
        for stage in interview_stages:
            ordered[stage] = stages[stage]

        for stage in constants.STAGE_ORDER_SUFFIX:
            ordered[stage] = stages.get(stage, False)

        return ordered

    def format_response(self, db: Session, applied_job: AppliedJobs) -> dict:
        job_role = job_role_service.get_single_job_role(db=db, job_role_id=applied_job.job_id)
        job_info = job_role_service.format_job_role_response(job_role=job_role, db=db)

        response_data = {
            "id": applied_job.id,
            "user_id": applied_job.user_id,
            "job_id": applied_job.job_id,
            "activity": applied_job.activity,
            "reaction": applied_job.reaction,
            "notes": applied_job.notes,
            "stage": self._order_stages(applied_job.stage),
            "is_favourite": applied_job.is_favourite,
            "created_at": applied_job.created_at,
            "updated_at": applied_job.updated_at,
            "job_info": job_info,
        }
        return response_data

    def create_job_application(
        self, db: Session, user: Users, job_data: AppliedJobCreate
    ) -> AppliedJobs:
        try:
            existing_application = applied_jobs_crud.get_by_multiple_fields(
                db=db, fields={"user_id": user.id, "job_id": job_data.job_id}
            )

            if existing_application:
                logger.error(
                    f"Job application already exists for user {user.id} and job {job_data.job_id}"
                )
                raise ConflictException(message="You have already applied for this job")

            stage_data = self.base_stages.copy()
            stage_data.update(job_data.stage)

            ordered_stages = self._order_stages(stage_data)

            applied_job = AppliedJobs(
                user_id=user.id,
                job_id=job_data.job_id,
                activity=job_data.activity,
                reaction=job_data.reaction,
                notes=job_data.notes,
                stage=ordered_stages,
                is_favourite=job_data.is_favourite,
            )
            return applied_jobs_crud.create(db=db, obj_in=applied_job)
        except ConflictException as e:
            raise e
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to create job application: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def update_job_application(
        self, db: Session, user: Users, job_id: UUID4, update_data: AppliedJobUpdate
    ) -> AppliedJobs:
        try:
            job_application = applied_jobs_crud.get_by_multiple_fields(
                db=db, fields={"user_id": user.id, "job_id": job_id}
            )
            if not job_application:
                logger.error(f"Job application not found for user {user.id} and job {job_id}")
                raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)

            update_dict = update_data.model_dump(exclude_unset=True, exclude_none=True)

            if "stage" in update_dict:
                current_stages = job_application.stage.copy()
                current_stages.update(update_dict["stage"])
                update_dict["stage"] = self._order_stages(current_stages)

            for field, value in update_dict.items():
                setattr(job_application, field, value)

            return applied_jobs_crud.update(db=db, obj_in=job_application)
        except ResourceNotFound as e:
            raise e
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to update job application: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def get_tracked_jobs(
        self, db: Session, user: Users, page: int = 0, limit: int = 20
    ) -> List[AppliedJobs]:
        try:
            offset = page * limit
            return applied_jobs_crud.get_multi_by_field_sorted(
                db=db,
                field="user_id",
                value=user.id,
                limit=limit,
                offset=offset,
                sort_field="created_at",
                sort_order="desc",
            )
        except Exception as e:
            logger.error(f"Failed to get tracked jobs: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def get_job_by_id(self, db: Session, user: Users, job_id: UUID4) -> AppliedJobs:
        job = applied_jobs_crud.get_by_multiple_fields(
            db=db, fields={"user_id": user.id, "job_id": job_id}
        )
        if not job:
            logger.error(f"Job not found for user {user.id} and job {job_id}")
            raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)
        return job
    
    def delete_job_application(self, db: Session, user: Users, job_id: UUID4) -> None:
        job_application = applied_jobs_crud.get_by_multiple_fields(
            db=db, fields={"user_id": user.id, "job_id": job_id}
        )
        if not job_application:
            logger.error(f"Job application not found for user {user.id} and job {job_id}")
            raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)

        try:
            applied_jobs_crud.remove(db=db, id=job_application.id)
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to delete job application: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

applied_jobs_service = AppliedJobsService()
