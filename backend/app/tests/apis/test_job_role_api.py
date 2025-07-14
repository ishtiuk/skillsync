# from core.constants import constants

# API_VERSION = constants.API_VERSION


# def test_create_position(authorized_client, test_organization, mock_data):
#     position_data = mock_data["position_data"]["valid_position"]
#     response = authorized_client.post(f"{API_VERSION}/positions", json=position_data)
#     assert response.status_code == 201
#     data = response.json()
#     assert data["title"] == position_data["title"]
#     assert data["job_category"] == position_data["job_category"]


# def test_create_position_invalid_data(authorized_client, mock_data):
#     position_data = mock_data["position_data"]["invalid_position"]
#     response = authorized_client.post(f"{API_VERSION}/positions", json=position_data)
#     assert response.status_code == 422


# def test_create_position_unauthorized(client, mock_data):
#     position_data = mock_data["position_data"]["valid_position"]
#     response = client.post(f"{API_VERSION}/positions", json=position_data)
#     assert response.status_code == 500


# def test_update_position(authorized_client, test_position, mock_data):
#     update_data = mock_data["position_data"]["update_position"]
#     response = authorized_client.patch(
#         f"{API_VERSION}/positions/{test_position.id}", json=update_data
#     )
#     assert response.status_code == 200
#     data = response.json()
#     assert data["title"] == update_data["title"]
#     assert data["level_of_experience"] == update_data["level_of_experience"]


# def test_update_position_not_found(authorized_client, mock_data):
#     update_data = mock_data["position_data"]["update_position"]
#     response = authorized_client.patch(
#         f"{API_VERSION}/positions/00000000-0000-0000-0000-000000000000", json=update_data
#     )
#     assert response.status_code == 404


# def test_get_positions_pathways(authorized_client):
#     filters = {
#         "job_category": ["software-engineering"],
#         "position_type": ["Full-Time"],
#         "level_of_experience": ["Mid"],
#     }
#     response = authorized_client.post(f"{API_VERSION}/positionss/pathways", json=filters)
#     assert response.status_code == 200
#     data = response.json()
#     assert isinstance(data, list)


# def test_get_positions_candid(authorized_client, test_organization):
#     response = authorized_client.get(f"{API_VERSION}/positionss/candid")
#     assert response.status_code == 200
#     data = response.json()
#     assert isinstance(data, list)


# def test_get_single_position(client, test_position):
#     response = client.get(f"{API_VERSION}/positions/public/{test_position.id}")
#     assert response.status_code == 200
#     data = response.json()
#     assert data["id"] == str(test_position.id)


# def test_get_pathway_job_counts(authorized_client, test_position, test_organization):
#     pathway = test_organization.select_a_pathway

#     response = authorized_client.get(f"{API_VERSION}/positionss/pathways/count")
#     assert response.status_code == 200

#     data = response.json()
#     assert "pathways_count" in data
#     assert isinstance(data["pathways_count"], dict)
#     assert pathway in data["pathways_count"]
#     assert data["pathways_count"][pathway] > 0


# def test_get_pathway_job_counts_unauthorized(client):
#     response = client.get(f"{API_VERSION}/positionss/pathways/count")
#     assert response.status_code == 500


# def test_get_pathway_job_counts_empty(authorized_client):
#     response = authorized_client.get(f"{API_VERSION}/positionss/pathways/count")
#     assert response.status_code == 200

#     data = response.json()
#     assert "pathways_count" in data
#     assert isinstance(data["pathways_count"], dict)
#     assert len(data["pathways_count"]) >= 0
