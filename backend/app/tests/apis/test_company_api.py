# from core.constants import constants

# API_VERSION = constants.API_VERSION


# def test_create_organization(authorized_client, mock_data):
#     organization_data = mock_data["organization_data"]["valid_organization"]
#     response = authorized_client.post(f"{API_VERSION}/organization", json=organization_data)
#     assert response.status_code == 201, response.json()
#     data = response.json()
#     assert "message" in data
#     assert "organization" in data
#     assert data["organization"]["name"] == organization_data["name"]
#     assert data["organization"]["type"] == organization_data["type"]
#     assert data["organization"]["size"] == organization_data["size"]


# def test_create_organization_invalid_data(authorized_client, mock_data):
#     organization_data = mock_data["organization_data"]["invalid_organization"]
#     response = authorized_client.post(f"{API_VERSION}/organization", json=organization_data)
#     assert response.status_code == 422


# def test_create_organization_unauthorized(client, mock_data):
#     organization_data = mock_data["organization_data"]["valid_organization"]
#     response = client.post(f"{API_VERSION}/organization", json=organization_data)
#     assert response.status_code == 500


# def test_get_organization(authorized_client, test_organization):
#     response = authorized_client.get(f"{API_VERSION}/organization")  # Remove path parameter
#     assert response.status_code == 200
#     data = response.json()
#     assert data["name"] == test_organization.name


# def test_update_organization(authorized_client, test_organization, mock_data):
#     update_data = mock_data["organization_data"]["update_organization"]
#     response = authorized_client.patch(f"{API_VERSION}/organization/{test_organization.id}", json=update_data)
#     assert response.status_code == 200, response.json()
#     data = response.json()
#     assert data["name"] == update_data["name"]
#     assert data["type"] == update_data["type"]


# def test_update_organization_not_found(authorized_client, mock_data):
#     update_data = mock_data["organization_data"]["update_organization"]
#     response = authorized_client.patch(
#         f"{API_VERSION}/organization/00000000-0000-0000-0000-000000000000", json=update_data
#     )
#     assert response.status_code == 404
