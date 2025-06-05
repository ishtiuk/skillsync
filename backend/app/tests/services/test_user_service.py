from unittest.mock import MagicMock
from uuid import uuid4

import pytest
from fastapi import Request

from app.schemas.user import (
    CreateExp,
    GoogleUserCreate,
    Platform,
    UpdateExp,
    UserCreateRequest,
    UserUpdateRequest,
)
from app.services.user import UserService, get_active_user, get_platform
from app.utils.exceptions import (
    ConflictException,
    DatabaseException,
    InvalidUserException,
    ResourceNotFound,
)


def test_get_user_by_id_success(db, test_user):
    user_service = UserService()
    user = user_service.get_user_by_id(db=db, user_id=test_user.id)
    assert user.email == test_user.email
    assert user.first_name == test_user.first_name
    assert user.base_user.platform == Platform.careerforge


def test_get_user_by_id_not_found(db):
    user_service = UserService()
    with pytest.raises(ResourceNotFound):
        user_service.get_user_by_id(db=db, user_id=uuid4())


def test_validate_user_success(db, test_user):
    user_service = UserService()
    result = user_service.validate_user(
        email=test_user.email,
        password="Test@123",
        platform=Platform.careerforge,
        db=db,
    )
    assert result is True


def test_validate_user_invalid_password(db, test_user):
    user_service = UserService()
    with pytest.raises(InvalidUserException):
        user_service.validate_user(
            email=test_user.email,
            password="wrong_password",
            platform=Platform.careerforge,
            db=db,
        )


def test_validate_user_email_not_found(db):
    user_service = UserService()
    with pytest.raises(InvalidUserException):
        user_service.validate_user(
            email="nonexistent@example.com",
            password="Test@123",
            platform=Platform.careerforge,
            db=db,
        )


def test_create_user_success(db, mock_data):
    user_service = UserService()
    user_data = UserCreateRequest(**mock_data["user_data"]["new_user"])
    user = user_service.create_user_in_db(db=db, user=user_data)
    assert user.email == user_data.email
    assert user.first_name == user_data.first_name
    assert user.base_user.platform == Platform.careerforge


def test_create_google_user_success(db):
    user_service = UserService()
    user_data = GoogleUserCreate(
        email="google@example.com",
        first_name="Google",
        last_name="User",
        access_token="fake_token",
        platform=Platform.careerforge,
    )
    user = user_service.create_user_in_db_google(db=db, user=user_data)
    assert user.email == user_data.email
    assert user.base_user.provider == "google"
    assert user.base_user.platform == Platform.careerforge


def test_create_user_duplicate_email(db, test_user):
    user_service = UserService()
    user_data = UserCreateRequest(
        email=test_user.email,
        password="Test@123",
        first_name="New",
        last_name="User",
        provider="self",
        platform=Platform.careerforge,
    )
    with pytest.raises(ConflictException):
        user_service.create_user_in_db(db=db, user=user_data)


def test_update_user_data(db, test_user):
    user_service = UserService()
    update_data = UserUpdateRequest(
        first_name="Updated", last_name="Name", city="New City", country="USA"
    )
    updated_user = user_service.update_user_data(db=db, user=test_user, update_data=update_data)
    assert updated_user.first_name == update_data.first_name
    assert updated_user.last_name == update_data.last_name
    assert updated_user.city == update_data.city
    assert updated_user.country == update_data.country


def test_add_experience(db, test_user):
    user_service = UserService()
    exp_data = CreateExp(
        position_title="Software Engineer",
        company_name="Tech Corp",
        employment_type="Full-time",
        start_month=1,
        start_year=2023,
        is_current=True,
        user_id=test_user.id,
    )
    # Service returns None, so we verify by getting experiences
    user_service.add_experience(db=db, user=test_user, job_exp=exp_data)
    experiences = user_service.get_experiences(db=db, user=test_user)
    assert len(experiences) == 1
    assert experiences[0].position_title == exp_data.position_title
    assert experiences[0].company_name == exp_data.company_name
    assert experiences[0].user_id == test_user.id


