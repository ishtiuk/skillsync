from pydantic import BaseModel, Field


class PaginationParams(BaseModel):
    page: int = Field(default=0, ge=0, description="Page number, starting from 0")
    limit: int = Field(default=20, ge=1, le=5000, description="Number of items per page")
