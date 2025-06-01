from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session

from app.db.crud import CRUDBase
from app.models.careerforge.career import JobApplication, Experience, Portfolio, Milestone
from app.models.core.user import UserCareerForge
from app.schemas.career import ApplicationCreate, ExperienceCreate, PortfolioCreate, MilestoneCreate
from app.utils.exceptions import DatabaseException, ResourceNotFound

class CareerService:
    def __init__(self):
        self.application_crud = CRUDBase(model=JobApplication)
        self.experience_crud = CRUDBase(model=Experience)
        self.portfolio_crud = CRUDBase(model=Portfolio)
        self.milestone_crud = CRUDBase(model=Milestone)

    def apply_for_job(
        self, 
        db: Session, 
        user: UserCareerForge, 
        application_data: ApplicationCreate
    ) -> JobApplication:
        try:
            application_dict = application_data.dict()
            application_dict["user_id"] = user.id
            application = self.application_crud.create(db=db, obj_in=application_dict)
            return application
        except Exception as e:
            raise DatabaseException(f"Failed to create job application: {str(e)}")

    def get_job_applications(
        self, 
        db: Session, 
        user: UserCareerForge,
        status: Optional[str] = None,
        skip: int = 0, 
        limit: int = 100
    ) -> List[JobApplication]:
        try:
            filters = {"user_id": user.id}
            if status:
                filters["status"] = status
            
            applications = self.application_crud.get_multi_by_filters(
                db=db,
                filters=filters,
                offset=skip,
                limit=limit
            )
            return applications
        except Exception as e:
            raise DatabaseException(f"Failed to fetch applications: {str(e)}")

    def add_experience(
        self, 
        db: Session, 
        user: UserCareerForge, 
        experience_data: ExperienceCreate
    ) -> Experience:
        try:
            experience_dict = experience_data.dict()
            experience_dict["user_id"] = user.id
            experience = self.experience_crud.create(db=db, obj_in=experience_dict)
            return experience
        except Exception as e:
            raise DatabaseException(f"Failed to add experience: {str(e)}")

    def add_portfolio_project(
        self, 
        db: Session, 
        user: UserCareerForge, 
        portfolio_data: PortfolioCreate
    ) -> Portfolio:
        try:
            portfolio_dict = portfolio_data.dict()
            portfolio_dict["user_id"] = user.id
            portfolio = self.portfolio_crud.create(db=db, obj_in=portfolio_dict)
            return portfolio
        except Exception as e:
            raise DatabaseException(f"Failed to add portfolio project: {str(e)}")

    def add_milestone(
        self, 
        db: Session, 
        user: UserCareerForge, 
        milestone_data: MilestoneCreate
    ) -> Milestone:
        try:
            milestone_dict = milestone_data.dict()
            milestone_dict["user_id"] = user.id
            milestone = self.milestone_crud.create(db=db, obj_in=milestone_dict)
            return milestone
        except Exception as e:
            raise DatabaseException(f"Failed to add milestone: {str(e)}")

career_service = CareerService()
