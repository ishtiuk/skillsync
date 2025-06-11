from typing import Union

from fastapi import Depends, Request
from pydantic import UUID4
from sqlalchemy.orm import Session

from app.db.crud import CRUDBase
from app.db.session import get_db
from app.models.experience import Experiences
from app.models.user import BaseUser, UserCareerforge, UserTalenthub
from app.schemas.user import (
    CreateExp,
    GoogleUserCreate,
    Platform,
    UpdateExp,
    UserCreateRequest,
    UserUpdateRequest,
)
from app.utils.exceptions import (
    ConflictException,
    DatabaseException,
    InvalidUserException,
    ResourceNotFound,
)
from app.utils.security import get_password_hash, verify_password
from core.constants import error_messages
from core.logger import logger

base_user_crud = CRUDBase(model=BaseUser)
careerforge_user_crud = CRUDBase(model=UserCareerforge)
talent_user_crud = CRUDBase(model=UserTalenthub)
exp_crud = CRUDBase(model=Experiences)


def get_platform(request: Request) -> Platform:
    platform = request.app.state.platform
    return Platform(platform)


def get_active_user(
    request: Request, db: Session = Depends(get_db)
) -> tuple[Union[UserCareerforge, UserTalenthub], str]:
    email = request.app.state.user
    platform = request.app.state.platform

    if platform == Platform.careerforge:
        platform_user = careerforge_user_crud.get_by_field(db=db, field="email", value=email)
    else:
        platform_user = talent_user_crud.get_by_field(db=db, field="email", value=email)

    base_user = base_user_crud.get(db=db, id=platform_user.base_user_id) if platform_user else None
    if not base_user:
        logger.error(f"No user found with identifier {email}")
        raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)

    return platform_user, base_user.provider


