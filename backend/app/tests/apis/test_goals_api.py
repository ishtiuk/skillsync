# from uuid import uuid4

# from core.constants import constants

# API_VERSION = constants.API_VERSION


# def test_create_goal(authorized_client, mock_data):
#     goal_data = mock_data["goals_data"]["valid_goal"]
#     response = authorized_client.post(f"{API_VERSION}/goals", json=goal_data)
#     assert response.status_code == 201
#     data = response.json()
#     assert data["name"] == goal_data["name"]
#     assert data["type"] == goal_data["type"]
#     assert data["tasks"] == goal_data["tasks"]


# def test_create_goal_invalid_data(authorized_client, mock_data):
#     invalid_data = mock_data["goals_data"]["invalid_goal"]
#     response = authorized_client.post(f"{API_VERSION}/goals", json=invalid_data)
#     assert response.status_code == 422


# def test_get_user_goals(authorized_client, test_goal):
#     response = authorized_client.get(f"{API_VERSION}/goals")
#     assert response.status_code == 200
#     data = response.json()
#     assert isinstance(data, list)
#     assert len(data) > 0
#     assert data[0]["id"] == str(test_goal.id)
#     assert data[0]["name"] == test_goal.name


# def test_get_goal_by_id(authorized_client, test_goal):
#     response = authorized_client.get(f"{API_VERSION}/goals/{test_goal.id}")
#     assert response.status_code == 200
#     data = response.json()
#     assert data["id"] == str(test_goal.id)
#     assert data["name"] == test_goal.name
#     assert data["type"] == test_goal.type


# def test_get_goal_not_found(authorized_client):
#     response = authorized_client.get(f"{API_VERSION}/goals/{uuid4()}")
#     assert response.status_code == 404


# def test_update_goal(authorized_client, test_goal, mock_data):
#     update_data = mock_data["goals_data"]["update_goal"]
#     response = authorized_client.patch(f"{API_VERSION}/goals/{test_goal.id}", json=update_data)
#     assert response.status_code == 200
#     data = response.json()
#     assert data["name"] == update_data["name"]
#     assert data["description"] == update_data["description"]
#     assert data["tasks"] == update_data["tasks"]


# def test_update_goal_invalid_data(authorized_client, test_goal, mock_data):
#     invalid_data = mock_data["goals_data"]["invalid_goal"]
#     response = authorized_client.patch(f"{API_VERSION}/goals/{test_goal.id}", json=invalid_data)
#     assert response.status_code == 422


# def test_mark_goal_completed(authorized_client, test_goal):
#     response = authorized_client.patch(f"{API_VERSION}/goals/{test_goal.id}/complete")
#     assert response.status_code == 200
#     data = response.json()
#     assert data["is_completed"] is True


# def test_unauthorized_access(client):
#     endpoints = [
#         ("GET", f"{API_VERSION}/goals"),
#         ("POST", f"{API_VERSION}/goals"),
#         ("GET", f"{API_VERSION}/goals/{uuid4()}"),
#         ("PATCH", f"{API_VERSION}/goals/{uuid4()}"),
#         ("PATCH", f"{API_VERSION}/goals/{uuid4()}/complete"),
#     ]

#     for method, endpoint in endpoints:
#         response = client.request(method, endpoint)
#         assert response.status_code == 500
