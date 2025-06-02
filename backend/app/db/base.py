# Import all the models here to ensure SQLAlchemy knows about them
from app.db.base_class import Base  # noqa
from app.models.cover_letters import CoverLetters  # noqa
from app.models.experience import Experience  # noqa
from app.models.job_application import JobApplication  # noqa
from app.models.milestone import Milestone  # noqa
from app.models.organization import Organization  # noqa
from app.models.portfolio import Portfolio  # noqa
from app.models.position import Position  # noqa
from app.models.user import BaseUser, UserCareerForge, UserTalentHub  # noqa
