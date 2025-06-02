from pydantic import UUID4
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.crud import CRUDBase
from app.models.organization import Organization
from app.models.user import Users
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
        self.organization_crud = CRUDBase(model=Organization)

    def create_organization(
        self, db: Session, org: OrganizationCreate, user: Users
    ) -> Organization:
        try:
            org_data = Organization(
                created_by=user.id,
                name=org.name,
                type=org.type,
                size=org.size,
                no_of_employees=org.no_of_employees,
                location=org.location,
                city=org.city,
                state=org.state,
                country=org.country,
                overview=org.overview,
                benefits=org.benefits,
                select_career_path=org.select_career_path,
                logo_url=org.logo_url,
            )
            organization = self.organization_crud.create(db=db, obj_in=org_data)
            return organization
        except IntegrityError:
            db.rollback()
            logger.error("Failed to create organization: IntegrityError")
            raise ConflictException(message=error_messages.CONFLICT_ERROR)
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to create organization: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def get_organization(self, db: Session, user: Users) -> Organization:
        try:
            organization = self.organization_crud.get_by_field(
                db=db, field="created_by", value=user.id
            )
            if not organization:
                raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)
            return organization
        except ResourceNotFound as e:
            logger.error(f"Organization not found: {e}")
            raise e
        except Exception as e:
            logger.error(f"Failed to retrieve organization: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def update_organization(
        self, db: Session, org_id: UUID4, org_update: OrganizationUpdate, user: Users
    ) -> Organization:
        try:
            organization = self.organization_crud.get(db=db, id=org_id)
            if not organization:
                raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)

            if organization.created_by != user.id:
                raise PermissionDeniedException(message=error_messages.PERMISSION_DENIED)

            for field, value in org_update.dict(exclude_unset=True).items():
                setattr(organization, field, value)

            updated_org = self.organization_crud.update(db=db, obj_in=organization)
            return updated_org
        except (ResourceNotFound, PermissionDeniedException) as e:
            raise e
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to update organization: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)


organization_service = OrganizationService()
