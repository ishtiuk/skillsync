from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import UUID4
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import UserCareerForge
from app.schemas.experience import ExperienceCreate, ExperienceResponse, ExperienceUpdate
from app.schemas.milestone import MilestoneCreate, MilestoneResponse, MilestoneUpdate
from app.schemas.user import (
    GoogleLoginRequest,
    LoginRequest,
    Platform,
    PublicUserResponse,
    UserCareerForgeProfile,
    UserCareerForgeResponse,
    UserCreateRequest,
    UserResponse,
    UserTalentHubProfile,
    UserTalentHubResponse,
    UserUpdateRequest,
)
from app.services.google_auth import google_auth_service
from app.services.user import (
    get_active_careerforge_user,
    get_active_talenthub_user,
    user_careerforge_crud,
    user_service,
    user_talenthub_crud,
)
from app.utils.exceptions import (
    ConflictException,
    DatabaseException,
    GoogleAuthException,
    InvalidUserException,
    PlatformException,
    ResourceNotFound,
)
from app.utils.security import create_access_token
from core.constants import error_messages
from core.logger import logger

user_router = APIRouter()
careerforge_router = APIRouter(prefix="/careerforge", tags=["careerforge"])
talenthub_router = APIRouter(prefix="/talenthub", tags=["talenthub"])


@user_router.post("/auth/login", tags=["auth"])
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    try:
        if user_service.validate_user(
            email=request.email, password=request.password, platform=request.platform, db=db
        ):
            access_token = create_access_token(subject=request.email, platform=request.platform)
            return JSONResponse(
                content={"message": "Successfully Logged In", "access_token": access_token},
                status_code=status.HTTP_200_OK,
            )
    except InvalidUserException as e:
        logger.error(f"Login failed: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error during login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@user_router.post("/auth/login/google", tags=["auth"])
async def google_login(request: GoogleLoginRequest, db: Session = Depends(get_db)):
    try:
        user_info = google_auth_service.get_user_info(request.access_token)
        if user_info["email"]:
            access_token = create_access_token(
                subject=user_info["email"], platform=request.platform
            )
            return JSONResponse(
                content={"access_token": access_token}, status_code=status.HTTP_200_OK
            )
        raise GoogleAuthException("Invalid token")
    except GoogleAuthException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@user_router.post("/users", response_model=UserResponse, tags=["users"])
async def create_user(user_data: UserCreateRequest, db: Session = Depends(get_db)):
    try:
        user = user_service.create_user_in_db(db=db, user=user_data)
        access_token = create_access_token(subject=user.email, platform=user_data.platform)

        # Handle platform-specific response
        if user_data.platform == Platform.careerforge:
            response = jsonable_encoder(
                UserCareerForgeResponse(
                    id=user.base_user.id,
                    provider=user.base_user.provider,
                    provider_id=user.base_user.provider_id,
                    platform=user.base_user.platform,
                    account_tier=user.base_user.account_tier,
                    careerforge_profile=UserCareerForgeProfile(**jsonable_encoder(user)),
                )
            )
        else:
            response = jsonable_encoder(
                UserTalentHubResponse(
                    id=user.base_user.id,
                    provider=user.base_user.provider,
                    provider_id=user.base_user.provider_id,
                    platform=user.base_user.platform,
                    account_tier=user.base_user.account_tier,
                    talenthub_profile=UserTalentHubProfile(**jsonable_encoder(user)),
                )
            )

        return JSONResponse(
            content={"user": response, "access_token": access_token},
            status_code=status.HTTP_201_CREATED,
        )
    except ConflictException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@user_router.get("/users/me", tags=["users"])
async def get_current_user(request: Request, db: Session = Depends(get_db)):
    try:
        logger.info("Fetching current user profile")
        email = request.app.state.user

        # Try CareerForge first
        try:
            user = get_active_careerforge_user(request, db)
            response = jsonable_encoder(
                UserCareerForgeResponse(
                    id=user.base_user.id,
                    provider=user.base_user.provider,
                    provider_id=user.base_user.provider_id,
                    platform=user.base_user.platform,
                    account_tier=user.base_user.account_tier,
                    careerforge_profile=UserCareerForgeProfile(**jsonable_encoder(user)),
                )
            )
            return JSONResponse(
                content={
                    "message": "User profile retrieved successfully",
                    "data": response,
                },
                status_code=status.HTTP_200_OK,
            )
        except ResourceNotFound:
            logger.debug("User not found in CareerForge, trying TalentHub")
            pass

        try:
            user = get_active_talenthub_user(request, db)
            return JSONResponse(
                content={
                    "message": "User profile retrieved successfully",
                    "data": jsonable_encoder(UserTalentHubResponse(**jsonable_encoder(user))),
                },
                status_code=status.HTTP_200_OK,
            )
        except ResourceNotFound:
            logger.debug("User not found in TalentHub")
            pass

        logger.error(f"User not found for email: {email}")
        raise ResourceNotFound(error_messages["user_not_found"])
    except ResourceNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Error fetching user profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages["internal_server_error"],
        )


@user_router.put("/users/me", tags=["users"])
async def update_current_user(
    request: Request, update_data: UserUpdateRequest, db: Session = Depends(get_db)
):
    try:
        email = request.app.state.user
        platform = request.app.state.platform

        # Log the update request
        logger.info(f"Updating user profile for {email} on platform {platform}")

        # Get the user based on platform
        if platform == Platform.careerforge:
            user = user_careerforge_crud.get_by_field(db=db, field="email", value=email)
            if not user:
                logger.error(f"CareerForge user not found for email: {email}")
                raise ResourceNotFound(error_messages.USER_NOT_FOUND)

            # Update user data with platform validation
            updated_user = user_service.update_user_data(db=db, user=user, update_data=update_data)

            # Construct CareerForge-specific response
            response = {
                "message": "Profile updated successfully",
                "data": jsonable_encoder(
                    UserCareerForgeResponse(
                        id=updated_user.base_user.id,
                        provider=updated_user.base_user.provider,
                        provider_id=updated_user.base_user.provider_id,
                        platform=updated_user.base_user.platform,
                        account_tier=updated_user.base_user.account_tier,
                        careerforge_profile=UserCareerForgeProfile(
                            **jsonable_encoder(updated_user)
                        ),
                    )
                ),
            }
        else:
            user = user_talenthub_crud.get_by_field(db=db, field="email", value=email)
            if not user:
                logger.error(f"TalentHub user not found for email: {email}")
                raise ResourceNotFound(error_messages.USER_NOT_FOUND)

            # Update user data with platform validation
            updated_user = user_service.update_user_data(db=db, user=user, update_data=update_data)

            # Construct TalentHub-specific response
            response = {
                "message": "Profile updated successfully",
                "data": jsonable_encoder(
                    UserTalentHubResponse(
                        id=updated_user.base_user.id,
                        provider=updated_user.base_user.provider,
                        provider_id=updated_user.base_user.provider_id,
                        platform=updated_user.base_user.platform,
                        account_tier=updated_user.base_user.account_tier,
                        talenthub_profile=UserTalentHubProfile(**jsonable_encoder(updated_user)),
                    )
                ),
            }

        logger.info(f"Successfully updated profile for user {email}")
        return JSONResponse(
            content=response,
            status_code=status.HTTP_200_OK,
        )

    except ResourceNotFound as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except PlatformException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error updating user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages.INTERNAL_SERVER_ERROR,
        )


@user_router.get("/users/{user_id}", response_model=PublicUserResponse, tags=["users"])
async def get_public_profile(user_id: UUID4, db: Session = Depends(get_db)):
    try:
        user = user_service.get_user_by_id(db=db, user_id=user_id)
        if user.platform == Platform.careerforge and user.careerforge_profile:
            profile = user.careerforge_profile
        elif user.platform == Platform.talenthub and user.talenthub_profile:
            profile = user.talenthub_profile
        else:
            raise ResourceNotFound("User profile not found")

        return PublicUserResponse(
            email=profile.email,
            first_name=profile.first_name,
            last_name=profile.last_name,
            city=getattr(profile, "city", None),
            state=getattr(profile, "state", None),
            country=getattr(profile, "country", None),
            linkedin_url=getattr(profile, "linkedin_url", None),
            instagram_url=getattr(profile, "instagram_url", None),
            facebook_url=getattr(profile, "facebook_url", None),
            x_twitter_url=getattr(profile, "x_twitter_url", None),
            personal_website_url=getattr(profile, "personal_website_url", None),
            skills=getattr(profile, "skills", None),
            career_summary=getattr(profile, "career_summary", None),
            profile_picture_url=profile.profile_picture_url,
            current_career=getattr(profile, "current_career", None),
            background_image_url=getattr(profile, "background_image_url", None),
        )
    except ResourceNotFound as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@careerforge_router.post("/experiences", operation_id="careerforge_create_experience")
async def create_experience(
    experience: ExperienceCreate,
    db: Session = Depends(get_db),
    user: UserCareerForge = Depends(get_active_careerforge_user),
):
    try:
        logger.info(f"Creating new experience for user {user.id}")
        result = user_service.add_experience(db=db, user=user, experience_data=experience)
        return JSONResponse(
            content={
                "message": "Experience created successfully",
                "data": jsonable_encoder(ExperienceResponse(**jsonable_encoder(result))),
            },
            status_code=status.HTTP_201_CREATED,
        )
    except DatabaseException as e:
        logger.error(f"Database error creating experience: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Error creating experience: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages["internal_server_error"],
        )


@careerforge_router.get("/experiences", operation_id="careerforge_get_experiences")
async def get_experiences(
    db: Session = Depends(get_db), user: UserCareerForge = Depends(get_active_careerforge_user)
):
    try:
        logger.info(f"Fetching experiences for user {user.id}")
        experiences = user_service.get_user_experiences(db=db, user=user)
        return JSONResponse(
            content={
                "message": "Experiences retrieved successfully",
                "data": [
                    jsonable_encoder(ExperienceResponse(**jsonable_encoder(exp)))
                    for exp in experiences
                ],
            },
            status_code=status.HTTP_200_OK,
        )
    except DatabaseException as e:
        logger.error(f"Database error fetching experiences: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Error fetching experiences: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages["internal_server_error"],
        )


