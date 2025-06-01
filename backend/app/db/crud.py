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

    def get_filtered_job_roles(
        self,
        db: Session,
        filters: dict = {},
        company_model: Optional[Type[ModelType]] = None,
        min_pays: Optional[List[float]] = None,
        max_pays: Optional[List[float]] = None,
        limit: int = 100,
        offset: int = 0,
        sort_field: str = "created_at",
        sort_order: str = "desc",
    ) -> List[ModelType]:
        query = db.query(self.model)

        if company_model:
            query = query.join(company_model, self.model.company_id == company_model.id)

        for attr, value in filters.items():
            if attr == "pathways" and company_model:
                if value:
                    query = query.filter(company_model.select_a_pathway.in_(value))
            elif attr not in ("minimum_pay", "maximum_pay"):
                if hasattr(self.model, attr):
                    if isinstance(value, list):
                        query = query.filter(getattr(self.model, attr).in_(value))
                    else:
                        query = query.filter(getattr(self.model, attr) == value)

        if min_pays and max_pays:
            salary_conditions = []
            for min_pay, max_pay in zip(min_pays, max_pays):
                salary_conditions.append(
                    and_(self.model.minimum_pay >= min_pay, self.model.maximum_pay <= max_pay)
                )
            if salary_conditions:
                query = query.filter(or_(*salary_conditions))
        elif min_pays:
            query = query.filter(self.model.minimum_pay >= min(min_pays))
        elif max_pays:
            query = query.filter(self.model.maximum_pay <= max(max_pays))

        sort_func = desc if sort_order == "desc" else asc
        return (
            query.order_by(sort_func(getattr(self.model, sort_field)))
            .limit(limit)
            .offset(offset)
            .all()
        )

    def get_pathway_counts(
        self, db: Session, company_model: Type[ModelType], job_role_model: Type[ModelType]
    ) -> Dict[str, int]:
        counts = (
            db.query(company_model.select_a_pathway, func.count(job_role_model.id).label("count"))
            .join(job_role_model, company_model.id == job_role_model.company_id)
            .filter(company_model.select_a_pathway.isnot(None))
            .group_by(company_model.select_a_pathway)
            .all()
        )
        return dict(counts)
