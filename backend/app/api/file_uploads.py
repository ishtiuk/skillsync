# from typing import List

# from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
# from fastapi.encoders import jsonable_encoder
# from fastapi.responses import JSONResponse

# from app.db.crud import CRUDBase
# from app.db.session import get_db
# from app.models.user import UserFiles, Users
# from app.schemas.file_uploads import GetFilesResponse, S3DownloadPayload, S3UploadPayload
# from app.services.s3_services import s3_services
# from app.services.user import get_active_user
# from app.utils.exceptions import S3Exception
# from app.utils.image_utils import resize_image
# from core.config import settings
# from core.constants import constants, error_messages
# from core.logger import logger

# user_crud = CRUDBase(model=Users)
# user_files_crud = CRUDBase(model=UserFiles)


# file_router = APIRouter()


# @file_router.post("/upload/profile-picture", tags=["s3"])
# async def upload_profile_picture(
#     file: UploadFile = File(...), user=Depends(get_active_user), db=Depends(get_db)
# ):
#     try:
#         if not file.content_type.startswith("image/"):
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST, detail="File must be an image"
#             )

#         resized_image = await resize_image(file, max_size=800)

#         image_extension = "png"  # We're converting all images to png
#         object_key = f"{user.id}{constants.PROFILE_IMAGE_NAME}.{image_extension}"

#         s3_services.upload_file_content(
#             bucket_name=settings.AWS_S3_BUCKET,
#             object_key=object_key,
#             file_content=resized_image,
#             content_type="image/png",
#         )

#         user.profile_picture_url = object_key
#         user_crud.update(db=db, obj_in=user)

#         return JSONResponse(
#             status_code=status.HTTP_200_OK,
#             content={"message": "Profile picture uploaded successfully"},
#         )

#     except S3Exception as e:
#         raise HTTPException(status_code=e.status_code, detail=e.message)
#     except Exception as e:
#         logger.error(f"Error uploading profile picture: {str(e)}")
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# @file_router.post("/generate-download-url/user/profile", tags=["s3"])
# async def generate_profile_download_url(user: str = Depends(get_active_user)):
#     try:
#         image_extension = user.profile_picture_url[-1]
#         download_url = s3_services.generate_presigned_url(
#             bucket_name=settings.AWS_S3_BUCKET,
#             object_key=user.profile_picture_url,
#             content_type="image/" + image_extension,
#             operation="get_object",
#             expiration=constants.PRESIGNED_URL_EXPIRATION,
#         )
#         return JSONResponse(status_code=status.HTTP_200_OK, content={"download_url": download_url})
#     except S3Exception as e:
#         raise HTTPException(status_code=e.status_code, detail=e.message)
#     except HTTPException as e:
#         logger.error(e)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=error_messages.INTERNAL_SERVER_ERROR,
#         )


# @file_router.post("/generate-upload-url/user/files", tags=["s3"])
# async def generate_file_upload_url(
#     payload: S3UploadPayload, user=Depends(get_active_user), db=Depends(get_db)
# ):
#     try:
#         file_url = str(user.id) + "/" + payload.filename

#         logger.info(
#             f"Checking for existing file with user_id: {user.id} and filename: {payload.filename}"
#         )

#         existing_file = user_files_crud.get_by_multiple_fields(
#             db=db, fields={"user_id": user.id, "file_name": payload.filename}
#         )

#         logger.info(f"Existing file found: {existing_file is not None}")

#         upload_url = s3_services.generate_presigned_url(
#             bucket_name=settings.AWS_S3_BUCKET,
#             object_key=file_url,
#             content_type=payload.content_type,
#             operation="put_object",
#             expiration=constants.PRESIGNED_URL_EXPIRATION,
#         )

