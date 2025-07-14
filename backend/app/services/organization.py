from pydantic import UUID4
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.crud import CRUDBase
from app.models.organization import Organizations
from app.models.user import UserTalenthub
from app.schemas.organization import OrganizationCreate, OrganizationUpdate
from app.utils.exceptions import (
    ConflictException,
    DatabaseException,
    PermissionDeniedException,
    ResourceNotFound,
)
from core.constants import error_messages
from core.logger import logger


class OrganizationService:
    def __init__(self):
        self.organization_crud = CRUDBase(model=Organizations)

    def create_organization(
        self, db: Session, organization: OrganizationCreate, user: UserTalenthub
    ) -> Organizations:
        try:
            if not isinstance(user, UserTalenthub):
                raise PermissionDeniedException(
                    message="Only TalentHub users can create organizations"
                )

            organization_data = Organizations(
                created_by=user.id,
                name=organization.name,
                type=organization.type,
                size=organization.size,
                no_of_employees=organization.no_of_employees,
                sector_focus=organization.sector_focus,
                location=organization.location,
                city=organization.city,
                state=organization.state,
                country=organization.country,
                overview=organization.overview,
                benefits=organization.benefits,
                logo_url=organization.logo_url,
            )
            organization = self.organization_crud.create(db=db, obj_in=organization_data)
            return organization
        except IntegrityError:
            db.rollback()
            logger.error(
                "Failed to create organization: IntegrityError - organization already exists"
            )
            raise ConflictException(message=error_messages.CONFLICT_ERROR)
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to create organization: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def get_organization(self, db: Session, user: UserTalenthub) -> Organizations:
        try:
            organization = self.organization_crud.get_by_field(
                db=db, field="created_by", value=user.id
            )
            if not organization:
                raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)
            return organization
        except ResourceNotFound as e:
            logger.error(f"Failed to retrieve organization: {e}")
            raise e
        except Exception as e:
            logger.error(f"Failed to retrieve organization: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def update_organization(
        self,
        db: Session,
        organization_id: UUID4,
        organization_update: OrganizationUpdate,
        user: UserTalenthub,
    ) -> Organizations:
        try:
            organization = self.organization_crud.get(db=db, id=organization_id)
            if not organization:
                raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)

            if organization.created_by != user.id:
                raise PermissionDeniedException(message=error_messages.PERMISSION_DENIED)

            attributes = [
                "name",
                "type",
                "size",
                "no_of_employees",
                "location",
                "city",
                "state",
                "country",
                "overview",
                "benefits",
                "sector_focus",
                "logo_url",
            ]

            for attr in attributes:
                value = getattr(organization_update, attr, None)
                if value is not None:
                    setattr(organization, attr, value)

            updated_organization = self.organization_crud.update(db=db, obj_in=organization)
            return updated_organization
        except (ResourceNotFound, PermissionDeniedException) as e:
            raise e
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to update organization: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)


organization_service = OrganizationService()
