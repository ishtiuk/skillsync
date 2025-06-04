from pydantic import UUID4
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.crud import CRUDBase
from app.models.company import Companies
from app.models.user import Users
from app.schemas.company import CompanyCreate, CompanyUpdate
from app.utils.exceptions import (
    ConflictException,
    DatabaseException,
    PermissionDeniedException,
    ResourceNotFound,
)
from core.constants import error_messages
from core.logger import logger


class CompanyService:
    def __init__(self):
        self.company_crud = CRUDBase(model=Companies)

    def create_company(self, db: Session, company: CompanyCreate, user: Users) -> Companies:
        try:
            company_data = Companies(
                created_by=user.id,
                name=company.name,
                type=company.type,
                size=company.size,
                no_of_employees=company.no_of_employees,
                is_bipoc_owned=company.is_bipoc_owned,
                location=company.location,
                city=company.city,
                state=company.state,
                country=company.country,
                overview=company.overview,
                benefits=company.benefits,
                select_a_pathway=company.select_a_pathway,
                logo_url=company.logo_url,
            )
            company = self.company_crud.create(db=db, obj_in=company_data)
            return company
        except IntegrityError:
            db.rollback()
            logger.error("Failed to create company: IntegrityError - Company already exists")
            raise ConflictException(message=error_messages.CONFLICT_ERROR)
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to create company: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def get_company(self, db: Session, user: Users) -> Companies:
        try:
            company = self.company_crud.get_by_field(db=db, field="created_by", value=user.id)
            if not company:
                raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)
            return company
        except ResourceNotFound as e:
            logger.error(f"Failed to retrieve company: {e}")
            raise e
        except Exception as e:
            logger.error(f"Failed to retrieve company: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def update_company(
        self, db: Session, company_id: UUID4, company_update: CompanyUpdate, user: Users
    ) -> Companies:
        try:
            company = self.company_crud.get(db=db, id=company_id)
            if not company:
                raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)

            if company.created_by != user.id:
                raise PermissionDeniedException(message=error_messages.PERMISSION_DENIED)

            attributes = [
                "name",
                "type",
                "size",
                "no_of_employees",
                "is_bipoc_owned",
                "location",
                "city",
                "state",
                "country",
                "overview",
                "benefits",
                "select_a_pathway",
            ]

            for attr in attributes:
                value = getattr(company_update, attr, None)
                if value is not None:
                    setattr(company, attr, value)

            updated_company = self.company_crud.update(db=db, obj_in=company)
            return updated_company
        except (ResourceNotFound, PermissionDeniedException) as e:
            raise e
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to update company: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)


company_service = CompanyService()