#         if existing_file:
#             logger.info(f"Updating existing file record for {payload.filename}")
#             existing_file.file_type = payload.content_type
#             existing_file.file_url = file_url
#             user_files_crud.update(db=db, obj_in=existing_file)
#         else:
#             logger.info(f"Creating new file record for {payload.filename}")
#             user_file = UserFiles(
#                 user_id=user.id,
#                 file_name=payload.filename,
#                 file_url=file_url,
#                 file_type=payload.content_type,
#             )
#             user_files_crud.create(db=db, obj_in=user_file)

#         return JSONResponse(status_code=status.HTTP_200_OK, content={"upload_url": upload_url})
#     except S3Exception as e:
#         raise HTTPException(status_code=e.status_code, detail=e.message)
#     except HTTPException:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=error_messages.INTERNAL_SERVER_ERROR,
#         )
#     except Exception as e:
#         logger.error(f"Unexpected error: {str(e)}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e),
#         )


# @file_router.post("/generate-download-url/user/files", tags=["s3"])
# async def generate_file_download_url(
#     payload: S3DownloadPayload, user: str = Depends(get_active_user)
# ):
#     try:
#         download_url = s3_services.generate_presigned_url(
#             bucket_name=settings.AWS_S3_BUCKET,
#             object_key=payload.object_key,
#             content_type=payload.content_type,
#             operation="get_object",
#             expiration=constants.PRESIGNED_URL_EXPIRATION,
#         )
#         return JSONResponse(status_code=status.HTTP_200_OK, content={"download_url": download_url})
#     except S3Exception as e:
#         raise HTTPException(status_code=e.status_code, detail=e.message)
#     except HTTPException as e:
#         logger.error(e)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=error_messages.INTERNAL_SERVER_ERROR,
#         )


# @file_router.get("/user/files", tags=["s3"], response_model=List[GetFilesResponse])
# async def get_user_files(user=Depends(get_active_user), db=Depends(get_db)):
#     try:
#         user_files = user_files_crud.get_multi_by_field(db=db, field="user_id", value=user.id)
#         response = []
#         for file in user_files:
#             response.append(
#                 jsonable_encoder(
#                     GetFilesResponse(
#                         file_name=file.file_name, file_url=file.file_url, file_type=file.file_type
#                     )
#                 )
#             )
#         return JSONResponse(status_code=status.HTTP_200_OK, content=response)
#     except HTTPException as e:
#         logger.error(e)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=error_messages.INTERNAL_SERVER_ERROR,
#         )


# @file_router.post("/generate-upload-url/company", tags=["s3"])
# async def generate_company_logo_upload_url(
#     payload: S3UploadPayload, user=Depends(get_active_user), db=Depends(get_db)
# ):
#     try:
#         upload_url = s3_services.generate_presigned_url(
#             operation="put_object",
#             object_key=payload.filename,
#             content_type=payload.content_type,
#             bucket_name=settings.AWS_S3_BUCKET,
#             expiration=constants.PRESIGNED_URL_EXPIRATION,
#         )
#         return JSONResponse(status_code=status.HTTP_200_OK, content={"upload_url": upload_url})
#     except S3Exception as e:
#         raise HTTPException(status_code=e.status_code, detail=e.message)
#     except HTTPException as e:
#         logger.error(e)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=error_messages.INTERNAL_SERVER_ERROR,
#         )


# @file_router.post("/generate-download-url/company", tags=["s3"])
# async def generate_company_logo_download_url(payload: S3DownloadPayload):
#     try:
#         download_url = s3_services.generate_presigned_url(
#             operation="get_object",
#             object_key=payload.filename,
#             content_type=payload.content_type,
#             bucket_name=settings.AWS_S3_BUCKET,
#             expiration=constants.PRESIGNED_URL_EXPIRATION,
#         )
#         return JSONResponse(status_code=status.HTTP_200_OK, content={"download_url": download_url})
#     except S3Exception as e:
#         raise HTTPException(status_code=e.status_code, detail=e.message)
#     except HTTPException as e:
#         logger.error(e)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=error_messages.INTERNAL_SERVER_ERROR,
#         )
