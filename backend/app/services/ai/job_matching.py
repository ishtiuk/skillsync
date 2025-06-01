from typing import List, Dict
import numpy as np
from sqlalchemy.orm import Session

from app.models.talenthub.organization import Position
from app.models.core.user import UserCareerForge
from app.utils.exceptions import AIServiceException

class JobMatchingService:
    def __init__(self):
        self.similarity_threshold = 0.7

    def calculate_similarity(self, vec1: np.ndarray, vec2: np.ndarray) -> float:
        """Calculate cosine similarity between two vectors"""
        return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

    def match_jobs(
        self, 
        db: Session, 
        user: UserCareerForge, 
        positions: List[Position]
    ) -> List[Dict]:
        """Match user profile with job positions"""
        try:
            if not user.skill_vector:
                raise AIServiceException("User skill vector not available")

            user_vector = np.array(user.skill_vector)
            matches = []

            for position in positions:
                # Calculate required skills match
                required_skills_vector = position.required_skills_vector
                if required_skills_vector:
                    skill_similarity = self.calculate_similarity(
                        user_vector, 
                        np.array(required_skills_vector)
                    )
                else:
                    continue

                if skill_similarity >= self.similarity_threshold:
                    matches.append({
                        "position": position,
                        "match_score": float(skill_similarity),
                        "matching_skills": [],  # Add skill matching logic
                        "missing_skills": []    # Add skill gap analysis
                    })

            # Sort matches by score
            matches.sort(key=lambda x: x["match_score"], reverse=True)
            return matches

        except Exception as e:
            raise AIServiceException(f"Job matching failed: {str(e)}")

    def get_skill_recommendations(
        self, 
        user: UserCareerForge, 
        target_position: Position
    ) -> List[str]:
        """Get skill recommendations for a target position"""
        try:
            current_skills = set(user.skills or [])
            required_skills = set(target_position.required_skills or [])
            preferred_skills = set(target_position.preferred_skills or [])

            # Skills user needs to acquire
            missing_required = required_skills - current_skills
            missing_preferred = preferred_skills - current_skills

            recommendations = {
                "required_skills": list(missing_required),
                "preferred_skills": list(missing_preferred),
                "priority": "high" if missing_required else "medium"
            }

            return recommendations

        except Exception as e:
            raise AIServiceException(f"Skill recommendation failed: {str(e)}")

job_matching_service = JobMatchingService()
