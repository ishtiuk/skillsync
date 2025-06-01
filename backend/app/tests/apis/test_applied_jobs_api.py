from core.constants import constants

API_VERSION = constants.API_VERSION


def get_default_stage_dict(applied=False):
    return {
        "saved": True,
        "applied": applied,
        "interview-1": False,
        "interview-2": False,
        "interview-3": False,
        "offer": False,
        "hired": False,
        "ineligible": False,
        "past-roles": False,
    }


def test_create_job_application(authorized_client, test_job_role):
    job_data = {
        "job_id": str(test_job_role.id),
        "activity": "Applied through website",
        "reaction": "Excited",
        "notes": "Great opportunity",
        "stage": get_default_stage_dict(applied=True),
        "is_favourite": True,
    }

    response = authorized_client.post(f"{API_VERSION}/jobs", json=job_data)
    assert response.status_code == 201
    data = response.json()
    assert data["job_id"] == str(test_job_role.id)
    assert data["activity"] == job_data["activity"]


def test_create_duplicate_application(authorized_client, test_job_role):
    job_data = {"job_id": str(test_job_role.id), "stage": get_default_stage_dict(applied=True)}

    authorized_client.post(f"{API_VERSION}/jobs", json=job_data)
    response = authorized_client.post(f"{API_VERSION}/jobs", json=job_data)
    assert response.status_code == 409
    assert "already applied" in response.json()["detail"].lower()


def test_update_job_application(authorized_client, test_job_role):
    job_data = {
        "job_id": str(test_job_role.id),
        "stage": {
            "saved": True,
            "applied": True,
            "interview-1": False,
            "offer": False,
            "hired": False,
            "ineligible": False,
            "past-roles": False,
        },
    }

    create_response = authorized_client.post(f"{API_VERSION}/jobs", json=job_data)
    assert create_response.status_code == 201

    update_data = {
        "activity": "Had first interview",
        "stage": {
            "saved": True,
            "applied": True,
            "interview-1": True,
            "interview-2": True,
            "interview-3": True,
            "offer": False,
            "hired": False,
            "ineligible": False,
            "past-roles": False,
        },
        "notes": "Interview went well",
    }

    response = authorized_client.patch(f"{API_VERSION}/jobs/{test_job_role.id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["activity"] == update_data["activity"]
    assert data["notes"] == update_data["notes"]
    assert data["stage"]["interview-1"] is True
    assert data["stage"]["interview-2"] is True
    assert data["stage"]["interview-3"] is True


def test_update_nonexistent_application(authorized_client):
    update_data = {"activity": "Test"}
    response = authorized_client.patch(
        f"{API_VERSION}/jobs/00000000-0000-0000-0000-000000000000", json=update_data
    )
    assert response.status_code == 404


def test_get_tracked_jobs(authorized_client, test_job_role):
    job_data = {"job_id": str(test_job_role.id), "stage": get_default_stage_dict(applied=True)}

    create_response = authorized_client.post(f"{API_VERSION}/jobs", json=job_data)
    assert create_response.status_code == 201

    response = authorized_client.get(f"{API_VERSION}/jobs")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["job_id"] == str(test_job_role.id)
    assert "job_info" in data[0]


def test_get_tracked_jobs_pagination(authorized_client):
    response = authorized_client.get(f"{API_VERSION}/jobs?page=0&limit=10")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_job_by_id(authorized_client, test_job_role):
    job_data = {"job_id": str(test_job_role.id), "stage": get_default_stage_dict(applied=True)}

    create_response = authorized_client.post(f"{API_VERSION}/jobs", json=job_data)
    assert create_response.status_code == 201

    response = authorized_client.get(f"{API_VERSION}/jobs/{test_job_role.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["job_id"] == str(test_job_role.id)
    assert "job_info" in data


def test_get_nonexistent_job(authorized_client):
    response = authorized_client.get(f"{API_VERSION}/jobs/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


def test_delete_job_application(authorized_client, test_job_role):
    job_data = {"job_id": str(test_job_role.id), "stage": get_default_stage_dict(applied=True)}

    create_response = authorized_client.post(f"{API_VERSION}/jobs", json=job_data)
    assert create_response.status_code == 201

    response = authorized_client.delete(f"{API_VERSION}/jobs/{test_job_role.id}")
    assert response.status_code == 200

    get_response = authorized_client.get(f"{API_VERSION}/jobs/{test_job_role.id}")
    assert get_response.status_code == 404


def test_delete_nonexistent_job(authorized_client):
    response = authorized_client.delete(f"{API_VERSION}/jobs/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
