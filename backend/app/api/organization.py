# from fastapi import APIRouter, Depends, HTTPException, status
# from fastapi.encoders import jsonable_encoder
# from fastapi.responses import JSONResponse
# from pydantic import UUID4
# from sqlalchemy.orm import Session

# from app.db.session import get_db
# from app.models.user import Users
# from app.schemas.company import CompanyCreate, CompanyResponse, CompanyUpdate
# from app.services.company import company_service
# from app.services.user import get_active_user
# from app.utils.exceptions import (
#     ConflictException,
#     DatabaseException,
#     PermissionDeniedException,
#     ResourceNotFound,
# )
# from core.constants import error_messages
# from core.logger import logger

# company_router = APIRouter()


# @company_router.post("/company", response_model=CompanyResponse, tags=["companies"])
# def create_company(
#     company: CompanyCreate,
#     db: Session = Depends(get_db),
#     current_user: Users = Depends(get_active_user),
# ):
#     try:
#         company_data = company_service.create_company(db=db, company=company, user=current_user)
#         return JSONResponse(
#             content={
#                 "message": "Company created successfully",
#                 "company": jsonable_encoder(CompanyResponse(**jsonable_encoder(company_data))),
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
#         logger.error(f"Unexpected error while creating company: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=error_messages.INTERNAL_SERVER_ERROR,
#         )


# @company_router.get("/company", response_model=CompanyResponse, tags=["companies"])
# def get_company(db: Session = Depends(get_db), current_user: Users = Depends(get_active_user)):
#     try:
#         company_data = company_service.get_company(db=db, user=current_user)
#         return JSONResponse(
#             content=jsonable_encoder(CompanyResponse(**jsonable_encoder(company_data))),
#             status_code=status.HTTP_200_OK,
#         )
#     except (ResourceNotFound, DatabaseException, PermissionDeniedException) as e:
#         logger.error(f"{e.__class__.__name__}: {e.message}")
#         raise HTTPException(status_code=e.status_code, detail=e.message)
#     except Exception as e:
#         logger.error(f"Unexpected error while retrieving company: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=error_messages.INTERNAL_SERVER_ERROR,
#         )


# @company_router.patch("/company/{id}", response_model=CompanyResponse, tags=["companies"])
# def update_company(
#     id: UUID4,
#     company_update: CompanyUpdate,
#     db: Session = Depends(get_db),
#     current_user: Users = Depends(get_active_user),
# ):
#     try:
#         updated_company = company_service.update_company(
#             db=db, company_id=id, company_update=company_update, user=current_user
#         )
#         return JSONResponse(
#             content=jsonable_encoder(CompanyResponse(**jsonable_encoder(updated_company))),
#             status_code=status.HTTP_200_OK,
#         )
#     except (ResourceNotFound, DatabaseException, PermissionDeniedException) as e:
#         logger.error(f"{e.__class__.__name__}: {e.message}")
#         raise HTTPException(status_code=e.status_code, detail=e.message)
#     except Exception as e:
#         logger.error(f"Unexpected error while updating company: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=error_messages.INTERNAL_SERVER_ERROR,
#         )
