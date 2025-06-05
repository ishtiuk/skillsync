# from pydantic import UUID4
# from sqlalchemy.orm import Session

# from app.db.crud import CRUDBase
# from app.models.applied_jobs import AppliedJobs
# from app.models.company import Companies
# from app.models.job_role import JobRoles
# from app.models.user import Users
# from app.schemas.job_role import JobRoleCreate, JobRoleUpdate, PathwayCountResponse
# from app.utils.exceptions import DatabaseException, PermissionDeniedException, ResourceNotFound
# from core.constants import error_messages
# from core.logger import logger


# class JobRoleService:
#     def __init__(self):
#         self.job_roles_crud = CRUDBase(model=JobRoles)
#         self.company_crud = CRUDBase(model=Companies)
#         self.user_crud = CRUDBase(model=Users)

#     def create_job_role(self, db: Session, job_role_in: JobRoleCreate, user: Users) -> JobRoles:
#         try:
#             company = self.company_crud.get_by_field(db, field="created_by", value=user.id)
#             if not company:
#                 raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)

#             job_role_data = JobRoles(
#                 user_id=user.id,
#                 company_id=company.id,
#                 title=job_role_in.title,
#                 job_category=job_role_in.job_category,
#                 position_type=job_role_in.position_type,
#                 level_of_experience=job_role_in.level_of_experience,
#                 role_description=job_role_in.role_description,
#                 education_level=job_role_in.education_level,
#                 special_educational_requirements=job_role_in.special_educational_requirements,
#                 workplace_type=job_role_in.workplace_type,
#                 city=job_role_in.city,
#                 state=job_role_in.state,
#                 country=job_role_in.country,
#                 pay_type=job_role_in.pay_type,
#                 minimum_pay=job_role_in.minimum_pay,
#                 maximum_pay=job_role_in.maximum_pay,
#                 pay_frequency=job_role_in.pay_frequency,
#                 closing_date=job_role_in.closing_date,
#                 external_link=job_role_in.external_link,
#                 required_files=job_role_in.required_files,
#                 status=job_role_in.status,
#                 primary_responsibilities=job_role_in.primary_responsibilities,
#                 required_qualifications=job_role_in.required_qualifications,
#                 desired_qualifications=job_role_in.desired_qualifications,
#                 compensation_benefits=job_role_in.compensation_benefits,
#                 show_recruiter=job_role_in.show_recruiter,
#             )
#             job_role = self.job_roles_crud.create(db=db, obj_in=job_role_data)
#             return job_role
#         except ResourceNotFound:
#             db.rollback()
#             raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)
#         except Exception:
#             db.rollback()
#             raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

#     def update_job_role(
#         self, db: Session, job_role_id: UUID4, job_role_in: JobRoleUpdate, user: Users
#     ) -> JobRoles:
#         try:
#             job_role = self.job_roles_crud.get(db=db, id=job_role_id)
#             if not job_role:
#                 raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)

#             if job_role.user_id != user.id:
#                 raise PermissionDeniedException(message=error_messages.PERMISSION_DENIED)

#             attributes = [
#                 "title",
#                 "job_category",
#                 "position_type",
#                 "level_of_experience",
#                 "role_description",
#                 "education_level",
#                 "special_educational_requirements",
#                 "workplace_type",
#                 "city",
#                 "state",
#                 "country",
#                 "pay_type",
#                 "minimum_pay",
#                 "maximum_pay",
#                 "pay_frequency",
#                 "closing_date",
#                 "external_link",
#                 "required_files",
#                 "status",
#                 "primary_responsibilities",
#                 "required_qualifications",
#                 "desired_qualifications",
#                 "compensation_benefits",
#                 "show_recruiter",
#             ]

#             for attr in attributes:
#                 value = getattr(job_role_in, attr, None)
#                 if value is not None:
#                     setattr(job_role, attr, value)

#             return self.job_roles_crud.update(db=db, obj_in=job_role)
#         except (ResourceNotFound, PermissionDeniedException) as e:
#             db.rollback()
#             raise e
#         except Exception:
#             db.rollback()
#             raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

#     def get_job_roles_for_pathways(
#         self, db: Session, user: Users, filters: dict, page: int, limit: int = 5000
#     ) -> list[JobRoles]:
#         try:
#             offset = page * limit
#             filter_copy = filters.copy()

#             # Handle company name filter
#             company_name = filter_copy.pop("company_name", None)
#             is_bipoc_owned = filter_copy.pop("is_bipoc_owned", None)

#             # Build company filters
#             company_filters = {}
#             if company_name:
#                 company_filters["name"] = company_name
#             if is_bipoc_owned is not None:
#                 company_filters["is_bipoc_owned"] = is_bipoc_owned

#             # Get companies matching filters
#             if company_filters:
#                 companies = self.company_crud.get_multi_by_filters(db, filters=company_filters)
#                 if not companies:
#                     logger.info("No companies match the filters, returning empty result.")
#                     return []
#                 filter_copy["company_id"] = [company.id for company in companies]

