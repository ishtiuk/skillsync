from datetime import datetime
from typing import Dict, Optional

from pydantic import UUID4, BaseModel, model_validator

from app.schemas.job_role import JobRoleResponse
from core.constants import constants


class JobApplicationBase(BaseModel):
    position_id: UUID4
    activity: Optional[str] = None
    reaction: Optional[str] = None
    notes: Optional[str] = None
    stage: Dict[str, bool]
    is_favourite: bool = False

    def _validate_base_stages(self, stages: Dict[str, bool]) -> None:
        base_stages = constants.BASE_JOB_STAGES.keys()
        for stage in base_stages:
            if stage not in stages:
                raise ValueError(f"Missing required stage: {stage}")

    def _validate_stage_sequence(self, stages: Dict[str, bool], interview_stages: list) -> None:
        if stages.get("interview-1", False) and not stages.get("applied", False):
            raise ValueError("Cannot be in Interview stage without being Applied")

        if stages.get("offer", False):
            if not any(stages.get(s, False) for s in interview_stages):
                raise ValueError("Cannot have an Offer without any Interview")

        if stages.get("hired", False) and not stages.get("offer", False):
            raise ValueError("Cannot be Hired without an Offer")

        if stages.get("past-roles", False):
            if not (stages.get("hired", False) or stages.get("ineligible", False)):
                raise ValueError("Past Roles requires either Hired or Ineligible status")

    def _validate_interview_sequence(self, stages: Dict[str, bool]) -> None:
        interview_stages = sorted(
            [k for k in stages.keys() if k.startswith("interview-")],
            key=lambda x: int(x.split("-")[1]) if x.split("-")[1].isdigit() else float("inf"),
        )

        for idx, stage in enumerate(interview_stages[:-1]):
            current = stages.get(stage, False)
            next_stage = stages.get(interview_stages[idx + 1], False)
            if next_stage and not current:
                raise ValueError(
                    f"Invalid interview sequence: {stage} must be True if later stages are True"
                )

    @model_validator(mode="after")
    def validate_model(self):
        stages = self.stage
        interview_stages = sorted(
            [k for k in stages.keys() if k.startswith("interview-")],
            key=lambda x: int(x.split("-")[1]) if x.split("-")[1].isdigit() else float("inf"),
        )

        self._validate_base_stages(stages)
        self._validate_stage_sequence(stages, interview_stages)
        self._validate_interview_sequence(stages)
        return self


class JobApplicationCreate(JobApplicationBase):
    pass


class JobApplicationUpdate(BaseModel):
    activity: Optional[str] = None
    reaction: Optional[str] = None
    notes: Optional[str] = None
    stage: Optional[Dict[str, bool]] = None
    is_favourite: Optional[bool] = None

    def _validate_interview_existence(
        self, stages: Dict[str, bool], interview_stages: list
    ) -> None:
        if not interview_stages:
            return

        higher_interview_stages = [stage for stage in interview_stages if stage != "interview-1"]

        # Prevent higher interview stages when not applied
        if higher_interview_stages and not stages.get("applied", False):
            raise ValueError(
                "Cannot have interview stages beyond interview-1 when Applied is False"
            )

    def _validate_interview_statuses(self, stages: Dict[str, bool], interview_stages: list) -> None:
        for current_stage in interview_stages:
            if current_stage == "interview-1":
                continue

            if stages.get(current_stage, False):
                if not stages.get("applied", False):
                    raise ValueError(f"Cannot set {current_stage} to True when Applied is False")

                stage_num = int(current_stage.split("-")[1])
                for prev_num in range(1, stage_num):
                    prev_stage = f"interview-{prev_num}"
                    if not stages.get(prev_stage, False):
                        raise ValueError(
                            f"Cannot set {current_stage} to True when {prev_stage} is False. "
                            "Interview stages must be completed in sequence."
                        )

    def _validate_final_stages(self, stages: Dict[str, bool], interview_stages: list) -> None:
        if stages.get("offer", False) and not any(stages.get(s, False) for s in interview_stages):
            raise ValueError("Cannot have an Offer without any Interview")

        if stages.get("hired", False) and not stages.get("offer", False):
            raise ValueError("Cannot be Hired without an Offer")

        if stages.get("past-roles", False):
            if not (stages.get("hired", False) or stages.get("ineligible", False)):
                raise ValueError("Past Roles requires either Hired or Ineligible status")

    @model_validator(mode="after")
    def validate_stages(self):
        if not self.stage:
            return self

        stages = self.stage
        interview_stages = sorted(
            [k for k in stages.keys() if k.startswith("interview-")],
            key=lambda x: int(x.split("-")[1]) if x.split("-")[1].isdigit() else float("inf"),
        )

        self._validate_interview_existence(stages, interview_stages)
        self._validate_interview_statuses(stages, interview_stages)
        self._validate_final_stages(stages, interview_stages)

        return self


class JobApplicationResponse(JobApplicationBase):
    id: UUID4
    user_id: UUID4
    created_at: datetime
    updated_at: datetime
    job_info: JobRoleResponse

    class Config:
        from_attributes = True
