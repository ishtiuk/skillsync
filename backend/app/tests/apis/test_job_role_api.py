# from core.constants import constants

# API_VERSION = constants.API_VERSION


# def test_create_job_role(authorized_client, test_company, mock_data):
#     job_role_data = mock_data["job_role_data"]["valid_job_role"]
#     response = authorized_client.post(f"{API_VERSION}/job-role", json=job_role_data)
#     assert response.status_code == 201
#     data = response.json()
#     assert data["title"] == job_role_data["title"]
#     assert data["job_category"] == job_role_data["job_category"]


# def test_create_job_role_invalid_data(authorized_client, mock_data):
#     job_role_data = mock_data["job_role_data"]["invalid_job_role"]
#     response = authorized_client.post(f"{API_VERSION}/job-role", json=job_role_data)
#     assert response.status_code == 422


# def test_create_job_role_unauthorized(client, mock_data):
#     job_role_data = mock_data["job_role_data"]["valid_job_role"]
#     response = client.post(f"{API_VERSION}/job-role", json=job_role_data)
#     assert response.status_code == 500


# def test_update_job_role(authorized_client, test_job_role, mock_data):
#     update_data = mock_data["job_role_data"]["update_job_role"]
#     response = authorized_client.patch(
#         f"{API_VERSION}/job-role/{test_job_role.id}", json=update_data
#     )
#     assert response.status_code == 200
#     data = response.json()
#     assert data["title"] == update_data["title"]
#     assert data["level_of_experience"] == update_data["level_of_experience"]


# def test_update_job_role_not_found(authorized_client, mock_data):
#     update_data = mock_data["job_role_data"]["update_job_role"]
#     response = authorized_client.patch(
#         f"{API_VERSION}/job-role/00000000-0000-0000-0000-000000000000", json=update_data
#     )
#     assert response.status_code == 404


# def test_get_job_roles_pathways(authorized_client):
#     filters = {
#         "job_category": ["software-engineering"],
#         "position_type": ["Full-Time"],
#         "level_of_experience": ["Mid"],
#     }
#     response = authorized_client.post(f"{API_VERSION}/job-roles/pathways", json=filters)
#     assert response.status_code == 200
#     data = response.json()
#     assert isinstance(data, list)


# def test_get_job_roles_candid(authorized_client, test_company):
#     response = authorized_client.get(f"{API_VERSION}/job-roles/candid")
#     assert response.status_code == 200
#     data = response.json()
#     assert isinstance(data, list)


# def test_get_single_job_role(client, test_job_role):
#     response = client.get(f"{API_VERSION}/job-role/public/{test_job_role.id}")
#     assert response.status_code == 200
#     data = response.json()
#     assert data["id"] == str(test_job_role.id)


# def test_get_pathway_job_counts(authorized_client, test_job_role, test_company):
#     pathway = test_company.select_a_pathway

#     response = authorized_client.get(f"{API_VERSION}/job-roles/pathways/count")
#     assert response.status_code == 200

#     data = response.json()
#     assert "pathways_count" in data
#     assert isinstance(data["pathways_count"], dict)
#     assert pathway in data["pathways_count"]
#     assert data["pathways_count"][pathway] > 0


# def test_get_pathway_job_counts_unauthorized(client):
#     response = client.get(f"{API_VERSION}/job-roles/pathways/count")
#     assert response.status_code == 500


# def test_get_pathway_job_counts_empty(authorized_client):
#     response = authorized_client.get(f"{API_VERSION}/job-roles/pathways/count")
#     assert response.status_code == 200

#     data = response.json()
#     assert "pathways_count" in data
#     assert isinstance(data["pathways_count"], dict)
#     assert len(data["pathways_count"]) >= 0
