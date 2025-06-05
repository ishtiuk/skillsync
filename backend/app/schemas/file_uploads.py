from typing import Optional

from pydantic import BaseModel


class S3UploadPayload(BaseModel):
    filename: str
    content_type: Optional[str] = None

class S3DownloadPayload(BaseModel):
    object_key: str
    content_type: Optional[str] = None
    filename: Optional[str] = None

class GetFilesResponse(BaseModel):
    file_url: str
    file_name: str
    file_type: str
