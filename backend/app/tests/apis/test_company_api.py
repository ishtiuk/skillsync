from core.constants import constants

API_VERSION = constants.API_VERSION


def test_create_company(authorized_client, mock_data):
    company_data = mock_data["company_data"]["valid_company"]
    response = authorized_client.post(f"{API_VERSION}/company", json=company_data)
    assert response.status_code == 201, response.json()
    data = response.json()
    assert "message" in data
    assert "company" in data
    assert data["company"]["name"] == company_data["name"]
    assert data["company"]["type"] == company_data["type"]
    assert data["company"]["size"] == company_data["size"]


def test_create_company_invalid_data(authorized_client, mock_data):
    company_data = mock_data["company_data"]["invalid_company"]
    response = authorized_client.post(f"{API_VERSION}/company", json=company_data)
    assert response.status_code == 422


def test_create_company_unauthorized(client, mock_data):
    company_data = mock_data["company_data"]["valid_company"]
    response = client.post(f"{API_VERSION}/company", json=company_data)
    assert response.status_code == 500


def test_get_company(authorized_client, test_company):
    response = authorized_client.get(f"{API_VERSION}/company")  # Remove path parameter
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == test_company.name


def test_update_company(authorized_client, test_company, mock_data):
    update_data = mock_data["company_data"]["update_company"]
    response = authorized_client.patch(f"{API_VERSION}/company/{test_company.id}", json=update_data)
    assert response.status_code == 200, response.json()
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["type"] == update_data["type"]


def test_update_company_not_found(authorized_client, mock_data):
    update_data = mock_data["company_data"]["update_company"]
    response = authorized_client.patch(
        f"{API_VERSION}/company/00000000-0000-0000-0000-000000000000", json=update_data
    )
    assert response.status_code == 404
