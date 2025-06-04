import uuid

from sqlalchemy import INTEGER, Boolean, Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base, Timestamp


class Payments(Base, Timestamp):
    __tablename__ = "payments"
    __table_args__ = {"extend_existing": True}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("base_users.id"), nullable=False)
    stripe_customer_id = Column(String)
    stripe_subscription_id = Column(String, nullable=True)
    stripe_payment_intent_id = Column(String)
    plan_type = Column(String(32))  # 'Basic', 'Plus'
    billing_cycle = Column(String(32))  # 'Monthly', 'Yearly'
    amount = Column(INTEGER)
    currency = Column(String(8))  # e.g., 'USD' 'BDT'
    next_billing_date = Column(DateTime(timezone=True))
    receipt_url = Column(String(512))
    is_active = Column(Boolean, default=True)
    subscription_end_date = Column(DateTime(timezone=True))

