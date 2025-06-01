from uuid import uuid4

import pytest

from app.schemas.applied_jobs import AppliedJobCreate, AppliedJobUpdate
from app.services.applied_jobs import AppliedJobsService
from app.utils.exceptions import ConflictException, ResourceNotFound


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


def test_create_job_application_success(db, test_user, test_job_role):
    service = AppliedJobsService()
    job_data = AppliedJobCreate(
        job_id=test_job_role.id,
        activity="Applied through website",
        reaction="Excited",
        notes="Great opportunity",
        stage=get_default_stage_dict(applied=True),
        is_favourite=True,
    )

    applied_job = service.create_job_application(db=db, user=test_user, job_data=job_data)
    assert applied_job.job_id == test_job_role.id
    assert applied_job.user_id == test_user.id
    assert applied_job.activity == job_data.activity


def test_create_duplicate_application(db, test_user, test_job_role):
    service = AppliedJobsService()
    job_data = AppliedJobCreate(job_id=test_job_role.id, stage=get_default_stage_dict(applied=True))

    service.create_job_application(db=db, user=test_user, job_data=job_data)

    with pytest.raises(ConflictException):
        service.create_job_application(db=db, user=test_user, job_data=job_data)


def test_update_job_application_success(db, test_user, test_job_role):
    service = AppliedJobsService()
    job_data = AppliedJobCreate(job_id=test_job_role.id, stage=get_default_stage_dict(applied=True))
    applied_job = service.create_job_application(db=db, user=test_user, job_data=job_data)

    update_data = AppliedJobUpdate(
        activity="Had first interview",
        stage={
            "saved": True,
            "applied": True,
            "interview-1": True,
            "interview-2": False,
            "interview-3": False,
            "offer": False,
            "hired": False,
            "ineligible": False,
            "past-roles": False,
        },
        notes="Interview went well",
    )

    updated_job = service.update_job_application(
        db=db, user=test_user, job_id=applied_job.job_id, update_data=update_data
    )

    assert updated_job.activity == update_data.activity
    assert updated_job.notes == update_data.notes
    assert updated_job.stage["interview-1"] is True


def test_update_nonexistent_application(db, test_user):
    service = AppliedJobsService()
    update_data = AppliedJobUpdate(activity="Test")

    with pytest.raises(ResourceNotFound):
        service.update_job_application(
            db=db, user=test_user, job_id=uuid4(), update_data=update_data
        )


def test_get_tracked_jobs(db, test_user, test_job_role):
    service = AppliedJobsService()
    # Create application
    job_data = AppliedJobCreate(job_id=test_job_role.id, stage=get_default_stage_dict(applied=True))
    service.create_job_application(db=db, user=test_user, job_data=job_data)

    jobs = service.get_tracked_jobs(db=db, user=test_user)
    assert len(jobs) > 0
    assert jobs[0].job_id == test_job_role.id


def test_get_job_by_id(db, test_user, test_job_role):
    service = AppliedJobsService()
    job_data = AppliedJobCreate(job_id=test_job_role.id, stage=get_default_stage_dict(applied=True))
    created_job = service.create_job_application(db=db, user=test_user, job_data=job_data)

    job = service.get_job_by_id(db=db, user=test_user, job_id=test_job_role.id)
    assert job.id == created_job.id


def test_get_nonexistent_job(db, test_user):
    service = AppliedJobsService()
    with pytest.raises(ResourceNotFound):
        service.get_job_by_id(db=db, user=test_user, job_id=uuid4())


def test_delete_job_application(db, test_user, test_job_role):
    service = AppliedJobsService()
    job_data = AppliedJobCreate(job_id=test_job_role.id, stage=get_default_stage_dict(applied=True))
    service.create_job_application(db=db, user=test_user, job_data=job_data)

    service.delete_job_application(db=db, user=test_user, job_id=test_job_role.id)

    with pytest.raises(ResourceNotFound):
        service.get_job_by_id(db=db, user=test_user, job_id=test_job_role.id)


def test_delete_nonexistent_application(db, test_user):
    service = AppliedJobsService()
    with pytest.raises(ResourceNotFound):
        service.delete_job_application(db=db, user=test_user, job_id=uuid4())
