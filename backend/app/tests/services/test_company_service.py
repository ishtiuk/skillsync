# from uuid import uuid4

# import pytest

# from app.schemas.company import CompanyCreate, CompanyUpdate
# from app.services.company import CompanyService
# from app.utils.exceptions import (
#     PermissionDeniedException,
#     ResourceNotFound,
# )


# def test_create_company_success(db, test_user, mock_data):
#     company_service = CompanyService()
#     company_data = CompanyCreate(**mock_data["company_data"]["valid_company"])
#     company = company_service.create_company(db=db, company=company_data, user=test_user)
#     assert company.name == company_data.name
#     assert company.created_by == test_user.id


# def test_get_company_success(db, test_user, test_company):
#     company_service = CompanyService()
#     company = company_service.get_company(db=db, user=test_user)
#     assert company.id == test_company.id
#     assert company.name == test_company.name


# def test_get_company_not_found(db, test_user):
#     company_service = CompanyService()
#     with pytest.raises(ResourceNotFound):
#         company_service.get_company(db=db, user=test_user)


# def test_update_company_success(db, test_user, test_company, mock_data):
#     company_service = CompanyService()
#     update_data = CompanyUpdate(**mock_data["company_data"]["update_company"])
#     updated_company = company_service.update_company(
#         db=db, company_id=test_company.id, company_update=update_data, user=test_user
#     )
#     assert updated_company.name == update_data.name
#     assert updated_company.type == update_data.type


# def test_update_company_not_found(db, test_user, mock_data):
#     company_service = CompanyService()
#     update_data = CompanyUpdate(**mock_data["company_data"]["update_company"])
#     with pytest.raises(ResourceNotFound):
#         company_service.update_company(
#             db=db, company_id=uuid4(), company_update=update_data, user=test_user
#         )


# def test_update_company_wrong_user(db, test_user, test_company, mock_data):
#     company_service = CompanyService()
#     update_data = CompanyUpdate(**mock_data["company_data"]["update_company"])
#     test_user.id = uuid4()  # Change user ID to simulate wrong user
#     with pytest.raises(PermissionDeniedException):
#         company_service.update_company(
#             db=db, company_id=test_company.id, company_update=update_data, user=test_user
#         )
