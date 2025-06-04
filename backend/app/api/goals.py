from core.logger import logger

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import UUID4
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import Users
from app.schemas.goals import GoalCreate, GoalResponse, GoalUpdate
from app.services.goals import goals_service
from app.services.user import get_active_user
from app.utils.exceptions import DatabaseException, ResourceNotFound
from core.constants import error_messages


router = APIRouter(tags=["goals"])


@router.post("/goals", response_model=GoalResponse)
def create_goal(
    goal_in: GoalCreate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_active_user),
):
    try:
        goal = goals_service.create_goal(db=db, user_id=current_user.id, goal_in=goal_in)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content=jsonable_encoder(GoalResponse.from_orm(goal)),
        )
    except DatabaseException as e:
        logger.error(f"Failed to create goal: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error while creating goal: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@router.get("/goals", response_model=list[GoalResponse])
def get_user_goals(db: Session = Depends(get_db), current_user: Users = Depends(get_active_user)):
    try:
        goals = goals_service.get_user_goals(db=db, user_id=current_user.id)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=jsonable_encoder([GoalResponse.from_orm(goal) for goal in goals]),
        )
    except DatabaseException as e:
        logger.error(f"Failed to get goals: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error while fetching goals: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@router.get("/goals/{id}", response_model=GoalResponse)
def get_goal(
    id: UUID4, db: Session = Depends(get_db), current_user: Users = Depends(get_active_user)
):
    try:
        goal = goals_service.get_goal_by_id(db=db, id=id)
        if goal.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this goal"
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK, content=jsonable_encoder(GoalResponse.from_orm(goal))
        )
    except ResourceNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error while fetching goal: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@router.patch("/goals/{id}", response_model=GoalResponse)
def update_goal(
    id: UUID4,
    goal_in: GoalUpdate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_active_user),
):
    try:
        goal = goals_service.get_goal_by_id(db=db, id=id)
        if goal.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this goal"
            )
        updated_goal = goals_service.update_goal(db=db, id=id, goal_in=goal_in)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=jsonable_encoder(GoalResponse.from_orm(updated_goal)),
        )
    except ResourceNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error while updating goal: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@router.patch("/goals/{id}/complete", response_model=GoalResponse)
def mark_goal_completed(
    id: UUID4, db: Session = Depends(get_db), current_user: Users = Depends(get_active_user)
):
    try:
        goal = goals_service.get_goal_by_id(db=db, id=id)
        if goal.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this goal"
            )
        updated_goal = goals_service.mark_goal_completed(db=db, id=id)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=jsonable_encoder(GoalResponse.from_orm(updated_goal)),
        )
    except ResourceNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error while completing goal: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )
