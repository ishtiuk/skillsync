from fastapi import APIRouter

# from app.api import applied_jobs, company, file_uploads, goals, job_role, public_data, user, cover_letter
from app.api import user

router = APIRouter(prefix="/api/v1")
router.include_router(user.user_router)
# router.include_router(public_data.public_data_router)
# router.include_router(file_uploads.file_router)
# router.include_router(company.company_router)
# router.include_router(job_role.router)
# router.include_router(applied_jobs.router)
# router.include_router(goals.router)
# router.include_router(cover_letter.cover_letter_router)
