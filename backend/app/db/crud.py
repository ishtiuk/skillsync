from datetime import datetime
from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import and_, asc, desc, func, or_
from sqlalchemy.orm import Session

from app.db.base_class import Base
from app.utils.exceptions import CustomException, ResourceNotFound

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, *, model: Type[ModelType]):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).
        **Parameters**
        * `model`: A SQLAlchemy model class
        * `schema`: A Pydantic model (schema) class
        """
        self.model = model

    def get(self, db: Session, id: str) -> Optional[ModelType]:
        return db.get(self.model, id)

    def get_by_field(self, db: Session, field: str, value: Any) -> Optional[ModelType]:
        return db.query(self.model).filter(getattr(self.model, field) == value).first()

    def get_by_multiple_fields(self, db: Session, fields: Dict[str, Any]) -> Optional[ModelType]:
        query = db.query(self.model)
        for field, value in fields.items():
            query = query.filter(getattr(self.model, field) == value)
        return query.first()

    def get_multi_by_field(self, db: Session, field: str, value: Any) -> Optional[ModelType]:
        return db.query(self.model).filter(getattr(self.model, field) == value).all()

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[ModelType]:
        return db.query(self.model).offset(skip).limit(limit).all()

    def get_multi_by_filters(
        self,
        db: Session,
        filters: dict,
        limit: int = 100,
        offset: int = 0,
        sort_field: str = "created_at",
        sort_order: str = "desc",
    ) -> List[ModelType]:
        query = db.query(self.model)
        for attr, value in filters.items():
            query = query.filter(getattr(self.model, attr) == value)
        sort_func = desc if sort_order == "desc" else asc
        return (
            query.order_by(sort_func(getattr(self.model, sort_field)))
            .limit(limit)
            .offset(offset)
            .all()
        )

    def get_multi_by_field_sorted(
        self,
        db: Session,
        field: str,
        value: Any,
        limit: int = 5,
        offset: int = 0,
        sort_field: str = "created_at",
        sort_order: str = "desc",
    ) -> list[ModelType]:
        sort_func = desc if sort_order == "desc" else asc
        return (
            db.query(self.model)
            .filter(getattr(self.model, field) == value)
            .order_by(sort_func(getattr(self.model, sort_field)))
            .limit(limit)
            .offset(offset)
            .all()
        )

    def create(self, db: Session, *, obj_in: CreateSchemaType) -> ModelType:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)  # type: ignore
        db_obj.updated_at = datetime.now()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, obj_in: Union[UpdateSchemaType, Dict[str, Any]]) -> ModelType:
        db_obj = db.get(self.model, obj_in.id)
        if hasattr(obj_in, "updated_at"):
            obj_in.updated_at = datetime.now()

        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = jsonable_encoder(obj_in)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int) -> ModelType:
        obj = db.get(self.model, id)
        if obj is None:
            raise CustomException(ResourceNotFound)
        db.delete(obj)
        db.commit()
        return obj

    def get_filtered_positions(
        self,
        db: Session,
        filters: dict = {},
        organization_model: Optional[Type[ModelType]] = None,
        sector_focus: Optional[List[str]] = None,
        min_pays: Optional[List[float]] = None,
        max_pays: Optional[List[float]] = None,
        limit: int = 100,
        offset: int = 0,
        sort_field: str = "created_at",
        sort_order: str = "desc",
    ) -> List[ModelType]:
        query = db.query(self.model)

        # Join with organizations if model is provided
        if organization_model:
            query = query.join(
                organization_model, self.model.organization_id == organization_model.id
            )

            # Apply sector focus filter if provided
            if sector_focus:
                query = query.filter(
                    func.lower(organization_model.sector_focus).in_(
                        [s.lower() for s in sector_focus]
                    )
                )

        # Apply other filters
        for attr, value in filters.items():
            if value is not None:
                if isinstance(value, (list, tuple)):
                    # Handle array values (like organization_ids, job categories, position types)
                    if all(isinstance(v, str) for v in value):
                        # Case-insensitive filtering for string arrays
                        query = query.filter(
                            func.lower(getattr(self.model, attr)).in_([v.lower() for v in value])
                        )
                    else:
                        # For non-string arrays (like organization_ids, numbers), use direct comparison
                        query = query.filter(getattr(self.model, attr).in_(value))
                elif isinstance(value, str):
                    # Case-insensitive filtering for string fields with ILIKE
                    if attr in ["title", "city", "state", "country"]:
                        query = query.filter(
                            func.lower(getattr(self.model, attr)).like(f"%{value.lower()}%")
                        )
                    else:
                        # For other string fields, use case-insensitive exact match
                        query = query.filter(func.lower(getattr(self.model, attr)) == value.lower())
                else:
                    # For non-string values (like numbers), use direct comparison
                    query = query.filter(getattr(self.model, attr) == value)

        # Apply pay range filters
        if min_pays and max_pays:
            salary_conditions = []
            for min_pay, max_pay in zip(min_pays, max_pays):
                condition = and_(
                    or_(self.model.minimum_pay.is_(None), self.model.minimum_pay >= min_pay),
                    or_(self.model.maximum_pay.is_(None), self.model.maximum_pay <= max_pay),
                )
                salary_conditions.append(condition)
            if salary_conditions:
                query = query.filter(or_(*salary_conditions))
        elif min_pays:
            query = query.filter(
                or_(
                    *[self.model.minimum_pay >= min_pay for min_pay in min_pays],
                    *[self.model.maximum_pay >= min_pay for min_pay in min_pays],
                )
            )
        elif max_pays:
            query = query.filter(
                or_(
                    *[self.model.maximum_pay <= max_pay for max_pay in max_pays],
                    *[self.model.minimum_pay <= max_pay for max_pay in max_pays],
                )
            )

        # Add sorting
        sort_column = getattr(self.model, sort_field)
        if sort_order.lower() == "desc":
            sort_column = sort_column.desc()
        query = query.order_by(sort_column)

        return query.offset(offset).limit(limit).all()

    def get_sector_counts(
        self,
        db: Session,
        platform: str,
        organization_model: Type[ModelType],
        position_model: Type[ModelType],
    ) -> Dict[str, int]:
        counts = (
            db.query(organization_model.sector_focus, func.count(position_model.id).label("count"))
            .join(position_model, organization_model.id == position_model.organization_id)
            .filter(
                organization_model.sector_focus.isnot(None), position_model.platform == platform
            )
            .group_by(organization_model.sector_focus)
            .all()
        )
        return dict(counts)
