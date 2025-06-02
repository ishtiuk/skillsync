from fastapi import APIRouter

from app.api import user

router = APIRouter(prefix="/api/v1")
router.include_router(user.user_router)
router.include_router(user.careerforge_router)
router.include_router(user.talenthub_router)
