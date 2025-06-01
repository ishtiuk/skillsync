from fastapi import APIRouter

from app.api import user
from app.api.careerforge import career as career_routes
from app.api.talenthub import organization as org_routes
from app.api import careerforge, talenthub

# Create main router
router = APIRouter()

# ========== Core Shared Routes ==========
# These routes are platform-agnostic and handle shared functionality
router.include_router(
    user.user_router,
    tags=["core"],
    prefix="/api/v1"
)

# ========== CareerForge Platform ==========
careerforge_router = APIRouter(
    prefix="/api/v1/careerforge",
    tags=["careerforge"]
)

# Career management routes (resume, portfolio, etc.)
careerforge_router.include_router(
    career_routes.router,
    prefix="/career"
)

# Other CareerForge-specific routes (jobs, skills, etc.)
careerforge_router.include_router(careerforge.router)

# ========== TalentHub Platform ==========
talenthub_router = APIRouter(
    prefix="/api/v1/talenthub",
    tags=["talenthub"]
)

# Organization management routes
talenthub_router.include_router(
    org_routes.router,
    prefix="/organization"
)

# Other TalentHub-specific routes (positions, pipeline, etc.)
talenthub_router.include_router(talenthub.router)

# Include platform routers in main router
router.include_router(careerforge_router)
router.include_router(talenthub_router)
