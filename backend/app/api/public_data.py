# from fastapi import APIRouter, Depends, HTTPException, status
# from fastapi.encoders import jsonable_encoder
# from fastapi.responses import JSONResponse
# from pydantic import UUID4
# from sqlalchemy.orm import Session

# from app.db.crud import CRUDBase
# from app.db.session import get_db
# from app.models.experience import Experience
# from app.models.user import UserFiles, Users
# from app.services.s3_services import s3_services
# from core.config import settings
# from core.constants import constants

# public_data_router = APIRouter()

# user_crud = CRUDBase(model=Users)
# user_files_crud = CRUDBase(model=UserFiles)
# exp_crud = CRUDBase(model=Experience)

# genders = [
#     "Male",
#     "Female",
#     "Non-binary",
#     "Genderfluid",
#     "Agender",
#     "Bigender",
#     "Two-Spirit",
#     "Transgender",
#     "Cisgender",
#     "Genderqueer",
# ]

# ethnicities = [
#     "Hispanic or Latino",
#     "White",
#     "Black or African American",
#     "Asian",
#     "Native American or Alaska Native",
#     "Native Hawaiian or Other Pacific Islander",
#     "Middle Eastern or North African",
#     "Multiracial",
#     "Other",
# ]

# public_profile_columns = [
#     "first_name",
#     "last_name",
#     "city",
#     "state",
#     "country",
#     "linkedin_url",
#     "x_twitter_url",
#     "github_url",
#     "career_summary",
#     "personal_website_url",
#     "current_job_title",
#     "skills",
#     "profile_picture_url",
#     "current_career",
# ]

# public_job_exp_columns = [
#     "organization_name",
#     "start_year",
#     "end_year",
#     "position_title",
#     "logo_url",
#     "employment_type",
# ]

# public_user_files_columns = [
#     "file_name",
#     "file_url",
#     "file_type",
# ]


# @public_data_router.get("/public-data", response_model=dict)
# async def get_public_data():
#     try:
#         data = {"genders": genders, "ethnicities": ethnicities}
#         return JSONResponse(content=jsonable_encoder(data), status_code=status.HTTP_200_OK)
#     except Exception as e:
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# @public_data_router.get("/user/public/{id}", response_model=dict)
# async def get_public_user(id: UUID4, db: Session = Depends(get_db)):
#     try:
#         user = user_crud.get_by_field(db=db, field="id", value=id, columns=public_profile_columns)

#         job_exps = exp_crud.get_multi_by_field(
#             db=db, field="user_id", value=id, columns=public_job_exp_columns
#         )

#         user_files = user_files_crud.get_multi_by_field(
#             db=db, field="user_id", value=id, columns=public_user_files_columns
#         )

#         if user["profile_picture_url"] is not None:
#             image_extension = user["profile_picture_url"][-1]

#             profile_image_download_url = s3_services.generate_presigned_url(
#                 operation="get_object",
#                 bucket_name=settings.AWS_S3_BUCKET,
#                 object_key=user["profile_picture_url"],
#                 content_type="image/" + image_extension,
#                 expiration=constants.PRESIGNED_URL_EXPIRATION,
#             )

#             user["profile_picture_url"] = profile_image_download_url

#         for file in user_files:
#             file["file_url"] = s3_services.generate_presigned_url(
#                 operation="get_object",
#                 object_key=file["file_url"],
#                 bucket_name=settings.AWS_S3_BUCKET,
#                 content_type="application/" + file["file_type"],
#                 expiration=constants.PRESIGNED_URL_EXPIRATION,
#             )

#         user["files"] = user_files
#         user["job_experiences"] = job_exps

#         return JSONResponse(content=jsonable_encoder(user), status_code=status.HTTP_200_OK)

#     except Exception as e:
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
