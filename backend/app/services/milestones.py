# from core.logger import logger
# from typing import List

# from pydantic import UUID4
# from sqlalchemy.orm import Session

# from app.db.crud import CRUDBase
# from app.models.goals import Goals
# from app.schemas.goals import GoalCreate, GoalUpdate
# from app.utils.exceptions import DatabaseException, ResourceNotFound
# from core.constants import error_messages


# class GoalsService:
#     def __init__(self):
#         self.goals_crud = CRUDBase(model=Goals)

#     def create_goal(self, db: Session, user_id: UUID4, goal_in: GoalCreate) -> Goals:
#         try:
#             goal_data = Goals(
#                 user_id=user_id,
#                 name=goal_in.name,
#                 type=goal_in.type,
#                 description=goal_in.description,
#                 tasks=goal_in.tasks,
#                 is_completed=goal_in.is_completed,
#             )
#             goal = self.goals_crud.create(db=db, obj_in=goal_data)
#             return goal
#         except Exception as e:
#             logger.error(f"Failed to create goal: {str(e)}")
#             raise DatabaseException(message=error_messages.GOAL_EXCEPTIONS["GOAL_CREATE_FAILED"])

#     def get_user_goals(self, db: Session, user_id: UUID4) -> List[Goals]:
#         try:
#             return self.goals_crud.get_multi_by_field(db=db, field="user_id", value=user_id)
#         except Exception as e:
#             logger.error(f"Failed to get user goals: {str(e)}")
#             raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

#     def get_goal_by_id(self, db: Session, id: UUID4) -> Goals:
#         goal = self.goals_crud.get(db=db, id=id)
#         if not goal:
#             logger.error(f"Goal with ID {id} not found")
#             raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)
#         return goal

#     def update_goal(self, db: Session, id: UUID4, goal_in: GoalUpdate) -> Goals:
#         try:
#             goal = self.get_goal_by_id(db=db, id=id)

#             update_data = goal_in.model_dump(exclude_unset=True, exclude_none=True)
#             for field, value in update_data.items():
#                 setattr(goal, field, value)

#             updated_goal = self.goals_crud.update(db=db, obj_in=goal)
#             return updated_goal
#         except ResourceNotFound as e:
#             raise e
#         except Exception as e:
#             logger.error(f"Failed to update goal: {str(e)}")
#             raise DatabaseException(message=error_messages.GOAL_EXCEPTIONS["GOAL_UPDATE_FAILED"])

#     def mark_goal_completed(self, db: Session, id: UUID4) -> Goals:
#         try:
#             goal = self.get_goal_by_id(db=db, id=id)
#             goal.is_completed = True
#             return self.goals_crud.update(db=db, obj_in=goal)
#         except ResourceNotFound as e:
#             raise e
#         except Exception as e:
#             logger.error(f"Failed to mark goal as completed: {str(e)}")
#             raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)


# goals_service = GoalsService()
