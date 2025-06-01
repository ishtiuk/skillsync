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

TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL")


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
    from app.models.user import Users

    user_data = mock_data["user_data"]["valid_user"]
    user = Users(
        email=user_data["email"],
        password_hash=get_password_hash(user_data["password"]),
        first_name=user_data["first_name"],
        last_name=user_data["last_name"],
        provider=user_data["provider"],
        provider_id=user_data["provider_id"],
        platform=user_data["platform"],
    )
    return save_to_db(db, user)


@pytest.fixture(scope="function")
def test_company(db, test_user, mock_data):
    from app.models.company import Companies

    company_data = mock_data["company_data"]["valid_company"]
    company = Companies(
        created_by=test_user.id,
        name=company_data["name"],
        type=company_data["type"],
        size=company_data["size"],
        no_of_employees=company_data["no_of_employees"],
        is_bipoc_owned=company_data["is_bipoc_owned"],
        location=company_data["location"],
        city=company_data["city"],
        state=company_data["state"],
        country=company_data["country"],
        overview=company_data["overview"],
        benefits=company_data["benefits"],
        select_a_pathway=company_data["select_a_pathway"],
    )
    return save_to_db(db, company)


@pytest.fixture(scope="function")
def test_job_role(db, test_user, test_company, mock_data):
    from app.models.job_role import JobRoles

    job_role_data = mock_data["job_role_data"]["valid_job_role"]
    job_role = JobRoles(user_id=test_user.id, company_id=test_company.id, **job_role_data)
    return save_to_db(db, job_role)


@pytest.fixture(scope="function")
def test_job_experience(db, test_user, mock_data):
    from app.models.job_experience import JobExperiences

    experience_data = mock_data["experience_data"]["valid_experience"]
    job_experience = JobExperiences(
        user_id=test_user.id,
        position_title=experience_data["position_title"],
        company_name=experience_data["company_name"],
        employment_type=experience_data["employment_type"],
        is_current=experience_data["is_current"],
        start_month=experience_data["start_month"],
        start_year=experience_data["start_year"],
    )
    return save_to_db(db, job_experience)


@pytest.fixture(scope="function")
def test_goal(db, test_user, mock_data):
    from app.models.goals import Goals

    goal_data = mock_data["goals_data"]["valid_goal"]
    goal = Goals(
        user_id=test_user.id,
        name=goal_data["name"],
        type=goal_data["type"],
        description=goal_data["description"],
        tasks=goal_data["tasks"],
        is_completed=False,
    )
    return save_to_db(db, goal)


@pytest.fixture(scope="function")
def test_token(test_user):
    return create_access_token(subject=test_user.email)


@pytest.fixture(scope="function")
def mock_request(test_user):
    def override_request():
        scope = {"type": "http", "headers": []}
        request = Request(scope=scope)
        if not hasattr(app.state, "user"):
            app.state = type("State", (), {"user": test_user.email})()
        return request

    return override_request


@pytest.fixture(scope="function")
def authorized_client(client, test_token, mock_request):
    original_state = getattr(app, "state", None)
    app.state = type("State", (), {"user": "test@example.com"})()

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
