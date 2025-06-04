from typing import Union

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import UUID4
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import UserCandid, UserPathways
from app.schemas.user import (
    CreateExp,
    ExpResponse,
    GoogleLoginRequest,
    GoogleUserCreate,
    LoginRequest,
    PasswordResetRequest,
    Platform,
    PublicUserResponse,
    UpdateExp,
    UpdatePasswordRequest,
    UserCreateRequest,
    UserResponse,
    UserUpdateRequest,
)
from app.services.google_auth import google_auth_service
from app.services.user import get_active_user, get_platform, user_service
from app.utils.exceptions import (
    DatabaseException,
    GoogleAuthException,
    InvalidUserException,
    ResourceNotFound,
    ConflictException
)
from app.utils.security import create_access_token
from core.constants import error_messages
from core.logger import logger

user_router = APIRouter()


@user_router.post("/auth/login/self", tags=["auth"])
def login(request: LoginRequest, db: Session = Depends(get_db)):
    try:
        if user_service.validate_user(
            email=request.email, password=request.password, platform=request.platform, db=db
        ):
            access_token = create_access_token(subject=request.email, platform=request.platform)
            return JSONResponse(
                content={"message": "Successfully Logged In", "access_token": access_token},
                status_code=status.HTTP_200_OK,
            )
    except InvalidUserException as e:
        logger.error(f"Login failed: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error during login: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@user_router.post("/auth/logout", tags=["auth"])
def logout():
    try:
        return JSONResponse(
            content={"message": "Successfully logged out"}, status_code=status.HTTP_200_OK
        )
    except Exception as e:
        logger.error(f"Logout failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@user_router.post("/user/self", response_model=UserResponse, tags=["users"])
def create_user(user_data: UserCreateRequest, db: Session = Depends(get_db)):
    try:
        user = user_service.create_user_in_db(db=db, user=user_data)

        response_data = {
            **jsonable_encoder(user),
            "platform": user_data.platform,
            "provider": user_data.provider,
        }

        access_token = create_access_token(subject=user.email, platform=user_data.platform)

        return JSONResponse(
            content={
                "message": "User created successfully",
                "user": jsonable_encoder(UserResponse(**response_data)),
                "access_token": access_token,
            },
            status_code=status.HTTP_201_CREATED,
        )
    except ConflictException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@user_router.get("/user/me", response_model=UserResponse, tags=["users"])
def get_current_user(
    platform: Platform = Depends(get_platform),
    current_user_info: tuple[Union[UserPathways, UserCandid], str] = Depends(get_active_user),
):
    try:
        current_user, provider = current_user_info
        response_data = {
            **jsonable_encoder(current_user),
            "platform": platform,
            "provider": provider,
        }
        return JSONResponse(
            content=jsonable_encoder(UserResponse(**response_data)),
            status_code=status.HTTP_200_OK,
        )
    except Exception as e:
        logger.error(f"Unexpected error while fetching current user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@user_router.put("/user/update-user", response_model=UserResponse, tags=["users"])
def update_user(
    update_data: UserUpdateRequest,
    db: Session = Depends(get_db),
    current_user_info: tuple[Union[UserPathways, UserCandid], str] = Depends(get_active_user),
):
    try:
        current_user, provider = current_user_info
        updated_user = user_service.update_user_data(
            db=db, user=current_user, update_data=update_data
        )

        response_data = {
            **jsonable_encoder(updated_user),
            "provider": provider,
            "platform": updated_user.base_user.platform,
        }

        return JSONResponse(
            content=jsonable_encoder(UserResponse(**response_data)),
            status_code=status.HTTP_200_OK,
        )
    except DatabaseException as e:
        logger.error(f"Failed to update user: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error during user update: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@user_router.get("/user/public/{id}", response_model=PublicUserResponse, tags=["users"])
def get_public_user(id: UUID4, db: Session = Depends(get_db)):
    try:
        user = user_service.get_user_by_id(db=db, user_id=id)
        return JSONResponse(
            content=jsonable_encoder(PublicUserResponse(**jsonable_encoder(user))),
            status_code=status.HTTP_200_OK,
        )
    except ResourceNotFound as e:
        logger.error(f"Public user not found: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error while fetching public user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@user_router.post("/auth/login/google", tags=["auth"])
def login_google(request_data: GoogleLoginRequest, db: Session = Depends(get_db)):
    try:
        user_info = google_auth_service.get_user_info(request_data.access_token)
        if user_info["email"] != "":
            access_token = create_access_token(
                subject=user_info["email"], platform=request_data.platform
            )
            return JSONResponse(
                content={"message": "Successfully Logged In", "access_token": access_token},
                status_code=status.HTTP_200_OK,
            )
    except GoogleAuthException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Login failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@user_router.post("/user/google", response_model=UserResponse, tags=["users"])
def create_user_google(user_data: GoogleUserCreate, db: Session = Depends(get_db)):
    try:
        user_info = google_auth_service.get_user_info(user_data.access_token)
        if user_info["email"] == user_data.email:
            user_data = user_service.create_user_in_db_google(db=db, user=user_data)
            access_token = create_access_token(subject=user_data.email)

            return JSONResponse(
                content={"message": "User created successfully", "access_token": access_token},
                status_code=status.HTTP_201_CREATED,
            )

        else:
            raise GoogleAuthException(
                message="Invalid token", status_code=status.HTTP_401_UNAUTHORIZED
            )
    except GoogleAuthException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except ConflictException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@user_router.post("/user/password-reset-request", tags=["users"])
def password_reset_request(request: PasswordResetRequest, db: Session = Depends(get_db)):
    try:
        user_service.password_reset_request(db=db, email=request.email)
        return JSONResponse(
            content={"message": "Password reset email sent"}, status_code=status.HTTP_200_OK
        )
    except InvalidUserException as e:
        logger.error(f"Password reset request failed: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error during password reset request: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@user_router.patch("/user/update-password", tags=["users"])
def update_password(
    request: UpdatePasswordRequest,
    platform: Platform = Depends(get_platform),
    db: Session = Depends(get_db),
):
    try:
        updated_user = user_service.update_password(
            db=db, email=request.email, new_password=request.password, platform=platform
        )
        return JSONResponse(
            content=jsonable_encoder(UserResponse(**jsonable_encoder(updated_user))),
            status_code=status.HTTP_200_OK,
        )
    except InvalidUserException as e:
        logger.error(f"Password update failed: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error during password update: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@user_router.post("/user/experience", tags=["users"])
def add_experience(
    job_exp: CreateExp,
    db: Session = Depends(get_db),
    current_user_info: tuple[UserPathways, str] = Depends(get_active_user),
):
    current_user, _ = current_user_info
    try:
        user_service.add_experience(db=db, user=current_user, job_exp=job_exp)
        return JSONResponse(
            content={"message": "Experience added successfully"},
            status_code=status.HTTP_201_CREATED,
        )
    except DatabaseException as e:
        logger.error(f"Failed to add experience: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error during experience creation: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@user_router.get("/user/experience", tags=["users"], response_model=list[ExpResponse])
def get_experiences(
    db: Session = Depends(get_db),
    current_user_info: tuple[UserPathways, str] = Depends(get_active_user),
):
    try:
        current_user, _ = current_user_info
        job_exps = user_service.get_experiences(db=db, user=current_user)
        response = [
            jsonable_encoder(ExpResponse(**jsonable_encoder(job_exp))) for job_exp in job_exps
        ]
        return JSONResponse(content=response, status_code=status.HTTP_200_OK)
    except DatabaseException as e:
        logger.error(f"Failed to fetch experiences: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error during experience fetch: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@user_router.delete("/user/experience/{exp_id}", tags=["users"])
def delete_experience(exp_id: UUID4, db: Session = Depends(get_db)):
    try:
        user_service.delete_experience(db=db, exp_id=exp_id)
        return JSONResponse(
            content={"message": "Experience deleted successfully"},
            status_code=status.HTTP_200_OK,
        )
    except ResourceNotFound as e:
        logger.error(f"Experience deletion failed: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseException as e:
        logger.error(f"Failed to delete experience: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error during experience deletion: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@user_router.put("/user/experience/{exp_id}", tags=["users"])
def update_experience(exp_id: UUID4, request: UpdateExp, db: Session = Depends(get_db)):
    try:
        updated_exp = user_service.update_experience(db=db, exp_id=exp_id, update_data=request)
        return JSONResponse(
            content=jsonable_encoder(ExpResponse(**jsonable_encoder(updated_exp))),
            status_code=status.HTTP_200_OK,
        )
    except ResourceNotFound as e:
        logger.error(f"Experience update failed: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseException as e:
        logger.error(f"Failed to update experience: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error during experience update: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )
