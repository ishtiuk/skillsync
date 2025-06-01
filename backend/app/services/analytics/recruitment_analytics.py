from typing import Dict, List
from datetime import datetime, timedelta
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.talenthub.organization import Position
from app.models.core.user import UserTalentHub
from app.models.careerforge.career import JobApplication
from app.utils.exceptions import AnalyticsException

class RecruitmentAnalyticsService:
    def get_pipeline_metrics(
        self, 
        db: Session, 
        user: UserTalentHub,
        time_range: str = "all"
    ) -> Dict:
        """Get recruitment pipeline metrics"""
        try:
            # Get base query for positions
            positions_query = (
                db.query(Position)
                .filter(Position.recruiter_id == user.id)
            )

            # Get base query for applications
            applications_query = (
                db.query(JobApplication)
                .join(Position)
                .filter(Position.recruiter_id == user.id)
            )

            if time_range != "all":
                if time_range == "week":
                    date_filter = datetime.utcnow() - timedelta(days=7)
                elif time_range == "month":
                    date_filter = datetime.utcnow() - timedelta(days=30)
                elif time_range == "year":
                    date_filter = datetime.utcnow() - timedelta(days=365)
                
                positions_query = positions_query.filter(Position.created_at >= date_filter)
                applications_query = applications_query.filter(JobApplication.created_at >= date_filter)

            # Get metrics
            total_positions = positions_query.count()
            total_applications = applications_query.count()
            
            # Get application status breakdown
            status_counts = (
                applications_query
                .with_entities(
                    JobApplication.status,
                    func.count(JobApplication.id)
                )
                .group_by(JobApplication.status)
                .all()
            )

            return {
                "total_positions": total_positions,
                "total_applications": total_applications,
                "applications_per_position": total_applications / total_positions if total_positions > 0 else 0,
                "status_breakdown": dict(status_counts),
                "time_range": time_range
            }

        except Exception as e:
            raise AnalyticsException(f"Failed to get pipeline metrics: {str(e)}")

    def get_hiring_efficiency(
        self, 
        db: Session, 
        user: UserTalentHub,
        time_range: str = "all"
    ) -> Dict:
        """Calculate hiring efficiency metrics"""
        try:
            # Base queries
            positions_query = db.query(Position).filter(Position.recruiter_id == user.id)
            applications_query = (
                db.query(JobApplication)
                .join(Position)
                .filter(Position.recruiter_id == user.id)
            )

            # Apply time filter
            if time_range != "all":
                if time_range == "month":
                    date_filter = datetime.utcnow() - timedelta(days=30)
                elif time_range == "quarter":
                    date_filter = datetime.utcnow() - timedelta(days=90)
                elif time_range == "year":
                    date_filter = datetime.utcnow() - timedelta(days=365)
                
                positions_query = positions_query.filter(Position.created_at >= date_filter)
                applications_query = applications_query.filter(JobApplication.created_at >= date_filter)

            # Calculate metrics
            total_positions = positions_query.count()
            total_applications = applications_query.count()
            hired_count = applications_query.filter(JobApplication.status == "hired").count()

            return {
                "conversion_rate": hired_count / total_applications if total_applications > 0 else 0,
                "time_to_hire": 0,  # Add time to hire calculation
                "cost_per_hire": 0,  # Add cost calculation
                "positions_filled": hired_count,
                "positions_open": total_positions - hired_count,
                "time_range": time_range
            }

        except Exception as e:
            raise AnalyticsException(f"Failed to get hiring efficiency metrics: {str(e)}")

recruitment_analytics_service = RecruitmentAnalyticsService()
