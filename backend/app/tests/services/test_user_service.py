from uuid import uuid4

import pytest

from app.schemas.user import CreateExp, UserCreateRequest, UserUpdateRequest
from app.services.user import UserService
from app.utils.exceptions import DatabaseException, InvalidUserException, ResourceNotFound


def test_get_user_by_id_success(db, test_user):
    user_service = UserService()
    user = user_service.get_user_by_id(db=db, user_id=test_user.id)
    assert user.email == test_user.email
    assert user.first_name == test_user.first_name


def test_get_user_by_id_not_found(db):
    user_service = UserService()
    with pytest.raises(ResourceNotFound):
        user_service.get_user_by_id(db=db, user_id=uuid4())


def test_validate_user_success(db, test_user):
    user_service = UserService()
    assert user_service.validate_user(email=test_user.email, password="Test@123", db=db) is True


def test_validate_user_invalid_password(db, test_user):
    user_service = UserService()
    with pytest.raises(InvalidUserException):
        user_service.validate_user(email=test_user.email, password="wrong_password", db=db)


def test_create_user_success(db, mock_data):
    user_service = UserService()
    user_data = UserCreateRequest(**mock_data["user_data"]["new_user"])
    user = user_service.create_user_in_db(db=db, user=user_data)
    assert user.email == user_data.email
    assert user.first_name == user_data.first_name


def test_create_user_duplicate_email(db, test_user):
    user_service = UserService()
    user_data = UserCreateRequest(
        email=test_user.email,
        password="Test@123",
        first_name="New",
        last_name="User",
        provider="self",
        platform="pathways",
    )

    with pytest.raises(DatabaseException):
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


def test_add_experience(db, test_user, mock_data):
    user_service = UserService()
    exp_data = CreateExp(**mock_data["experience_data"]["valid_experience"])
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
        is_current=True,
        start_month=1,
        start_year=2023,
    )

    user_service.add_experience(db=db, user=test_user, job_exp=exp_data)
    experiences = user_service.get_experiences(db=db, user=test_user)
    exp_id = experiences[0].id

    user_service.delete_experience(db=db, exp_id=exp_id)
    updated_experiences = user_service.get_experiences(db=db, user=test_user)
    assert len(updated_experiences) == 0


def test_delete_nonexistent_experience(db):
    user_service = UserService()
    with pytest.raises(ResourceNotFound):
        user_service.delete_experience(db=db, exp_id=uuid4())
