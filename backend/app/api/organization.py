# from fastapi import APIRouter, Depends, HTTPException, status
# from fastapi.encoders import jsonable_encoder
# from fastapi.responses import JSONResponse
# from pydantic import UUID4
# from sqlalchemy.orm import Session

# from app.db.session import get_db
# from app.models.user import Users
# from app.schemas.organization import organizationCreate, organizationResponse, organizationUpdate
# from app.services.organization import organization_service
# from app.services.user import get_active_user
# from app.utils.exceptions import (
#     ConflictException,
#     DatabaseException,
#     PermissionDeniedException,
#     ResourceNotFound,
# )
# from core.constants import error_messages
# from core.logger import logger

# organization_router = APIRouter()


# @organization_router.post("/organization", response_model=organizationResponse, tags=["organizations"])
# def create_organization(
#     organization: organizationCreate,
#     db: Session = Depends(get_db),
#     current_user: Users = Depends(get_active_user),
# ):
#     try:
#         organization_data = organization_service.create_organization(db=db, organization=organization, user=current_user)
#         return JSONResponse(
#             content={
#                 "message": "organization created successfully",
#                 "organization": jsonable_encoder(organizationResponse(**jsonable_encoder(organization_data))),
#             },
#             status_code=status.HTTP_201_CREATED,
#         )
#     except ConflictException as e:
#         logger.error(f"ConflictException: {e.message}")
#         raise HTTPException(status_code=e.status_code, detail=e.message)
#     except DatabaseException as e:
#         logger.error(f"DatabaseException: {e.message}")
#         raise HTTPException(status_code=e.status_code, detail=e.message)
#     except Exception as e:
#         logger.error(f"Unexpected error while creating organization: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=error_messages.INTERNAL_SERVER_ERROR,
#         )


# @organization_router.get("/organization", response_model=organizationResponse, tags=["organizations"])
# def get_organization(db: Session = Depends(get_db), current_user: Users = Depends(get_active_user)):
#     try:
#         organization_data = organization_service.get_organization(db=db, user=current_user)
#         return JSONResponse(
#             content=jsonable_encoder(organizationResponse(**jsonable_encoder(organization_data))),
#             status_code=status.HTTP_200_OK,
#         )
#     except (ResourceNotFound, DatabaseException, PermissionDeniedException) as e:
#         logger.error(f"{e.__class__.__name__}: {e.message}")
#         raise HTTPException(status_code=e.status_code, detail=e.message)
#     except Exception as e:
#         logger.error(f"Unexpected error while retrieving organization: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=error_messages.INTERNAL_SERVER_ERROR,
#         )


# @organization_router.patch("/organization/{id}", response_model=organizationResponse, tags=["organizations"])
# def update_organization(
#     id: UUID4,
#     organization_update: organizationUpdate,
#     db: Session = Depends(get_db),
#     current_user: Users = Depends(get_active_user),
# ):
#     try:
#         updated_organization = organization_service.update_organization(
#             db=db, organization_id=id, organization_update=organization_update, user=current_user
#         )
#         return JSONResponse(
#             content=jsonable_encoder(organizationResponse(**jsonable_encoder(updated_organization))),
#             status_code=status.HTTP_200_OK,
#         )
#     except (ResourceNotFound, DatabaseException, PermissionDeniedException) as e:
#         logger.error(f"{e.__class__.__name__}: {e.message}")
#         raise HTTPException(status_code=e.status_code, detail=e.message)
#     except Exception as e:
#         logger.error(f"Unexpected error while updating organization: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=error_messages.INTERNAL_SERVER_ERROR,
#         )
