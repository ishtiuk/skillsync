from core.constants import constants

API_VERSION = constants.API_VERSION


def test_create_user(client, mock_data):
    user_data = mock_data["user_data"]["new_user"]
    response = client.post(f"{API_VERSION}/user/self", json=user_data)
    assert response.status_code == 201
    data = response.json()
    assert "user" in data
    assert data["user"]["email"] == user_data["email"]
    assert "access_token" in data


def test_create_user_invalid_email(client, mock_data):
    user_data = mock_data["user_data"]["invalid_user"]
    response = client.post(f"{API_VERSION}/user/self", json=user_data)
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data
    assert any("email" in error["loc"] for error in data["detail"])
    assert any(
        "value is not a valid email address" in error["msg"].lower() for error in data["detail"]
    )


def test_create_user_missing_required_fields(client):
    user_data = {"email": "test@example.com"}
    response = client.post(f"{API_VERSION}/user/self", json=user_data)
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data
    assert any("field required" in error["msg"].lower() for error in data["detail"])


def test_login_valid(client, test_user, mock_data):
    login_data = mock_data["user_data"]["login_data"]["valid"]
    response = client.post(f"{API_VERSION}/auth/login/self", json=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["message"] == "Successfully Logged In"


def test_invalid_login(client, mock_data):
    login_data = mock_data["user_data"]["login_data"]["invalid"]
    response = client.post(f"{API_VERSION}/auth/login/self", json=login_data)
    assert response.status_code == 401
    data = response.json()
    assert "detail" in data
    assert data["detail"] == "Invalid username or password"


def test_get_current_user(authorized_client, test_user):
    response = authorized_client.get(f"{API_VERSION}/user/me")
    assert response.status_code == 200, f"Response: {response.json()}"  # Add error message
    data = response.json()
    assert data["email"] == test_user.email
    assert data["id"] is not None
    assert "password_hash" not in data


def test_update_user(authorized_client, mock_data):
    update_data = mock_data["user_data"]["update_user"]
    response = authorized_client.put(f"{API_VERSION}/user/update-user", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == update_data["first_name"]
    assert data["last_name"] == update_data["last_name"]
    assert data["city"] == update_data["city"]
    assert data["country"] == update_data["country"]


def test_get_user_without_auth(client):
    response = client.get(f"{API_VERSION}/user/me")
    assert response.status_code == 500


def test_public_user_profile(client, test_user):
    response = client.get(f"{API_VERSION}/user/public/{test_user.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user.email
    assert "password_hash" not in data


def test_create_experience(authorized_client, mock_data):
    exp_data = mock_data["experience_data"]["valid_experience"]
    response = authorized_client.post(f"{API_VERSION}/user/experience", json=exp_data)
    assert response.status_code == 201
    assert response.json()["message"] == "Experience added successfully"


def test_update_experience(authorized_client, mock_data, test_job_experience):
    update_data = mock_data["experience_data"]["update_experience"]
    response = authorized_client.put(
        f"{API_VERSION}/user/experience/{test_job_experience.id}", json=update_data
    )
    assert response.status_code == 200


def test_get_experiences(authorized_client, test_user):
    response = authorized_client.get(f"{API_VERSION}/user/experience")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_get_public_user_invalid_id(client):
    response = client.get(f"{API_VERSION}/user/public/invalid-uuid")
    assert response.status_code == 422
