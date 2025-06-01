from core.logger import logger

from fastapi import Depends, Request
from pydantic import UUID4
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.crud import CRUDBase
from app.db.session import get_db
from app.models.core.user import BaseUser, UserCareerForge, UserTalentHub
from app.models.careerforge.career import Experience
from app.schemas.user import (
    CreateExp,
    GoogleUserCreate,
    UpdateExp,
    UserCreate,
    UserCreateRequest,
    UserUpdateRequest,
)
from app.utils.exceptions import DatabaseException, InvalidUserException, ResourceNotFound
from app.utils.security import get_password_hash, verify_password
from core.config import settings
from core.constants import error_messages



user_crud = CRUDBase(model=BaseUser)
job_exp_crud = CRUDBase(model=Experience)


def get_active_user(request: Request, db: Session = Depends(get_db)) -> BaseUser:
    email = request.app.state.user
    user = user_crud.get_by_field(db=db, field="email", value=email)
    if not user:
        logger.error(f"Active user with email {email} not found.")
        raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)
    return user


class UserService:
    def __init__(self):
        pass

    def get_user_by_id(self, db: Session, user_id: UUID4) -> BaseUser:
        user = user_crud.get(db=db, id=user_id)
        if not user:
            logger.error(f"User with ID {user_id} not found.")
            raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)
        return user

    def validate_user(self, email: str, password: str, db: Session = Depends(get_db)) -> bool:
        user = user_crud.get_by_field(db=db, field="email", value=email)
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

    def create_user_in_db(self, db: Session, user: UserCreateRequest) -> Users:
        try:
            # Create base user
            user_data = UserCreate(
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name,
                provider="self",
                provider_id=user.email,
                platform=user.platform,
                password_hash=get_password_hash(user.password),
            )
            base_user = user_crud.create(db=db, obj_in=user_data)
            
            # Create platform-specific profile
            if user.platform == "careerforge":
                profile = UserCareerForge(base_user_id=base_user.id)
                db.add(profile)
            elif user.platform == "talenthub":
                profile = UserTalentHub(base_user_id=base_user.id)
                db.add(profile)
            
            db.commit()
            return base_user
        except IntegrityError:
            db.rollback()
            logger.error(f"Failed to create user: Email {user.email} already exists.")
            raise DatabaseException(message=error_messages.CONFLICT_ERROR)
        except Exception as e:
            db.rollback()
            logger.error(f"Unexpected error while creating user: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def create_user_in_db_google(self, db: Session, user: GoogleUserCreate) -> Users:
        try:
            user_data = UserCreate(
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name,
                provider="google",
                provider_id=settings.GOOGLE_CLIENT_ID,
                platform=user.platform,
                password_hash=get_password_hash("from_google"),
            )
            user = user_crud.create(db=db, obj_in=user_data)
            return user
        except IntegrityError:
            db.rollback()
            logger.error(f"Failed to create Google user: Email {user.email} already exists.")
            raise DatabaseException(message=error_messages.CONFLICT_ERROR)
        except Exception as e:
            db.rollback()
            logger.error(f"Unexpected error while creating Google user: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def update_user_data(self, db: Session, user: Users, update_data: UserUpdateRequest) -> Users:
        try:
            attributes = [
                "first_name",
                "last_name",
                "gender",
                "ethnicity",
                "nationality",
                "phone_number",
                "city",
                "state",
                "country",
                "linkedin_url",
                "instagram_url",
                "facebook_url",
                "x_twitter_url",
                "personal_website_url",
                "current_career",
                "job_search_phase",
                "skills",
                "interests",
                "career_summary",
                "birthday",
                "current_job_title",
                "background_image_url"
            ]

            for attr in attributes:
                value = getattr(update_data, attr)
                if value is not None:
                    setattr(user, attr, value)

            return user_crud.update(db=db, obj_in=user)
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to update user data: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def add_experience(self, db: Session, user: Users, job_exp: CreateExp) -> None:
        try:
            job_exp.user_id = user.id
            if job_exp.is_current:
                user.current_job_title = job_exp.position_title
                user_crud.update(db=db, obj_in=user)

            job_exp_crud.create(db=db, obj_in=job_exp)
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to add job experience: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def get_experiences(self, db: Session, user: Users) -> list[JobExperiences]:
        try:
            return job_exp_crud.get_multi_by_field(db=db, field="user_id", value=user.id)
        except Exception as e:
            logger.error(f"Failed to retrieve job experiences: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def delete_experience(self, db: Session, exp_id: UUID4) -> None:
        try:
            experience = job_exp_crud.get(db=db, id=exp_id)
            if not experience:
                logger.error(f"Job experience with ID {exp_id} not found.")
                raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)
            job_exp_crud.remove(db=db, id=exp_id)
        except ResourceNotFound as e:
            raise e
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to delete job experience: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def update_experience(
        self, db: Session, exp_id: UUID4, update_data: UpdateExp
    ) -> JobExperiences:
        try:
            job_exp = job_exp_crud.get(db=db, id=exp_id)
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
            ]

            for attr in attributes:
                value = getattr(update_data, attr, None)
                if value is not None:
                    setattr(job_exp, attr, value)

            return job_exp_crud.update(db=db, obj_in=job_exp)
        except ResourceNotFound as e:
            raise e
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to update job experience: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def password_reset_request(self, db: Session, email: str) -> None:
        try:
            user = user_crud.get_by_field(db=db, field="email", value=email)
            if not user:
                logger.error(f"Password reset request failed: Email {email} not found.")
                raise InvalidUserException(
                    message=error_messages.INVALID_USER_EXCEPTION["EMAIL_NOT_FOUND"]
                )
            # Add email sending logic here
        except InvalidUserException as e:
            raise e
        except Exception as e:
            db.rollback()
            logger.error(f"Unexpected error during password reset request: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def update_password(self, db: Session, email: str, new_password: str) -> Users:
        try:
            user = user_crud.get_by_field(db=db, field="email", value=email)
            if not user:
                logger.error(f"Update password failed: Email {email} not found.")
                raise InvalidUserException(
                    message=error_messages.INVALID_USER_EXCEPTION["EMAIL_NOT_FOUND"]
                )
            user.password_hash = get_password_hash(new_password)
            user = user_crud.update(db=db, obj_in=user)
            return user
        except InvalidUserException as e:
            raise e
        except Exception as e:
            db.rollback()
            logger.error(f"Unexpected error during password update: {e}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)


user_service = UserService()
