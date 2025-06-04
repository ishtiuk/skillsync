import json

from openai import OpenAI
from pydantic import UUID4, ValidationError
from sqlalchemy.orm import Session

from app.db.crud import CRUDBase
from app.models.job_experience import JobExperiences
from app.models.job_role import JobRoles
from app.models.user import Users
from app.schemas.cover_letter import CoverLetterRequest, CoverLetterResponse
from core.config import settings
from core.logger import logger

job_role_crud = CRUDBase(model=JobRoles)
job_experience_crud = CRUDBase(model=JobExperiences)


class CoverLetterService:
    def __init__(self, openai_client: OpenAI):
        self.openai = openai_client

    def get_cover_letter(
        self, cover_letter_request: CoverLetterRequest, db: Session, user: Users
    ) -> CoverLetterResponse:
        job_role = job_role_crud.get_by_field(
            db=db, field="id", value=cover_letter_request.job_role_id
        )
        if not job_role:
            raise ValueError("Job role not found")

        user_job_experience = self._format_job_experience(db=db, user_id=user.id)
        user_info = self._format_user_info(user=user)
        job_description = self._build_job_description(job_role)

        messages = self._build_prompt_messages(
            job_title=job_role.title,
            job_description=job_description,
            props=cover_letter_request.props,
            user_job_experience=user_job_experience,
            user_info=user_info,
        )

        response = self.openai.chat.completions.create(model="gpt-4o-2024-08-06", messages=messages)

        raw_data = response.choices[0].message.content
        logger.info(f"Raw response from OpenAI: {raw_data[7:-3]}")

        try:
            return CoverLetterResponse.model_validate_json(raw_data[7:-3])
        except ValidationError:
            logger.error("Validation failed for OpenAI cover letter response", exc_info=True)
            raise

    def _format_job_experience(self, db: Session, user_id: UUID4) -> str:
        job_experiences = job_experience_crud.get_multi_by_field(
            db=db, field="user_id", value=user_id
        )
        formatted_experiences = [
            f"{job.position_title} at {job.company_name} ({job.start_month}/{job.start_year} - {'Present' if job.is_current else f'{job.end_month}/{job.end_year}'})"
            for job in job_experiences
        ]
        return (
            "\n".join(formatted_experiences)
            if formatted_experiences
            else "No relevant experience found."
        )

    def _format_user_info(self, user: Users) -> str:
        return (
            f"Name: {user.first_name} {user.last_name}\n"
            f"Email: {user.email}\n"
            f"Interests: {user.interests or 'N/A'}\n"
            f"Career Summary: {user.career_summary or 'N/A'}\n"
            f"Current Career: {user.current_career or 'N/A'}\n"
            f"Current Job Title: {user.current_job_title or 'N/A'}\n"
            f"Location: {user.city}, {user.state}, {user.country}\n"
        )

    def _build_job_description(self, job: JobRoles) -> str:
        description_parts = [
            f"Title: {job.title}",
            f"Category: {job.job_category}",
            f"Position Type: {job.position_type}",
            f"Experience Level: {job.level_of_experience}",
            f"Location: {job.city}, {job.state}, {job.country}",
            f"Role Description: {job.role_description or ''}",
            f"Primary Responsibilities: {job.primary_responsibilities or ''}",
            f"Required Qualifications: {job.required_qualifications or ''}",
            f"Desired Qualifications: {job.desired_qualifications or ''}",
            f"Compensation & Benefits: {job.compensation_benefits or ''}",
        ]
        return "\n".join(part for part in description_parts if part.strip())

    def _build_prompt_messages(
        self,
        job_title: str,
        job_description: str,
        props: dict,
        user_job_experience: str,
        user_info: str,
    ) -> list[dict]:
        # Section 1: System Instructions
        instructions = (
            "You are a helpful assistant that writes structured and professional cover letters "
            "based on a job title, its description, and user-provided preferences (called 'props'). These props are the dictation of the user's preferences for the cover letter where the keys are the properties and the values are the scores from 0 to 1. "
            "Also consider the user's job experience and personal information if mentioned in the job description. "
        )

        # Section 2: Output Format Guidance
        response_format = (
            "Your response must be a JSON object with one property:\n\n"
            '"paragraphs" — a paragraph with html formatting and with MANDATORY line breaks(<br/> tags) after each closing paragraph(</p> tags) which is the cover letter, '
        )

        # Section 3: Inputs
        job_info = f"Job Title:\n{job_title}\n\nJob Description:\n{job_description}"
        user_props = f"User Props (scoring guide):\n{json.dumps(props, indent=2)}"
        user_job_experience = f"User Job Experience:\n{user_job_experience}"
        user_info = f"User Info:\n{user_info}"

        logger.info(f"User props: {user_props}")

        # Combine all parts into one prompt message
        full_prompt = "\n\n".join(
            [instructions, response_format, job_info, user_props, user_job_experience, user_info]
        )

        return [{"role": "user", "content": full_prompt}]


client = OpenAI(api_key=settings.OPENAI_API_KEY)
cover_letter_service = CoverLetterService(client)
