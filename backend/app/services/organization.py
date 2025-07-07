# from pydantic import UUID4
# from sqlalchemy.exc import IntegrityError
# from sqlalchemy.orm import Session

# from app.db.crud import CRUDBase
# from app.models.organization import organizations
# from app.models.user import Users
# from app.schemas.organization import organizationCreate, organizationUpdate
# from app.utils.exceptions import (
#     ConflictException,
#     DatabaseException,
#     PermissionDeniedException,
#     ResourceNotFound,
# )
# from core.constants import error_messages
# from core.logger import logger


# class organizationService:
#     def __init__(self):
#         self.organization_crud = CRUDBase(model=organizations)

#     def create_organization(self, db: Session, organization: organizationCreate, user: Users) -> organizations:
#         try:
#             organization_data = organizations(
#                 created_by=user.id,
#                 name=organization.name,
#                 type=organization.type,
#                 size=organization.size,
#                 no_of_employees=organization.no_of_employees,
#                 is_bipoc_owned=organization.is_bipoc_owned,
#                 location=organization.location,
#                 city=organization.city,
#                 state=organization.state,
#                 country=organization.country,
#                 overview=organization.overview,
#                 benefits=organization.benefits,
#                 select_a_pathway=organization.select_a_pathway,
#                 logo_url=organization.logo_url,
#             )
#             organization = self.organization_crud.create(db=db, obj_in=organization_data)
#             return organization
#         except IntegrityError:
#             db.rollback()
#             logger.error("Failed to create organization: IntegrityError - organization already exists")
#             raise ConflictException(message=error_messages.CONFLICT_ERROR)
#         except Exception as e:
#             db.rollback()
#             logger.error(f"Failed to create organization: {e}")
#             raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

#     def get_organization(self, db: Session, user: Users) -> organizations:
#         try:
#             organization = self.organization_crud.get_by_field(db=db, field="created_by", value=user.id)
#             if not organization:
#                 raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)
#             return organization
#         except ResourceNotFound as e:
#             logger.error(f"Failed to retrieve organization: {e}")
#             raise e
#         except Exception as e:
#             logger.error(f"Failed to retrieve organization: {e}")
#             raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

#     def update_organization(
#         self, db: Session, organization_id: UUID4, organization_update: organizationUpdate, user: Users
#     ) -> organizations:
#         try:
#             organization = self.organization_crud.get(db=db, id=organization_id)
#             if not organization:
#                 raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)

#             if organization.created_by != user.id:
#                 raise PermissionDeniedException(message=error_messages.PERMISSION_DENIED)

#             attributes = [
#                 "name",
#                 "type",
#                 "size",
#                 "no_of_employees",
#                 "is_bipoc_owned",
#                 "location",
#                 "city",
#                 "state",
#                 "country",
#                 "overview",
#                 "benefits",
#                 "select_a_pathway",
#             ]

#             for attr in attributes:
#                 value = getattr(organization_update, attr, None)
#                 if value is not None:
#                     setattr(organization, attr, value)

#             updated_organization = self.organization_crud.update(db=db, obj_in=organization)
#             return updated_organization
#         except (ResourceNotFound, PermissionDeniedException) as e:
#             raise e
#         except Exception as e:
#             db.rollback()
#             logger.error(f"Failed to update organization: {e}")
#             raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)


# organization_service = organizationService()
