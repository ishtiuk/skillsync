from datetime import datetime

from pydantic import UUID4
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.db.crud import CRUDBase
from app.models.organization import Organizations
from app.models.positions import Positions
from app.models.tracked_jobs import TrackedJobs
from app.models.user import UserCareerforge, UserTalenthub
from app.schemas.positions import PositionCreate, PositionUpdate, SectorCountResponse
from app.schemas.user import Platform
from app.utils.exceptions import (
    DatabaseException,
    PermissionDeniedException,
    ResourceNotFound,
    ValidationException,
)
from core.constants import error_messages
from core.logger import logger


class PositionService:
    def __init__(self):
        self.positions_crud = CRUDBase(model=Positions)
        self.organization_crud = CRUDBase(model=Organizations)
        self.careerforge_user_crud = CRUDBase(model=UserCareerforge)
        self.talent_user_crud = CRUDBase(model=UserTalenthub)

    def create_position(
        self, db: Session, position_in: PositionCreate, user: UserTalenthub, platform: Platform
    ) -> Positions:
        try:
            if not isinstance(user, UserTalenthub):
                raise PermissionDeniedException(message="Only Talenthub users can create positions")

            organization = self.organization_crud.get_by_field(
                db, field="created_by", value=user.id
            )
            if not organization:
                raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)

            # Validate closing_date format
            if position_in.closing_date:
                try:
                    datetime.strptime(position_in.closing_date, "%Y-%m-%d")
                except ValueError:
                    raise ValidationException("closing_date must be in YYYY-MM-DD format")

            position_data = Positions(
                user_id=user.id,
                organization_id=organization.id,
                title=position_in.title,
                job_category=position_in.job_category,
                position_type=position_in.position_type,
                level_of_experience=position_in.level_of_experience,
                role_description=position_in.role_description,
                education_level=position_in.education_level,
                special_educational_requirements=position_in.special_educational_requirements,
                workplace_type=position_in.workplace_type,
                city=position_in.city,
                state=position_in.state,
                country=position_in.country,
                pay_type=position_in.pay_type,
                minimum_pay=position_in.minimum_pay,
                maximum_pay=position_in.maximum_pay,
                pay_frequency=position_in.pay_frequency,
                closing_date=position_in.closing_date,
                external_link=position_in.external_link,
                required_files=position_in.required_files,
                status=position_in.status,
                primary_responsibilities=position_in.primary_responsibilities,
                required_qualifications=position_in.required_qualifications,
                desired_qualifications=position_in.desired_qualifications,
                compensation_benefits=position_in.compensation_benefits,
                show_recruiter=position_in.show_recruiter,
            )
            position = self.positions_crud.create(db=db, obj_in=position_data)
            return position
        except ResourceNotFound:
            db.rollback()
            raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)
        except ValidationException as e:
            db.rollback()
            raise ValidationException(message=str(e))
        except IntegrityError as e:
            db.rollback()
            logger.error(f"Database integrity error: {e}")
            raise DatabaseException(message="Database integrity constraint violation")
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Database error: {e}")
            raise DatabaseException(message="Database operation failed")
        except Exception as e:
            db.rollback()
            logger.error(f"Unexpected error: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def update_position(
        self,
        db: Session,
        position_id: UUID4,
        position_in: PositionUpdate,
        user: UserTalenthub,
        platform: Platform,
    ) -> Positions:
        if not isinstance(user, UserTalenthub):
            raise PermissionDeniedException(message="Only Talenthub users can update positions")
        try:
            position = self.positions_crud.get(db=db, id=position_id)
            if not position:
                raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)

            if position.user_id != user.id:
                raise PermissionDeniedException(message=error_messages.PERMISSION_DENIED)

            attributes = [
                "title",
                "job_category",
                "position_type",
                "level_of_experience",
                "role_description",
                "education_level",
                "special_educational_requirements",
                "workplace_type",
                "city",
                "state",
                "country",
                "pay_type",
                "minimum_pay",
                "maximum_pay",
                "pay_frequency",
                "closing_date",
                "external_link",
                "required_files",
                "status",
                "primary_responsibilities",
                "required_qualifications",
                "desired_qualifications",
                "compensation_benefits",
                "show_recruiter",
            ]

            for attr in attributes:
                value = getattr(position_in, attr, None)
                if value is not None:
                    setattr(position, attr, value)

            return self.positions_crud.update(db=db, obj_in=position)
        except (ResourceNotFound, PermissionDeniedException) as e:
            db.rollback()
            raise e
        except Exception:
            db.rollback()
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def get_positions_for_careerforge(
        self,
        db: Session,
        user: UserCareerforge,
        platform: Platform,
        filters: dict,
        page: int,
        limit: int = 5000,
    ) -> list[Positions]:
        if not isinstance(user, UserCareerforge):
            raise PermissionDeniedException(
                message="Only Careerforge users can access this endpoint"
            )
        try:
            offset = page * limit
            filter_copy = filters.copy()

            # Handle organization name filter
            organization_name = filter_copy.pop("organization_name", None)

            # Build organization filters
            organization_filters = {}
            if organization_name:
                organization_filters["name"] = organization_name

            # Get organizations matching filters
            if organization_filters:
                organizations = self.organization_crud.get_multi_by_filters(
                    db, filters=organization_filters
                )
                if not organizations:
                    logger.info("No organizations match the filters, returning empty result.")
                    return []
                filter_copy["organization_id"] = [organization.id for organization in organizations]

            list_filters = [
                "job_category",
                "position_type",
                "level_of_experience",
                "workplace_type",
                "pay_frequency",
                "sector_focus",
            ]
            for key in list_filters:
                if key in filter_copy and not isinstance(filter_copy[key], list):
                    filter_copy[key] = [filter_copy[key]]

            sector_focus = filter_copy.pop("sector_focus", None)
            if sector_focus:
                filter_copy["sector_focus"] = sector_focus

            min_pays = filter_copy.pop("minimum_pay", None)
            max_pays = filter_copy.pop("maximum_pay", None)

            positions = self.positions_crud.get_filtered_positions(
                db=db,
                filters=filter_copy,
                organization_model=organizations,
                min_pays=min_pays,
                max_pays=max_pays,
                limit=limit,
                offset=offset,
                sort_field="created_at",
                sort_order="desc",
            )

            return positions

        except Exception as e:
            logger.error(f"Failed to get positions for careerforge: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def get_positions_for_talenthub(
        self,
        db: Session,
        user: UserTalenthub,
        platform: Platform,
        page: int,
        limit: int,
    ) -> list[Positions]:
        if not isinstance(user, UserTalenthub):
            raise PermissionDeniedException(message="Only Talenthub users can access this endpoint")
        try:
            offset = page * limit
            organization = self.organization_crud.get_by_field(
                db, field="created_by", value=user.id
            )
            if not organization:
                logger.error("organization does not exist. Create organization first.")
                raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)

            return self.positions_crud.get_multi_by_field_sorted(
                db=db,
                field="organization_id",
                value=organization.id,
                limit=limit,
                offset=offset,
                sort_field="created_at",
                sort_order="desc",
            )
        except Exception as e:
            logger.error(f"Failed to get positions for candid: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def get_single_position(self, db: Session, position_id: str) -> Positions:
        position = self.positions_crud.get(db=db, id=position_id)
        if not position:
            logger.error(f"position with ID {position_id} not found.")
            raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)
        return position

    def format_position_response(
        self, position: Positions, db: Session, include_stage: bool = True, user_id: UUID4 = None
    ) -> dict:
        organization = self.organization_crud.get(db=db, id=position.organization_id)
        response_data = {
            "id": position.id,
            "organization_name": organization.name,
            "organization_logo_url": organization.logo_url,
            "title": position.title,
            "job_category": position.job_category,
            "sector_focus": organization.sector_focus,
            "position_type": position.position_type,
            "level_of_experience": position.level_of_experience,
            "role_description": position.role_description,
            "education_level": position.education_level,
            "special_educational_requirements": position.special_educational_requirements,
            "workplace_type": position.workplace_type,
            "city": position.city,
            "state": position.state,
            "country": position.country,
            "pay_type": position.pay_type,
            "minimum_pay": position.minimum_pay,
            "maximum_pay": position.maximum_pay,
            "pay_frequency": position.pay_frequency,
            "closing_date": position.closing_date,
            "external_link": position.external_link,
            "required_files": position.required_files,
            "status": position.status,
            "primary_responsibilities": position.primary_responsibilities,
            "required_qualifications": position.required_qualifications,
            "desired_qualifications": position.desired_qualifications,
            "compensation_benefits": position.compensation_benefits,
            "created_at": position.created_at,
        }

        if position.show_recruiter:
            recruiter = self.talent_user_crud.get(db=db, id=position.user_id)
            response_data.update(
                {
                    "recruiter_name": f"{recruiter.first_name} {recruiter.last_name}",
                    "recruiter_job_title": recruiter.current_job_title,
                    "recruiter_email": recruiter.email,
                    "recruiter_profile_picture_url": recruiter.profile_picture_url,
                }
            )

        # Add stage information if requested and user_id is provided
        if include_stage and user_id:
            applied_job = (
                db.query(TrackedJobs)
                .filter(TrackedJobs.job_id == position.id, TrackedJobs.user_id == user_id)
                .first()
            )

            response_data["stage"] = (
                applied_job.stage
                if applied_job
                else {
                    "saved": False,
                    "applied": False,
                    "interview-1": False,
                    "offer": False,
                    "hired": False,
                    "past-roles": False,
                    "ineligible": False,
                }
            )

        return response_data

    def get_sector_job_counts(
        self, db: Session, user: UserCareerforge, platform: Platform
    ) -> SectorCountResponse:
        if not isinstance(user, UserCareerforge):
            raise PermissionDeniedException(
                message="Only Careerforge users can access sector job counts"
            )
        try:
            sector_counts = self.positions_crud.get_sector_counts(
                db=db,
                platform=platform.value.lower(),
                organization_model=Organizations,
                position_model=Positions,
            )
            return SectorCountResponse(sectors_count=sector_counts)
        except Exception as e:
            logger.error(f"Failed to get sector job counts: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)


position_service = PositionService()
