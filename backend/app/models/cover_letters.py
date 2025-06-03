import uuid

from sqlalchemy import JSON, Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base, Timestamp


class CoverLetters(Base, Timestamp):
    __tablename__ = "cover_letters"
    __table_args__ = {"extend_existing": True}

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_careerforge.id"), nullable=False)
    generated_output = Column(String(4096), nullable=True)
    style = Column(String(128), nullable=True)
    tone = Column(JSON, nullable=True)
    topics = Column(JSON, nullable=True)

    user = relationship("UserCareerForge", backref="cover_letters")