def test_get_experiences(db, test_user):
    user_service = UserService()
    exp_data = CreateExp(
        position_title="Software Engineer",
        company_name="Tech Corp",
        employment_type="Full-time",
        start_month=1,
        start_year=2023,
        is_current=True,
        user_id=test_user.id,
    )
    user_service.add_experience(db=db, user=test_user, job_exp=exp_data)
    experiences = user_service.get_experiences(db=db, user=test_user)
    assert len(experiences) == 1
    assert experiences[0].position_title == exp_data.position_title


def test_get_experiences_empty(db, test_user):
    user_service = UserService()
    experiences = user_service.get_experiences(db=db, user=test_user)
    assert len(experiences) == 0


def test_delete_experience(db, test_user):
    user_service = UserService()
    exp_data = CreateExp(
        position_title="Software Engineer",
        company_name="Tech Corp",
        employment_type="Full-time",
        start_month=1,
        start_year=2023,
        is_current=True,
        user_id=test_user.id,
    )
    # Add experience
    user_service.add_experience(db=db, user=test_user, job_exp=exp_data)
    experiences = user_service.get_experiences(db=db, user=test_user)
    assert len(experiences) == 1

    # Delete experience
    user_service.delete_experience(db=db, exp_id=experiences[0].id)
    experiences = user_service.get_experiences(db=db, user=test_user)
    assert len(experiences) == 0


def test_delete_nonexistent_experience(db):
    user_service = UserService()
    with pytest.raises(ResourceNotFound):
        user_service.delete_experience(db=db, exp_id=uuid4())


def test_password_reset_request(db, test_user):
    user_service = UserService()
    # This should not raise an exception
    user_service.password_reset_request(db=db, email=test_user.email, platform=Platform.careerforge)


def test_password_reset_invalid_email(db):
    user_service = UserService()
    with pytest.raises(InvalidUserException):
        user_service.password_reset_request(
            db=db,
            email="nonexistent@example.com",
            platform=Platform.careerforge,
        )


def test_password_reset_request_google_user(db):
    user_service = UserService()
    user_data = GoogleUserCreate(
        email="google@example.com",
        first_name="Google",
        last_name="User",
        access_token="fake_token",
        platform=Platform.careerforge,
        provider="google",
    )
    user_service.create_user_in_db_google(db=db, user=user_data)

    # This should not raise an exception for a Google user
    user_service.password_reset_request(db=db, email=user_data.email, platform=Platform.careerforge)


def test_update_password(db, test_user):
    user_service = UserService()
    new_password = "NewTest@123"

    updated_user = user_service.update_password(
        db=db,
        email=test_user.email,
        new_password=new_password,
        platform=Platform.careerforge,
    )

    assert updated_user.id == test_user.id
    user = user_service.validate_user(
        email=test_user.email,
        password=new_password,
        platform=Platform.careerforge,
        db=db,
    )
    assert user is not None


def test_get_platform():
    mock_request = MagicMock(spec=Request)
    mock_request.app.state.platform = "pathways"
    platform = get_platform(mock_request)
    assert platform == Platform.careerforge


def test_get_active_user_pathways(db, test_user):
    mock_request = MagicMock(spec=Request)
    mock_request.app.state.user = test_user.email
    mock_request.app.state.platform = Platform.careerforge
    platform_user, provider = get_active_user(request=mock_request, db=db)
    assert platform_user.id == test_user.id
    assert provider == "self"


def test_get_active_user_not_found(db):
    mock_request = MagicMock(spec=Request)
    mock_request.app.state.user = "nonexistent@example.com"
    mock_request.app.state.platform = Platform.careerforge
    with pytest.raises(ResourceNotFound):
        get_active_user(request=mock_request, db=db)


def test_get_active_user_base_user_only(db):
    user_service = UserService()
    # Create a base user without a platform-specific user
    user_data = UserCreateRequest(
        email="base@example.com",
        password="Test@123",
        first_name="Base",
        last_name="User",
        provider="self",
        platform=Platform.careerforge,
    )
    user = user_service.create_user_in_db(db=db, user=user_data)

    mock_request = MagicMock(spec=Request)
    mock_request.app.state.user = user.email
    mock_request.app.state.platform = Platform.candid

    with pytest.raises(ResourceNotFound):
        get_active_user(request=mock_request, db=db)


