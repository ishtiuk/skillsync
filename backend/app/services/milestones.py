from typing import List

from pydantic import UUID4
from sqlalchemy.orm import Session

from app.db.crud import CRUDBase
from app.models.milestones import Milestones
from app.schemas.milestones import MilestoneCreate, MilestoneUpdate
from app.utils.exceptions import DatabaseException, ResourceNotFound
from core.constants import error_messages
from core.logger import logger


class MilestonesService:
    def __init__(self):
        self.milestones_crud = CRUDBase(model=Milestones)

    def create_milestone(
        self, db: Session, user_id: UUID4, milestone_in: MilestoneCreate
    ) -> Milestones:
        try:
            milestone_data = Milestones(
                user_id=user_id,
                name=milestone_in.name,
                type=milestone_in.type,
                description=milestone_in.description,
                tasks=milestone_in.tasks,
                is_completed=milestone_in.is_completed,
            )
            milestone = self.milestones_crud.create(db=db, obj_in=milestone_data)
            return milestone
        except Exception as e:
            logger.error(f"Failed to create milestone: {str(e)}")
            raise DatabaseException(
                message=error_messages.MILESTONE_EXCEPTIONS["MILESTONE_CREATE_FAILED"]
            )

    def get_user_milestones(self, db: Session, user_id: UUID4) -> List[Milestones]:
        try:
            return (
                db.query(Milestones)
                .filter(Milestones.user_id == user_id)
                .order_by(Milestones.created_at.asc())
                .all()
            )
        except Exception as e:
            logger.error(f"Failed to get user milestones: {str(e)}")
            raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

    def get_milestone_by_id(self, db: Session, id: UUID4) -> Milestones:
        milestone = self.milestones_crud.get(db=db, id=id)
        if not milestone:
            logger.error(f"Milestone with ID {id} not found")
            raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)
        return milestone

    def update_milestone(self, db: Session, id: UUID4, milestone_in: MilestoneUpdate) -> Milestones:
        try:
            milestone = self.get_milestone_by_id(db=db, id=id)

            update_data = milestone_in.model_dump(exclude_unset=True, exclude_none=True)
            for field, value in update_data.items():
                setattr(milestone, field, value)

            milestone.is_completed = True if all(update_data.get("tasks").values()) else False

            updated_milestone = self.milestones_crud.update(db=db, obj_in=milestone)
            return updated_milestone
        except ResourceNotFound as e:
            raise e
        except Exception as e:
            logger.error(f"Failed to update milestone: {str(e)}")
            raise DatabaseException(
                message=error_messages.MILESTONE_EXCEPTIONS["MILESTONE_UPDATE_FAILED"]
            )


milestones_service = MilestonesService()
