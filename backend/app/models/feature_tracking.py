# import uuid

# from sqlalchemy import INTEGER, Column, ForeignKey
# from sqlalchemy.dialects.postgresql import UUID
# from sqlalchemy.orm import relationship

# from app.db.base_class import Base, Timestamp


# class FeatureTracking(Base, Timestamp):
#     __tablename__ = "feature_tracking"
#     __table_args__ = {"extend_existing": True}

#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     user_id = Column(UUID(as_uuid=True), ForeignKey("base_users.id"), nullable=False)
#     job_tracking_count = Column(INTEGER, default=0)
#     coverletter_credits = Column(INTEGER, default=200)
