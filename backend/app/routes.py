from fastapi import APIRouter

# from app.api import applied_jobs, organization, file_uploads, goals, position, public_data, user, cover_letter
from app.api import file_uploads, milestones, positions, user

router = APIRouter(prefix="/api/v1")
router.include_router(user.user_router)
router.include_router(file_uploads.file_router)
router.include_router(milestones.milestone_router)
# router.include_router(public_data.public_data_router)
# router.include_router(organization.organization_router)
router.include_router(positions.router)
# router.include_router(applied_jobs.router)
# router.include_router(goals.router)
# router.include_router(cover_letter.cover_letter_router)