@careerforge_router.put("/experiences/{experience_id}")
async def update_experience(
    experience_id: UUID4,
    update_data: ExperienceUpdate,
    db: Session = Depends(get_db),
    user: UserCareerForge = Depends(get_active_careerforge_user),
):
    try:
        logger.info(f"Updating experience {experience_id} for user {user.id}")
        result = user_service.update_experience(
            db=db, user=user, exp_id=experience_id, update_data=update_data
        )
        return JSONResponse(
            content={
                "message": "Experience updated successfully",
                "data": jsonable_encoder(ExperienceResponse(**jsonable_encoder(result))),
            },
            status_code=status.HTTP_200_OK,
        )
    except ResourceNotFound as e:
        logger.error(f"Experience not found: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except (PlatformException, DatabaseException) as e:
        logger.error(f"Error updating experience: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error updating experience: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages["internal_server_error"],
        )


@careerforge_router.delete("/experiences/{experience_id}")
async def delete_experience(
    experience_id: UUID4,
    db: Session = Depends(get_db),
    user: UserCareerForge = Depends(get_active_careerforge_user),
):
    try:
        logger.info(f"Deleting experience {experience_id} for user {user.id}")
        user_service.delete_experience(db=db, user=user, exp_id=experience_id)
        return JSONResponse(
            content={"message": "Experience deleted successfully"}, status_code=status.HTTP_200_OK
        )
    except ResourceNotFound as e:
        logger.error(f"Experience not found: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except (PlatformException, DatabaseException) as e:
        logger.error(f"Error deleting experience: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error deleting experience: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages["internal_server_error"],
        )


@careerforge_router.post("/milestones")
async def create_milestone(
    milestone: MilestoneCreate,
    db: Session = Depends(get_db),
    user: UserCareerForge = Depends(get_active_careerforge_user),
):
    try:
        logger.info(f"Creating new milestone for user {user.id}")
        result = user_service.add_milestone(db=db, user=user, milestone_data=milestone)
        return JSONResponse(
            content={
                "message": "Milestone created successfully",
                "data": jsonable_encoder(MilestoneResponse(**jsonable_encoder(result))),
            },
            status_code=status.HTTP_201_CREATED,
        )
    except DatabaseException as e:
        logger.error(f"Database error creating milestone: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Error creating milestone: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages["internal_server_error"],
        )


@careerforge_router.get("/milestones")
async def get_milestones(
    db: Session = Depends(get_db), user: UserCareerForge = Depends(get_active_careerforge_user)
):
    try:
        logger.info(f"Fetching milestones for user {user.id}")
        milestones = user_service.get_user_milestones(db=db, user=user)
        return JSONResponse(
            content={
                "message": "Milestones retrieved successfully",
                "data": [
                    jsonable_encoder(MilestoneResponse(**jsonable_encoder(m))) for m in milestones
                ],
            },
            status_code=status.HTTP_200_OK,
        )
    except DatabaseException as e:
        logger.error(f"Database error fetching milestones: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Error fetching milestones: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages["internal_server_error"],
        )


@careerforge_router.put("/milestones/{milestone_id}")
async def update_milestone(
    milestone_id: UUID4,
    update_data: MilestoneUpdate,
    db: Session = Depends(get_db),
    user: UserCareerForge = Depends(get_active_careerforge_user),
):
    """Update specific milestone"""
    try:
        logger.info(f"Updating milestone {milestone_id} for user {user.id}")
        result = user_service.update_milestone(
            db=db, user=user, milestone_id=milestone_id, update_data=update_data
        )
        return JSONResponse(
            content={
                "message": "Milestone updated successfully",
                "data": jsonable_encoder(MilestoneResponse(**jsonable_encoder(result))),
            },
            status_code=status.HTTP_200_OK,
        )
    except ResourceNotFound as e:
        logger.error(f"Milestone not found: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except (PlatformException, DatabaseException) as e:
        logger.error(f"Error updating milestone: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error updating milestone: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages["internal_server_error"],
        )


@careerforge_router.delete("/milestones/{milestone_id}")
async def delete_milestone(
    milestone_id: UUID4,
    db: Session = Depends(get_db),
    user: UserCareerForge = Depends(get_active_careerforge_user),
):
    try:
        logger.info(f"Deleting milestone {milestone_id} for user {user.id}")
        user_service.delete_milestone(db=db, user=user, milestone_id=milestone_id)
        return JSONResponse(
            content={"message": "Milestone deleted successfully"}, status_code=status.HTTP_200_OK
        )
    except ResourceNotFound as e:
        logger.error(f"Milestone not found: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except (PlatformException, DatabaseException) as e:
        logger.error(f"Error deleting milestone: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error deleting milestone: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_messages["internal_server_error"],
        )


user_router.include_router(careerforge_router)
user_router.include_router(talenthub_router)
