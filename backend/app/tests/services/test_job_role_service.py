# from uuid import uuid4

# import pytest

# from app.schemas.position import JobRoleCreate, JobRoleUpdate
# from app.services.position import JobRoleService
# from app.utils.exceptions import ResourceNotFound


# def test_create_position_success(db, test_user, test_organization, mock_data):
#     position_service = JobRoleService()
#     position_data = JobRoleCreate(**mock_data["position_data"]["valid_position"])
#     position = position_service.create_position(db=db, position_in=position_data, user=test_user)
#     assert position.title == position_data.title
#     assert position.job_category == position_data.job_category
#     assert position.organization_id == test_organization.id


# def test_create_position_no_organization(db, test_user, mock_data):
#     position_service = JobRoleService()
#     position_data = JobRoleCreate(**mock_data["position_data"]["valid_position"])
#     test_user.id = uuid4()  # Change user ID to simulate no organization
#     with pytest.raises(ResourceNotFound):
#         position_service.create_position(db=db, position_in=position_data, user=test_user)


# def test_update_position_success(db, test_position, mock_data):
#     position_service = JobRoleService()
#     update_data = JobRoleUpdate(**mock_data["position_data"]["update_position"])
#     updated_position = position_service.update_position(
#         db=db, position_id=test_position.id, position_in=update_data
#     )
#     assert updated_position.title == update_data.title
#     assert updated_position.level_of_experience == update_data.level_of_experience


# def test_update_position_not_found(db, mock_data):
#     position_service = JobRoleService()
#     update_data = JobRoleUpdate(**mock_data["position_data"]["update_position"])
#     with pytest.raises(ResourceNotFound):
#         position_service.update_position(db=db, position_id=uuid4(), position_in=update_data)


# def test_get_positions_pathways(db, test_user, test_position):
#     position_service = JobRoleService()
#     filters = {"job_category": ["software-engineering"], "position_type": ["Full-Time"]}
#     positions = position_service.get_positions_for_pathways(
#         db=db, user=test_user, filters=filters, page=0
#     )
#     assert len(positions) > 0
#     assert positions[0].job_category == "software-engineering"


# def test_get_positions_candid(db, test_user, test_position):
#     position_service = JobRoleService()
#     positions = position_service.get_positions_for_candid(db=db, user=test_user, page=0, limit=10)
#     assert len(positions) > 0
#     assert positions[0].id == test_position.id


# def test_get_single_position(db, test_position):
#     position_service = JobRoleService()
#     position = position_service.get_single_position(db=db, position_id=test_position.id)
#     assert position.id == test_position.id


# def test_format_position_response(db, test_position, test_user):
#     position_service = JobRoleService()
#     response = position_service.format_position_response(
#         position=test_position, db=db, include_stage=True, user_id=test_user.id
#     )
#     assert response["id"] == test_position.id
#     assert "stage" in response


# def test_get_pathway_job_counts(db, test_position, test_organization):
#     position_service = JobRoleService()
#     response = position_service.get_pathway_job_counts(db=db)

#     assert isinstance(response.pathways_count, dict)
#     assert test_organization.select_a_pathway in response.pathways_count
#     assert response.pathways_count[test_organization.select_a_pathway] > 0


# def test_get_pathway_job_counts_empty(db):
#     position_service = JobRoleService()
#     response = position_service.get_pathway_job_counts(db=db)

#     assert isinstance(response.pathways_count, dict)
#     assert len(response.pathways_count) == 0
