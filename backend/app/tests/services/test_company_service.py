# from uuid import uuid4

# import pytest

# from app.schemas.organization import organizationCreate, organizationUpdate
# from app.services.organization import organizationService
# from app.utils.exceptions import (
#     PermissionDeniedException,
#     ResourceNotFound,
# )


# def test_create_organization_success(db, test_user, mock_data):
#     organization_service = organizationService()
#     organization_data = organizationCreate(**mock_data["organization_data"]["valid_organization"])
#     organization = organization_service.create_organization(db=db, organization=organization_data, user=test_user)
#     assert organization.name == organization_data.name
#     assert organization.created_by == test_user.id


# def test_get_organization_success(db, test_user, test_organization):
#     organization_service = organizationService()
#     organization = organization_service.get_organization(db=db, user=test_user)
#     assert organization.id == test_organization.id
#     assert organization.name == test_organization.name


# def test_get_organization_not_found(db, test_user):
#     organization_service = organizationService()
#     with pytest.raises(ResourceNotFound):
#         organization_service.get_organization(db=db, user=test_user)


# def test_update_organization_success(db, test_user, test_organization, mock_data):
#     organization_service = organizationService()
#     update_data = organizationUpdate(**mock_data["organization_data"]["update_organization"])
#     updated_organization = organization_service.update_organization(
#         db=db, organization_id=test_organization.id, organization_update=update_data, user=test_user
#     )
#     assert updated_organization.name == update_data.name
#     assert updated_organization.type == update_data.type


# def test_update_organization_not_found(db, test_user, mock_data):
#     organization_service = organizationService()
#     update_data = organizationUpdate(**mock_data["organization_data"]["update_organization"])
#     with pytest.raises(ResourceNotFound):
#         organization_service.update_organization(
#             db=db, organization_id=uuid4(), organization_update=update_data, user=test_user
#         )


# def test_update_organization_wrong_user(db, test_user, test_organization, mock_data):
#     organization_service = organizationService()
#     update_data = organizationUpdate(**mock_data["organization_data"]["update_organization"])
#     test_user.id = uuid4()  # Change user ID to simulate wrong user
#     with pytest.raises(PermissionDeniedException):
#         organization_service.update_organization(
#             db=db, organization_id=test_organization.id, organization_update=update_data, user=test_user
#         )
