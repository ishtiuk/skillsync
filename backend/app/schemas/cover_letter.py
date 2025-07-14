from typing import Dict

from pydantic import UUID4, BaseModel, Field


class CoverLetterRequest(BaseModel):
    position_id: UUID4
    props: Dict[str, float] = Field(
        ..., example={"politeness": 1, "conciseness": 0.8, "leadership": 0.5}
    )


class CoverLetterResponse(BaseModel):
    paragraphs: str
