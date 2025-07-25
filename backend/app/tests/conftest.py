import json
import os

import pytest
from dotenv import load_dotenv
from fastapi import Request
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.base_class import Base
from app.db.session import get_db
from app.utils.security import create_access_token, get_password_hash
from main import app

load_dotenv(".env.example")

TEST_DATABASE_URL = os.getenv("SQLALCHEMY_DATABASE_URI")


def save_to_db(db, obj):
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@pytest.fixture(scope="function")
def db_engine():
    engine = create_engine(TEST_DATABASE_URL)
    Base.metadata.create_all(engine)
    yield engine
    Base.metadata.drop_all(engine)
    engine.dispose()


@pytest.fixture(scope="function")
def db(db_engine):
    SessionLocal = sessionmaker(bind=db_engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def cleanup_database(db):
    for table in reversed(Base.metadata.sorted_tables):
        db.execute(table.delete())
    db.commit()


@pytest.fixture(autouse=True)
def cleanup(db):
    yield
    cleanup_database(db)


@pytest.fixture(scope="session")
def mock_data():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(current_dir, "assets", "mock_data.json")
    with open(json_path, "r") as f:
        return json.load(f)


@pytest.fixture(scope="function")
def mock_auth_middleware(monkeypatch):
    def mock_check_api_accessibility(*args, **kwargs):
        return False

    def mock_verify_token(*args, **kwargs):
        return "test@example.com"

    from app.middleware.auth import ValidationMiddleware

    monkeypatch.setattr(
        ValidationMiddleware, "check_api_accessibility", mock_check_api_accessibility
    )
    monkeypatch.setattr("app.utils.security.verify_token", mock_verify_token)
    return mock_check_api_accessibility


@pytest.fixture(scope="function")
def test_user(db, mock_data):
    from app.models.user import BaseUser, UserCareerforge

    user_data = mock_data["user_data"]["valid_user"]

    base_user = BaseUser(
        provider=user_data["provider"],
        provider_id=user_data["provider_id"],
        platform=user_data["platform"],
    )
    save_to_db(db, base_user)

    user = UserCareerforge(
        base_user_id=base_user.id,
        email=user_data["email"],
        password_hash=get_password_hash(user_data["password"]),
        first_name=user_data["first_name"],
        last_name=user_data["last_name"],
    )

    save_to_db(db, user)
    return user


@pytest.fixture(scope="function")
def test_organization(db, test_user, mock_data):
    from app.models.organization import organizations

    organization_data = mock_data["organization_data"]["valid_organization"]
    organization = organizations(
        created_by=test_user.id,
        name=organization_data["name"],
        type=organization_data["type"],
        size=organization_data["size"],
        no_of_employees=organization_data["no_of_employees"],
        is_bipoc_owned=organization_data["is_bipoc_owned"],
        location=organization_data["location"],
        city=organization_data["city"],
        state=organization_data["state"],
        country=organization_data["country"],
        overview=organization_data["overview"],
        benefits=organization_data["benefits"],
        select_a_pathway=organization_data["select_a_pathway"],
    )
    return save_to_db(db, organization)


@pytest.fixture(scope="function")
def test_position(db, test_user, test_organization, mock_data):
    from app.models.positions import Positions

    position_data = mock_data["position_data"]["valid_position"]
    position = Positions(
        user_id=test_user.id, organization_id=test_organization.id, **position_data
    )
    return save_to_db(db, position)


@pytest.fixture(scope="function")
def test_experience(db, test_user, mock_data):
    from app.models.experience import Experiences

    experience_data = mock_data["experience_data"]["valid_experience"]
    experience = Experiences(
        user_id=test_user.id,
        position_title=experience_data["position_title"],
        organization_name=experience_data["organization_name"],
        employment_type=experience_data["employment_type"],
        is_current=experience_data["is_current"],
        start_month=experience_data["start_month"],
        start_year=experience_data["start_year"],
    )
    return save_to_db(db, experience)


@pytest.fixture(scope="function")
def test_milestone(db, test_user, mock_data):
    from app.models.milestones import Milestones

    milestone_data = mock_data["milestones_data"]["valid_milestone"]
    milestone = Milestones(
        user_id=test_user.id,
        name=milestone_data["name"],
        type=milestone_data["type"],
        description=milestone_data["description"],
        tasks=milestone_data["tasks"],
        is_completed=False,
    )
    return save_to_db(db, milestone)


@pytest.fixture(scope="function")
def test_token(test_user):
    from app.schemas.user import Platform

    return create_access_token(subject=test_user.email, platform=Platform.careerforge)


@pytest.fixture(scope="function")
def mock_request(test_user):
    from app.schemas.user import Platform

    def override_request():
        scope = {"type": "http", "headers": []}
        request = Request(scope=scope)
        if not hasattr(app.state, "user"):
            app.state = type(
                "State", (), {"user": test_user.email, "platform": Platform.careerforge}
            )()
        return request

    return override_request


@pytest.fixture(scope="function")
def authorized_client(client, test_token, mock_request):
    from app.schemas.user import Platform

    original_state = getattr(app, "state", None)
    app.state = type("State", (), {"user": "test@example.com", "platform": Platform.careerforge})()

    app.dependency_overrides[Request] = mock_request
    client.headers = {**client.headers, "Authorization": f"Bearer {test_token}"}

    yield client

    app.dependency_overrides.clear()
    if original_state:
        app.state = original_state
    else:
        delattr(app, "state")


@pytest.fixture(scope="function")
def client(db, mock_auth_middleware):
    def override_get_db():
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()
