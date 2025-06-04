# from uuid import uuid4

# import pytest

# from app.schemas.job_role import JobRoleCreate, JobRoleUpdate
# from app.services.job_role import JobRoleService
# from app.utils.exceptions import ResourceNotFound


# def test_create_job_role_success(db, test_user, test_company, mock_data):
#     job_role_service = JobRoleService()
#     job_role_data = JobRoleCreate(**mock_data["job_role_data"]["valid_job_role"])
#     job_role = job_role_service.create_job_role(db=db, job_role_in=job_role_data, user=test_user)
#     assert job_role.title == job_role_data.title
#     assert job_role.job_category == job_role_data.job_category
#     assert job_role.company_id == test_company.id


# def test_create_job_role_no_company(db, test_user, mock_data):
#     job_role_service = JobRoleService()
#     job_role_data = JobRoleCreate(**mock_data["job_role_data"]["valid_job_role"])
#     test_user.id = uuid4()  # Change user ID to simulate no company
#     with pytest.raises(ResourceNotFound):
#         job_role_service.create_job_role(db=db, job_role_in=job_role_data, user=test_user)


# def test_update_job_role_success(db, test_job_role, mock_data):
#     job_role_service = JobRoleService()
#     update_data = JobRoleUpdate(**mock_data["job_role_data"]["update_job_role"])
#     updated_job_role = job_role_service.update_job_role(
#         db=db, job_role_id=test_job_role.id, job_role_in=update_data
#     )
#     assert updated_job_role.title == update_data.title
#     assert updated_job_role.level_of_experience == update_data.level_of_experience


# def test_update_job_role_not_found(db, mock_data):
#     job_role_service = JobRoleService()
#     update_data = JobRoleUpdate(**mock_data["job_role_data"]["update_job_role"])
#     with pytest.raises(ResourceNotFound):
#         job_role_service.update_job_role(db=db, job_role_id=uuid4(), job_role_in=update_data)


# def test_get_job_roles_pathways(db, test_user, test_job_role):
#     job_role_service = JobRoleService()
#     filters = {"job_category": ["software-engineering"], "position_type": ["Full-Time"]}
#     job_roles = job_role_service.get_job_roles_for_pathways(
#         db=db, user=test_user, filters=filters, page=0
#     )
#     assert len(job_roles) > 0
#     assert job_roles[0].job_category == "software-engineering"


# def test_get_job_roles_candid(db, test_user, test_job_role):
#     job_role_service = JobRoleService()
#     job_roles = job_role_service.get_job_roles_for_candid(db=db, user=test_user, page=0, limit=10)
#     assert len(job_roles) > 0
#     assert job_roles[0].id == test_job_role.id


# def test_get_single_job_role(db, test_job_role):
#     job_role_service = JobRoleService()
#     job_role = job_role_service.get_single_job_role(db=db, job_role_id=test_job_role.id)
#     assert job_role.id == test_job_role.id


# def test_format_job_role_response(db, test_job_role, test_user):
#     job_role_service = JobRoleService()
#     response = job_role_service.format_job_role_response(
#         job_role=test_job_role, db=db, include_stage=True, user_id=test_user.id
#     )
#     assert response["id"] == test_job_role.id
#     assert "stage" in response


# def test_get_pathway_job_counts(db, test_job_role, test_company):
#     job_role_service = JobRoleService()
#     response = job_role_service.get_pathway_job_counts(db=db)

#     assert isinstance(response.pathways_count, dict)
#     assert test_company.select_a_pathway in response.pathways_count
#     assert response.pathways_count[test_company.select_a_pathway] > 0


# def test_get_pathway_job_counts_empty(db):
#     job_role_service = JobRoleService()
#     response = job_role_service.get_pathway_job_counts(db=db)

#     assert isinstance(response.pathways_count, dict)
#     assert len(response.pathways_count) == 0