class UserService:
    def __init__(self):
        pass

    def get_user_by_id(self, db: Session, user_id: UUID4) -> Union[UserCareerforge, UserTalenthub]:
        try:
            user = careerforge_user_crud.get(db=db, id=user_id)
            if user:
                return user

            user = talent_user_crud.get(db=db, id=user_id)
            if user:
                return user

            logger.error(f"User with ID {user_id} not found in either platform.")
            raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)
        except ResourceNotFound as e:
            logger.error(f"User with ID {user_id} not found: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"Error fetching user with ID {user_id}: {str(e)}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def get_user_by_platform(
        self, db: Session, email: str, platform: str
    ) -> Union[UserCareerforge, UserTalenthub]:
        if platform == Platform.careerforge:
            return careerforge_user_crud.get_by_field(db=db, field="email", value=email)
        else:
            return talent_user_crud.get_by_field(db=db, field="email", value=email)

    def validate_user(self, email: str, password: str, platform: str, db: Session) -> bool:
        user = self.get_user_by_platform(db, email, platform)
        if user:
            if verify_password(password, user.password_hash):
                return True
            else:
                logger.info("Invalid password")
                raise InvalidUserException(
                    message=error_messages.INVALID_USER_EXCEPTION["INVALID_USER_NAME_PASSWORD"]
                )
        else:
            logger.info("Email not found")
            raise InvalidUserException(
                message=error_messages.INVALID_USER_EXCEPTION["INVALID_USER_NAME_PASSWORD"]
            )

    def create_user_in_db(
        self, db: Session, user: UserCreateRequest
    ) -> Union[UserCareerforge, UserTalenthub]:
        try:
            if user.platform == Platform.careerforge:
                existing_user = careerforge_user_crud.get_by_field(
                    db=db, field="email", value=user.email
                )
            else:
                existing_user = talent_user_crud.get_by_field(
                    db=db, field="email", value=user.email
                )

            if existing_user:
                logger.error(f"User with email {user.email} already exists.")
                raise ConflictException(message=error_messages.CONFLICT_ERROR)

            # If email doesn't exist, proceed with user creation
            base_user_data = {
                "provider": user.provider,
                "provider_id": user.email,
                "platform": user.platform,
            }
            base_user = base_user_crud.create(db=db, obj_in=base_user_data)

            user_data = {
                "base_user_id": base_user.id,
                "email": user.email,
                "password_hash": get_password_hash(user.password),
                "first_name": user.first_name,
                "last_name": user.last_name,
            }

            if user.platform == Platform.careerforge:
                return careerforge_user_crud.create(db=db, obj_in=user_data)
            else:
                return talent_user_crud.create(db=db, obj_in=user_data)
        except ConflictException as e:
            raise e
        except Exception as e:
            logger.error(f"Unexpected error while creating user: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def create_user_in_db_google(
        self, db: Session, user: GoogleUserCreate
    ) -> Union[UserCareerforge, UserTalenthub]:
        try:
            if user.platform == Platform.careerforge:
                existing_user = careerforge_user_crud.get_by_field(
                    db=db, field="email", value=user.email
                )
            else:
                existing_user = talent_user_crud.get_by_field(
                    db=db, field="email", value=user.email
                )

            if existing_user:
                logger.error(f"Google user with email {user.email} already exists.")
                raise ConflictException(message=error_messages.CONFLICT_ERROR)

            # If email doesn't exist, proceed with user creation
            base_user_data = {
                "provider": user.provider,
                "provider_id": user.email,
                "platform": user.platform,
            }
            base_user = base_user_crud.create(db=db, obj_in=base_user_data)

            user_data = {
                "base_user_id": base_user.id,
                "email": user.email,
                "password_hash": get_password_hash("google_auth"),
                "first_name": user.first_name,
                "last_name": user.last_name,
            }

            if user.platform == Platform.careerforge:
                return careerforge_user_crud.create(db=db, obj_in=user_data)
            else:
                return talent_user_crud.create(db=db, obj_in=user_data)
        except ConflictException as e:
            raise e
        except Exception as e:
            logger.error(f"Unexpected error while creating Google user: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def update_user_data(
        self,
        db: Session,
        user: Union[UserCareerforge, UserTalenthub],
        update_data: UserUpdateRequest,
    ) -> Union[UserCareerforge, UserTalenthub]:
        try:
            common_attributes = [
                "first_name",
                "last_name",
                "gender",
                "nationality",
                "phone_number",
                "country",
                "personal_website_url",
                "current_job_title",
            ]

            careerforge_attributes = [
                "ethnicity",
                "city",
                "state",
                "linkedin_url",
                "github_url",
                "x_twitter_url",
                "current_career",
                "job_search_phase",
                "skills",
                "interests",
                "career_summary",
                "birthday",
                "background_image_url",
            ]

            for attr in common_attributes:
                value = getattr(update_data, attr)
                if value is not None:
                    setattr(user, attr, value)

            if isinstance(user, UserCareerforge):
                crud_base = careerforge_user_crud
                for attr in careerforge_attributes:
                    value = getattr(update_data, attr)
                    if value is not None:
                        setattr(user, attr, value)
            else:
                crud_base = talent_user_crud

            return crud_base.update(db=db, obj_in=user)
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to update user data: {str(e)}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def add_experience(self, db: Session, user: UserCareerforge, job_exp: CreateExp) -> None:
        try:
            job_exp.user_id = user.id
            if job_exp.is_current:
                user.current_job_title = job_exp.position_title
                careerforge_user_crud.update(db=db, obj_in=user)

            exp_crud.create(db=db, obj_in=job_exp)
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to add job experience: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def get_experiences(self, db: Session, user: UserCareerforge) -> list[Experiences]:
        try:
            return exp_crud.get_multi_by_field(db=db, field="user_id", value=user.id)
        except Exception as e:
            logger.error(f"Failed to retrieve job experiences: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def delete_experience(self, db: Session, exp_id: UUID4) -> None:
        try:
            experience = exp_crud.get(db=db, id=exp_id)
            if not experience:
                logger.error(f"Job experience with ID {exp_id} not found.")
                raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)
            exp_crud.remove(db=db, id=exp_id)
        except ResourceNotFound as e:
            raise e
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to delete job experience: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def update_experience(self, db: Session, exp_id: UUID4, update_data: UpdateExp) -> Experiences:
        try:
            job_exp = exp_crud.get(db=db, id=exp_id)
            if not job_exp:
                logger.error(f"Job experience with ID {exp_id} not found.")
                raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)

            attributes = [
                "position_title",
                "company_name",
                "employment_type",
                "is_current",
                "start_month",
                "start_year",
                "end_month",
                "end_year",
                "logo_url",
            ]

            for attr in attributes:
                value = getattr(update_data, attr, None)
                if value is not None:
                    setattr(job_exp, attr, value)

            return exp_crud.update(db=db, obj_in=job_exp)
        except ResourceNotFound as e:
            raise e
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to update job experience: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def password_reset_request(self, db: Session, email: str, platform: Platform) -> None:
        try:
            if platform == Platform.careerforge:
                user = careerforge_user_crud.get_by_field(db=db, field="email", value=email)
            else:
                user = talent_user_crud.get_by_field(db=db, field="email", value=email)

            if not user:
                base_user = base_user_crud.get_by_field(db=db, field="provider_id", value=email)
                if base_user:
                    if platform == Platform.careerforge:
                        user = careerforge_user_crud.get_by_field(
                            db=db, field="base_user_id", value=base_user.id
                        )
                    else:
                        user = talent_user_crud.get_by_field(
                            db=db, field="base_user_id", value=base_user.id
                        )

            if not user:
                logger.error(f"Password reset request failed: Email {email} not found.")
                raise InvalidUserException(
                    message=error_messages.INVALID_USER_EXCEPTION["EMAIL_NOT_FOUND"]
                )

            # Add email sending logic here
            # You might want to generate a reset token and store it

        except InvalidUserException as e:
            raise e
        except Exception as e:
            db.rollback()
            logger.error(f"Unexpected error during password reset request: {str(e)}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def update_password(
        self, db: Session, email: str, new_password: str, platform: Platform
    ) -> Union[UserCareerforge, UserTalenthub]:
        try:
            if platform == Platform.careerforge:
                user = careerforge_user_crud.get_by_field(db=db, field="email", value=email)
                crud_base = careerforge_user_crud
            else:
                user = talent_user_crud.get_by_field(db=db, field="email", value=email)
                crud_base = talent_user_crud

            if not user:
                base_user = base_user_crud.get_by_field(db=db, field="provider_id", value=email)
                if base_user:
                    if platform == Platform.careerforge:
                        user = careerforge_user_crud.get_by_field(
                            db=db, field="base_user_id", value=base_user.id
                        )
                    else:
                        user = talent_user_crud.get_by_field(
                            db=db, field="base_user_id", value=base_user.id
                        )

            if not user:
                logger.error(f"Update password failed: Email {email} not found.")
                raise InvalidUserException(
                    message=error_messages.INVALID_USER_EXCEPTION["EMAIL_NOT_FOUND"]
                )

            user.password_hash = get_password_hash(new_password)
            return crud_base.update(db=db, obj_in=user)

        except InvalidUserException as e:
            raise e
        except Exception as e:
            db.rollback()
            logger.error(f"Unexpected error during password update: {str(e)}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)


user_service = UserService()