def test_get_user_by_platform_candid(db):
    user_service = UserService()
    user_data = GoogleUserCreate(
        email="candid@example.com",
        first_name="Candid",
        last_name="User",
        access_token="fake_token",
        platform=Platform.candid,
        provider="google",
    )
    candid_user = user_service.create_user_in_db_google(db=db, user=user_data)
    found_user = user_service.get_user_by_platform(
        db=db, email=user_data.email, platform=Platform.candid
    )
    assert found_user.id == candid_user.id


def test_get_user_by_platform_not_found(db):
    user_service = UserService()
    user = user_service.get_user_by_platform(
        db=db, email="nonexistent@example.com", platform=Platform.careerforge
    )
    assert user is None


def test_update_candid_user_data(db):
    user_service = UserService()
    user_data = GoogleUserCreate(
        email="candid@example.com",
        first_name="Candid",
        last_name="User",
        access_token="fake_token",
        platform=Platform.candid,
        provider="google",
    )
    candid_user = user_service.create_user_in_db_google(db=db, user=user_data)

    update_data = UserUpdateRequest(
        first_name="Updated", last_name="Candid", country="Canada", phone_number="+1234567890"
    )

    updated_user = user_service.update_user_data(db=db, user=candid_user, update_data=update_data)
    assert updated_user.first_name == update_data.first_name
    assert updated_user.country == update_data.country
    assert updated_user.phone_number == update_data.phone_number


def test_update_experience_success(db, test_user):
    user_service = UserService()
    # First create an experience
    exp_data = CreateExp(
        position_title="Software Engineer",
        company_name="Tech Corp",
        employment_type="Full-time",
        start_month=1,
        start_year=2023,
        is_current=True,
        user_id=test_user.id,
    )
    user_service.add_experience(db=db, user=test_user, job_exp=exp_data)
    experiences = user_service.get_experiences(db=db, user=test_user)

    # Now update it
    update_data = UpdateExp(
        position_title="Senior Software Engineer",
        company_name="New Tech Corp",
        is_current=False,
        end_month=12,
        end_year=2023,
    )

    updated_exp = user_service.update_experience(
        db=db, exp_id=experiences[0].id, update_data=update_data
    )
    assert updated_exp.position_title == update_data.position_title
    assert updated_exp.company_name == update_data.company_name
    assert updated_exp.is_current == update_data.is_current
    assert updated_exp.end_month == update_data.end_month
    assert updated_exp.end_year == update_data.end_year


def test_update_experience_not_found(db):
    user_service = UserService()
    update_data = UpdateExp(position_title="New Title")
    with pytest.raises(ResourceNotFound):
        user_service.update_experience(db=db, exp_id=uuid4(), update_data=update_data)


def test_update_experience_db_error(db, test_user, mocker):
    user_service = UserService()
    exp_data = CreateExp(
        position_title="Software Engineer",
        company_name="Tech Corp",
        employment_type="Full-time",
        start_month=1,
        start_year=2023,
        is_current=True,
        user_id=test_user.id,
    )
    user_service.add_experience(db=db, user=test_user, job_exp=exp_data)
    experiences = user_service.get_experiences(db=db, user=test_user)

    # Mock the update method to raise an exception
    mocker.patch("app.db.crud.CRUDBase.update", side_effect=Exception("Database error"))

    update_data = UpdateExp(position_title="Senior Software Engineer")
    with pytest.raises(DatabaseException):
        user_service.update_experience(db=db, exp_id=experiences[0].id, update_data=update_data)


def test_update_password_invalid_email(db):
    user_service = UserService()
    with pytest.raises(InvalidUserException):
        user_service.update_password(
            db=db,
            email="nonexistent@example.com",
            new_password="NewPassword@123",
            platform=Platform.careerforge,
        )


def test_update_user_data_db_error(db, test_user, mocker):
    user_service = UserService()
    update_data = UserUpdateRequest(first_name="Updated")

    # Mock the update method to raise an exception
    mocker.patch("app.db.crud.CRUDBase.update", side_effect=Exception("Database error"))

    with pytest.raises(DatabaseException):
        user_service.update_user_data(db=db, user=test_user, update_data=update_data)
