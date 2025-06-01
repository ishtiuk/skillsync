from typing import List, Optional
from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.db.crud import CRUDBase
from app.models.talenthub.organization import Organization, Position
from app.models.core.user import UserTalentHub
from app.schemas.organization import OrganizationCreate, OrganizationUpdate, PositionCreate, PositionUpdate
from app.utils.exceptions import DatabaseException, ResourceNotFound

class OrganizationService:
    def __init__(self):
        self.org_crud = CRUDBase(model=Organization)
        self.position_crud = CRUDBase(model=Position)

    def create_organization(
        self, 
        db: Session, 
        user: UserTalentHub, 
        org_data: OrganizationCreate
    ) -> Organization:
        try:
            org_dict = org_data.dict()
            org_dict["created_by"] = user.id
            org = self.org_crud.create(db=db, obj_in=org_dict)
            return org
        except Exception as e:
            raise DatabaseException(f"Failed to create organization: {str(e)}")

    def get_organization(
        self, 
        db: Session, 
        org_id: UUID
    ) -> Organization:
        org = self.org_crud.get(db=db, id=org_id)
        if not org:
            raise ResourceNotFound("Organization not found")
        return org

    def create_position(
        self, 
        db: Session, 
        user: UserTalentHub, 
        org_id: UUID, 
        position_data: PositionCreate
    ) -> Position:
        try:
            # Verify organization exists and user has access
            org = self.get_organization(db, org_id)
            if user.organization_id != org.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="User does not have access to this organization"
                )
            
            position_dict = position_data.dict()
            position_dict["organization_id"] = org_id
            position_dict["recruiter_id"] = user.id
            
            position = self.position_crud.create(db=db, obj_in=position_dict)
            return position
        except Exception as e:
            raise DatabaseException(f"Failed to create position: {str(e)}")

    def get_positions(
        self, 
        db: Session, 
        org_id: UUID, 
        status: Optional[str] = None,
        skip: int = 0, 
        limit: int = 100
    ) -> List[Position]:
        try:
            filters = {"organization_id": org_id}
            if status:
                filters["status"] = status
            
            positions = self.position_crud.get_multi_by_filters(
                db=db,
                filters=filters,
                offset=skip,
                limit=limit
            )
            return positions
        except Exception as e:
            raise DatabaseException(f"Failed to fetch positions: {str(e)}")

organization_service = OrganizationService()
