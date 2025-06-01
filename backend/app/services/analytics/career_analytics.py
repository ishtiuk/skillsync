from typing import Dict, List
from datetime import datetime, timedelta
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.careerforge.career import JobApplication, Experience, Milestone
from app.models.core.user import UserCareerForge
from app.utils.exceptions import AnalyticsException

class CareerAnalyticsService:
    def get_application_stats(
        self, 
        db: Session, 
        user: UserCareerForge,
        time_range: str = "all"
    ) -> Dict:
        """Get job application statistics"""
        try:
            query = db.query(JobApplication).filter(JobApplication.user_id == user.id)

            if time_range != "all":
                if time_range == "week":
                    date_filter = datetime.utcnow() - timedelta(days=7)
                elif time_range == "month":
                    date_filter = datetime.utcnow() - timedelta(days=30)
                elif time_range == "year":
                    date_filter = datetime.utcnow() - timedelta(days=365)
                
                query = query.filter(JobApplication.created_at >= date_filter)

            # Get application counts by status
            status_counts = (
                query.with_entities(
                    JobApplication.status, 
                    func.count(JobApplication.id)
                )
                .group_by(JobApplication.status)
                .all()
            )

            return {
                "total_applications": sum(count for _, count in status_counts),
                "status_breakdown": dict(status_counts),
                "time_range": time_range
            }

        except Exception as e:
            raise AnalyticsException(f"Failed to get application stats: {str(e)}")

    def get_career_growth(self, db: Session, user: UserCareerForge) -> Dict:
        """Analyze career growth metrics"""
        try:
            # Get experience progression
            experiences = (
                db.query(Experience)
                .filter(Experience.user_id == user.id)
                .order_by(Experience.start_date)
                .all()
            )

            # Get achievements and milestones
            milestones = (
                db.query(Milestone)
                .filter(Milestone.user_id == user.id)
                .order_by(Milestone.completed_at)
                .all()
            )

            return {
                "years_of_experience": len(experiences),
                "role_progression": [exp.position_title for exp in experiences],
                "achievement_count": len(milestones),
                "skill_growth": [],  # Add skill growth analysis
                "profile_strength": user.profile_strength
            }

        except Exception as e:
            raise AnalyticsException(f"Failed to get career growth metrics: {str(e)}")

career_analytics_service = CareerAnalyticsService()
