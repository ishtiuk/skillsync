from typing import Dict, List
import spacy
from sentence_transformers import SentenceTransformer
import numpy as np
from sqlalchemy.orm import Session

from app.models.careerforge.career import Experience
from app.utils.exceptions import AIServiceException

class ResumeAnalysisService:
    def __init__(self):
        # Load NLP models
        try:
            self.nlp = spacy.load("en_core_web_lg")
            self.sentence_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
        except Exception as e:
            raise AIServiceException(f"Failed to load NLP models: {str(e)}")

    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from text using NLP"""
        doc = self.nlp(text)
        # Use NER and pattern matching to identify skills
        skills = []
        # Add skill extraction logic here
        return skills

    def generate_skill_vector(self, skills: List[str]) -> np.ndarray:
        """Generate skill embedding vector"""
        if not skills:
            return np.zeros(384)  # Default vector size for MiniLM
        
        # Generate embeddings for skills
        skill_embeddings = self.sentence_model.encode(skills)
        # Average the embeddings
        return np.mean(skill_embeddings, axis=0)

    def parse_resume(self, text: str) -> Dict:
        """Parse resume text and extract structured information"""
        try:
            doc = self.nlp(text)
            
            # Extract various components
            skills = self.extract_skills(text)
            skill_vector = self.generate_skill_vector(skills)
            
            return {
                "skills": skills,
                "skill_vector": skill_vector.tolist(),
                "extracted_text": text,
                # Add more extracted fields
            }
        except Exception as e:
            raise AIServiceException(f"Resume parsing failed: {str(e)}")

    def analyze_career_progression(self, experiences: List[Experience]) -> Dict:
        """Analyze career progression from experiences"""
        try:
            # Sort experiences by date
            sorted_exp = sorted(experiences, key=lambda x: x.start_date)
            
            # Analyze progression
            progression = {
                "total_years": 0,
                "role_progression": [],
                "skill_progression": [],
                "industry_changes": [],
            }
            
            return progression
        except Exception as e:
            raise AIServiceException(f"Career progression analysis failed: {str(e)}")

resume_analysis_service = ResumeAnalysisService()
