from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.db.session import get_db
from app.models.core.user import UserTalentHub
from app.services.talenthub.organization import organization_service
from app.services.user import get_active_user, get_talent_hub_user
from app.schemas.organization import (
    OrganizationCreate,
    OrganizationResponse,
    PositionCreate,
    PositionResponse,
    PositionUpdate
)

organization_router = APIRouter(tags=["talenthub"])

# Organization Management
@organization_router.post("/organizations", response_model=OrganizationResponse)
async def create_organization(
    org_data: OrganizationCreate,
    db: Session = Depends(get_db),
    current_user: UserTalentHub = Depends(get_talent_hub_user)
):
    """Create a new organization"""
    result = organization_service.create_organization(db, current_user, org_data)
    return OrganizationResponse.from_orm(result)

@organization_router.get("/organizations/{org_id}", response_model=OrganizationResponse)
async def get_organization(
    org_id: UUID,
    db: Session = Depends(get_db),
    current_user: UserTalentHub = Depends(get_talent_hub_user)
):
    """Get organization details"""
    result = organization_service.get_organization(db, org_id)
    return OrganizationResponse.from_orm(result)

# Position Management
@organization_router.post("/organizations/{org_id}/positions", response_model=PositionResponse)
async def create_position(
    org_id: UUID,
    position: PositionCreate,
    db: Session = Depends(get_db),
    current_user: UserTalentHub = Depends(get_talent_hub_user)
):
    """Create a new position"""
    result = organization_service.create_position(db, current_user, org_id, position)
    return PositionResponse.from_orm(result)

@organization_router.get("/organizations/{org_id}/positions", response_model=List[PositionResponse])
async def get_positions(
    org_id: UUID,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: UserTalentHub = Depends(get_talent_hub_user)
):
    """Get organization's positions"""
    positions = organization_service.get_positions(
        db, org_id, status, skip, limit
    )
    return [PositionResponse.from_orm(pos) for pos in positions]
