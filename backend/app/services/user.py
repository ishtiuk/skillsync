from typing import List, Union

from fastapi import Depends, Request
from pydantic import UUID4
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.crud import CRUDBase
from app.db.session import get_db
from app.models.experience import Experience
from app.models.milestone import Milestone
from app.models.user import BaseUser, UserCareerForge, UserTalentHub
from app.schemas.experience import ExperienceCreate, ExperienceUpdate
from app.schemas.milestone import MilestoneCreate, MilestoneUpdate
from app.schemas.user import (
    BaseUserCreate,
    GoogleUserCreate,
    Platform,
    UserCreateRequest,
    UserUpdateRequest,
)
from app.utils.exceptions import (
    DatabaseException,
    InvalidUserException,
    PlatformException,
    ResourceNotFound,
)
from app.utils.security import get_password_hash, verify_password
from core.config import settings
from core.constants import error_messages
from core.logger import logger

user_crud = CRUDBase(model=BaseUser)
user_careerforge_crud = CRUDBase(model=UserCareerForge)
user_talenthub_crud = CRUDBase(model=UserTalentHub)
experience_crud = CRUDBase(model=Experience)
milestone_crud = CRUDBase(model=Milestone)


def get_active_careerforge_user(request: Request, db: Session = Depends(get_db)) -> UserCareerForge:
    email = request.app.state.user
    user = user_careerforge_crud.get_by_field(db=db, field="email", value=email)

    if not user:
        logger.error(f"User with email {email} not found")
        raise ResourceNotFound("CareerForge user not found")

    return user