#             list_filters = [
#                 "job_category",
#                 "position_type",
#                 "level_of_experience",
#                 "workplace_type",
#                 "pay_frequency",
#                 "pathway",
#             ]
#             for key in list_filters:
#                 if key in filter_copy and not isinstance(filter_copy[key], list):
#                     filter_copy[key] = [filter_copy[key]]

#             pathways = filter_copy.pop("pathway", None)
#             if pathways:
#                 filter_copy["pathways"] = pathways

#             min_pays = filter_copy.pop("minimum_pay", None)
#             max_pays = filter_copy.pop("maximum_pay", None)

#             job_roles = self.job_roles_crud.get_filtered_job_roles(
#                 db=db,
#                 filters=filter_copy,
#                 company_model=Companies,
#                 min_pays=min_pays,
#                 max_pays=max_pays,
#                 limit=limit,
#                 offset=offset,
#                 sort_field="created_at",
#                 sort_order="desc",
#             )

#             return job_roles

#         except Exception as e:
#             logger.error(f"Failed to get job roles for pathways: {e}")
#             raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

#     def get_job_roles_for_candid(
#         self, db: Session, user: Users, page: int, limit: int
#     ) -> list[JobRoles]:
#         try:
#             offset = page * limit
#             company = self.company_crud.get_by_field(db, field="created_by", value=user.id)
#             if not company:
#                 logger.error("Company does not exist. Create Company first.")
#                 raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)

#             return self.job_roles_crud.get_multi_by_field_sorted(
#                 db=db,
#                 field="company_id",
#                 value=company.id,
#                 limit=limit,
#                 offset=offset,
#                 sort_field="created_at",
#                 sort_order="desc",
#             )
#         except Exception as e:
#             logger.error(f"Failed to get job roles for candid: {e}")
#             raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)

#     def get_single_job_role(self, db: Session, job_role_id: str) -> JobRoles:
#         job_role = self.job_roles_crud.get(db=db, id=job_role_id)
#         if not job_role:
#             logger.error(f"Job role with ID {job_role_id} not found.")
#             raise ResourceNotFound(message=error_messages.RESOURCE_NOT_FOUND)
#         return job_role

#     def format_job_role_response(
#         self, job_role: JobRoles, db: Session, include_stage: bool = True, user_id: UUID4 = None
#     ) -> dict:
#         company = self.company_crud.get(db=db, id=job_role.company_id)
#         response_data = {
#             "id": job_role.id,
#             "company_name": company.name,
#             "company_logo_url": company.logo_url,
#             "is_bipoc_owned": company.is_bipoc_owned,
#             "title": job_role.title,
#             "job_category": job_role.job_category,
#             "pathway": company.select_a_pathway,
#             "position_type": job_role.position_type,
#             "level_of_experience": job_role.level_of_experience,
#             "role_description": job_role.role_description,
#             "education_level": job_role.education_level,
#             "special_educational_requirements": job_role.special_educational_requirements,
#             "workplace_type": job_role.workplace_type,
#             "city": job_role.city,
#             "state": job_role.state,
#             "country": job_role.country,
#             "pay_type": job_role.pay_type,
#             "minimum_pay": job_role.minimum_pay,
#             "maximum_pay": job_role.maximum_pay,
#             "pay_frequency": job_role.pay_frequency,
#             "closing_date": job_role.closing_date,
#             "external_link": job_role.external_link,
#             "required_files": job_role.required_files,
#             "status": job_role.status,
#             "primary_responsibilities": job_role.primary_responsibilities,
#             "required_qualifications": job_role.required_qualifications,
#             "desired_qualifications": job_role.desired_qualifications,
#             "compensation_benefits": job_role.compensation_benefits,
#             "created_at": job_role.created_at,
#         }

#         if job_role.show_recruiter:
#             recruiter = self.user_crud.get(db=db, id=job_role.user_id)
#             response_data.update(
#                 {
#                     "recruiter_name": f"{recruiter.first_name} {recruiter.last_name}",
#                     "recruiter_job_title": recruiter.current_job_title,
#                     "recruiter_email": recruiter.email,
#                     "recruiter_profile_picture_url": recruiter.profile_picture_url,
#                 }
#             )

#         # Add stage information if requested and user_id is provided
#         if include_stage and user_id:
#             applied_job = (
#                 db.query(AppliedJobs)
#                 .filter(AppliedJobs.job_id == job_role.id, AppliedJobs.user_id == user_id)
#                 .first()
#             )

#             response_data["stage"] = (
#                 applied_job.stage
#                 if applied_job
#                 else {
#                     "saved": False,
#                     "applied": False,
#                     "interview-1": False,
#                     "offer": False,
#                     "hired": False,
#                     "past-roles": False,
#                     "ineligible": False,
#                 }
#             )

#         return response_data

#     def get_pathway_job_counts(self, db: Session) -> PathwayCountResponse:
#         try:
#             pathway_counts = self.job_roles_crud.get_pathway_counts(
#                 db=db, company_model=Companies, job_role_model=JobRoles
#             )
#             return PathwayCountResponse(pathways_count=pathway_counts)
#         except Exception as e:
#             logger.error(f"Failed to get pathway job counts: {e}")
#             raise DatabaseException(message=error_messages.INTERNAL_SERVER_ERROR)


# job_role_service = JobRoleService()
