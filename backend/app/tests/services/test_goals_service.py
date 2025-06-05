# from uuid import uuid4

# import pytest

# from app.schemas.goals import GoalCreate, GoalUpdate
# from app.services.goals import GoalsService
# from app.utils.exceptions import ResourceNotFound


# def test_create_goal(db, test_user, mock_data):
#     goals_service = GoalsService()
#     goal_data = mock_data["goals_data"]["valid_goal"]
#     goal_in = GoalCreate(**goal_data)

#     goal = goals_service.create_goal(db=db, goal_in=goal_in, user_id=test_user.id)
#     assert goal.name == goal_data["name"]
#     assert goal.type == goal_data["type"]
#     assert goal.tasks == goal_data["tasks"]
#     assert goal.user_id == test_user.id


# def test_get_user_goals(db, test_user, test_goal):
#     goals_service = GoalsService()
#     goals = goals_service.get_user_goals(db=db, user_id=test_user.id)
#     assert len(goals) > 0
#     assert goals[0].id == test_goal.id
#     assert goals[0].name == test_goal.name


# def test_get_goal_by_id(db, test_goal):
#     goals_service = GoalsService()
#     goal = goals_service.get_goal_by_id(db=db, id=test_goal.id)
#     assert goal.id == test_goal.id
#     assert goal.name == test_goal.name


# def test_get_goal_not_found(db):
#     goals_service = GoalsService()
#     with pytest.raises(ResourceNotFound):
#         goals_service.get_goal_by_id(db=db, id=uuid4())


# def test_update_goal(db, test_goal, mock_data):
#     goals_service = GoalsService()
#     update_data = mock_data["goals_data"]["update_goal"]
#     goal_update = GoalUpdate(**update_data)

#     updated_goal = goals_service.update_goal(db=db, id=test_goal.id, goal_in=goal_update)
#     assert updated_goal.name == update_data["name"]
#     assert updated_goal.description == update_data["description"]
#     assert updated_goal.tasks == update_data["tasks"]


# def test_mark_goal_completed(db, test_goal):
#     goals_service = GoalsService()
#     updated_goal = goals_service.mark_goal_completed(db=db, id=test_goal.id)
#     assert updated_goal.is_completed is True


# def test_update_nonexistent_goal(db, mock_data):
#     goals_service = GoalsService()
#     update_data = mock_data["goals_data"]["update_goal"]
#     goal_update = GoalUpdate(**update_data)

#     with pytest.raises(ResourceNotFound):
#         goals_service.update_goal(db=db, id=uuid4(), goal_in=goal_update)