def get_active_talenthub_user(request: Request, db: Session = Depends(get_db)) -> UserTalentHub:
    email = request.app.state.user
    user = user_talenthub_crud.get_by_field(db=db, field="email", value=email)

    if not user:
        logger.error(f"User with email {email} not found")
        raise ResourceNotFound("TalentHub user not found")

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

    def validate_user(self, email: str, password: str, platform: Platform, db: Session) -> bool:
        if platform == Platform.careerforge:
            user = user_careerforge_crud.get_by_field(db=db, field="email", value=email)
        else:
            user = user_talenthub_crud.get_by_field(db=db, field="email", value=email)

        if not user:
            logger.info("Email not found")
            raise InvalidUserException(
                message=error_messages.INVALID_USER_EXCEPTION["INVALID_USER_NAME_PASSWORD"]
            )

        if not verify_password(password, user.password_hash):
            logger.info("Invalid password")
            raise InvalidUserException(
                message=error_messages.INVALID_USER_EXCEPTION["INVALID_USER_NAME_PASSWORD"]
            )

        return True

    def create_user_in_db(
        self, db: Session, user: UserCreateRequest
    ) -> Union[UserCareerForge, UserTalentHub]:
        try:
            # Create base user first
            base_user_data = BaseUserCreate(
                provider="self",
                provider_id=user.email,
                platform=user.platform,
            )
            base_user = user_crud.create(db=db, obj_in=base_user_data)

            profile_data = {
                "base_user_id": base_user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "password_hash": get_password_hash(user.password),
                "is_active": True,
                "role": "user",
            }

            if user.platform == Platform.careerforge:
                profile = user_careerforge_crud.create(db=db, obj_in=profile_data)
            else:
                profile = user_talenthub_crud.create(db=db, obj_in=profile_data)

            return profile

        except IntegrityError:
            logger.error(f"Failed to create user: Email {user.email} already exists")
            raise DatabaseException(message=error_messages.CONFLICT_ERROR)
        except Exception as e:
            logger.error(f"Failed to create user: {str(e)}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def create_user_in_db_google(
        self, db: Session, user: GoogleUserCreate
    ) -> Union[UserCareerForge, UserTalentHub]:
        """Create user with Google OAuth"""
        try:
            # Create base user first
            base_user_data = BaseUserCreate(
                provider="google",
                provider_id=settings.GOOGLE_CLIENT_ID,
                platform=user.platform,
            )
            base_user = user_crud.create(db=db, obj_in=base_user_data)

            # Create platform-specific profile
            profile_data = {
                "base_user_id": base_user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "password_hash": get_password_hash("google_oauth"),
                "is_active": True,
                "role": "user",
            }

            if user.platform == Platform.careerforge:
                profile = user_careerforge_crud.create(db=db, obj_in=profile_data)
            else:
                profile = user_talenthub_crud.create(db=db, obj_in=profile_data)

            return profile

        except IntegrityError:
            logger.error(f"Failed to create Google user: Email {user.email} already exists")
            raise DatabaseException(message=error_messages.CONFLICT_ERROR)
        except Exception as e:
            logger.error(f"Failed to create Google user: {str(e)}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    # Experience Management Methods
    def add_experience(
        self, db: Session, user: UserCareerForge, experience_data: ExperienceCreate
    ) -> Experience:
        """Add new experience for CareerForge user"""
        try:
            experience_dict = experience_data.dict(exclude={"user_id"})
            experience_dict["user_id"] = user.id

            experience = experience_crud.create(db=db, obj_in=experience_dict)

            # Update current job if this is current experience
            if experience_data.is_current:
                user_careerforge_crud.update(
                    db=db, db_obj=user, obj_in={"current_job_title": experience_data.position_title}
                )

            return experience
        except Exception as e:
            logger.error(f"Failed to add experience: {str(e)}")
            raise DatabaseException("Failed to add experience")

    def update_experience(
        self, db: Session, user: UserCareerForge, exp_id: UUID4, update_data: ExperienceUpdate
    ) -> Experience:
        """Update existing experience"""
        try:
            experience = experience_crud.get(db=db, id=exp_id)

            if not experience:
                raise ResourceNotFound("Experience not found")

            if experience.user_id != user.id:
                raise PlatformException("Not authorized to update this experience")

            experience = experience_crud.update(
                db=db, db_obj=experience, obj_in=update_data.dict(exclude_unset=True)
            )
            return experience
        except Exception as e:
            logger.error(f"Failed to update experience: {str(e)}")
            raise DatabaseException("Failed to update experience")

    def delete_experience(self, db: Session, user: UserCareerForge, exp_id: UUID4) -> None:
        try:
            experience = experience_crud.get(db=db, id=exp_id)

            if not experience:
                raise ResourceNotFound("Experience not found")

            if experience.user_id != user.id:
                raise PlatformException("Not authorized to delete this experience")

            experience_crud.remove(db=db, id=exp_id)
        except Exception as e:
            logger.error(f"Failed to delete experience: {str(e)}")
            raise DatabaseException("Failed to delete experience")

    def get_user_experiences(self, db: Session, user: UserCareerForge) -> List[Experience]:
        try:
            experiences = experience_crud.get_multi_by_field(db=db, field="user_id", value=user.id)
            return experiences
        except Exception as e:
            logger.error(f"Failed to fetch experiences: {str(e)}")
            raise DatabaseException("Failed to fetch experiences")

    # Milestone Management Methods
    def add_milestone(
        self, db: Session, user: UserCareerForge, milestone_data: MilestoneCreate
    ) -> Milestone:
        try:
            milestone_dict = milestone_data.dict(exclude={"user_id"})
            milestone_dict["user_id"] = user.id

            milestone = milestone_crud.create(db=db, obj_in=milestone_dict)

            # Update achievement score
            if milestone_data.achievement_points:
                user_careerforge_crud.update(
                    db=db,
                    db_obj=user,
                    obj_in={
                        "achievement_score": user.achievement_score
                        + milestone_data.achievement_points
                    },
                )

            return milestone
        except Exception as e:
            logger.error(f"Failed to add milestone: {str(e)}")
            raise DatabaseException("Failed to add milestone")

    def update_milestone(
        self, db: Session, user: UserCareerForge, milestone_id: UUID4, update_data: MilestoneUpdate
    ) -> Milestone:
        try:
            milestone = milestone_crud.get(db=db, id=milestone_id)

            if not milestone:
                raise ResourceNotFound("Milestone not found")

            if milestone.user_id != user.id:
                raise PlatformException("Not authorized to update this milestone")

            old_points = milestone.achievement_points

            milestone = milestone_crud.update(
                db=db, db_obj=milestone, obj_in=update_data.dict(exclude_unset=True)
            )

            # Update achievement score if points changed
            if update_data.achievement_points and update_data.achievement_points != old_points:
                point_diff = update_data.achievement_points - old_points
                user_careerforge_crud.update(
                    db=db,
                    db_obj=user,
                    obj_in={"achievement_score": user.achievement_score + point_diff},
                )

            return milestone
        except Exception as e:
            logger.error(f"Failed to update milestone: {str(e)}")
            raise DatabaseException("Failed to update milestone")

    def delete_milestone(self, db: Session, user: UserCareerForge, milestone_id: UUID4) -> None:
        try:
            milestone = milestone_crud.get(db=db, id=milestone_id)

            if not milestone:
                raise ResourceNotFound("Milestone not found")

            if milestone.user_id != user.id:
                raise PlatformException("Not authorized to delete this milestone")

            # Update achievement score before deleting
            if milestone.achievement_points:
                user_careerforge_crud.update(
                    db=db,
                    db_obj=user,
                    obj_in={
                        "achievement_score": user.achievement_score - milestone.achievement_points
                    },
                )

            milestone_crud.remove(db=db, id=milestone_id)
        except Exception as e:
            logger.error(f"Failed to delete milestone: {str(e)}")
            raise DatabaseException("Failed to delete milestone")

    def get_user_milestones(self, db: Session, user: UserCareerForge) -> List[Milestone]:
        try:
            milestones = milestone_crud.get_multi_by_field(db=db, field="user_id", value=user.id)
            return milestones
        except Exception as e:
            logger.error(f"Failed to fetch milestones: {str(e)}")
            raise DatabaseException("Failed to fetch milestones")

    def update_user_data(
        self,
        db: Session,
        user: Union[UserCareerForge, UserTalentHub],
        update_data: UserUpdateRequest,
    ) -> Union[UserCareerForge, UserTalentHub]:
        try:
            update_dict = {
                key: value
                for key, value in update_data.dict(exclude_unset=True).items()
                if value is not None
            }

            if isinstance(user, UserCareerForge):
                updated_user = user_careerforge_crud.update(db=db, db_obj=user, obj_in=update_dict)
            else:
                updated_user = user_talenthub_crud.update(db=db, db_obj=user, obj_in=update_dict)

            return updated_user
        except Exception as e:
            logger.error(f"Failed to update user: {str(e)}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)


user_service = UserService()
