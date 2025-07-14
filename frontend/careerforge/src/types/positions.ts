export enum WorkplaceType {
  Onsite = "Onsite",
  Remote = "Remote",
  Hybrid = "Hybrid",
}

export enum PayFrequency {
  Weekly = "Weekly",
  BiWeekly = "Bi-Weekly",
  Monthly = "Monthly",
}

export enum LevelOfExperience {
  Entry = "Entry",
  Mid = "Mid",
  Senior = "Senior",
  Executive = "Executive",
}

export enum PositionType {
  FullTime = "Full-Time",
  PartTime = "Part-Time",
  Contract = "Contract",
  Internship = "Internship",
  Volunteer = "Volunteer",
}

export enum Category {
  SoftwareEngineering = "software-engineering",
  SupplyChain = "supply-chain",
  HR = "hr",
  AdvocacyPolicy = "advocacy-policy",
  ClimateSustainability = "climate-sustainability",
  Investment = "investment",
  SalesAccountManagement = "sales-account-management",
  Content = "content",
  MarketingDesign = "marketing-design",
  Product = "product",
  Data = "data",
  Education = "education",
  Science = "science",
}

export interface PositionFilters {
  title?: string;
  job_category?: Category[];
  position_type?: PositionType[];
  level_of_experience?: LevelOfExperience[];
  workplace_type?: WorkplaceType[];
  city?: string;
  state?: string;
  country?: string;
  minimum_pay?: number[];
  maximum_pay?: number[];
  pay_frequency?: PayFrequency[];
  organization_name?: string;
  sector_focus?: string[];
}

export interface Position {
  id: string;
  organization_name: string;
  organization_logo_url: string;
  title: string;
  job_category: Category;
  sector_focus: string;
  position_type: PositionType;
  level_of_experience: LevelOfExperience;
  role_description?: string;
  education_level?: string;
  special_educational_requirements?: string;
  workplace_type?: WorkplaceType;
  city?: string;
  state?: string;
  country?: string;
  minimum_pay?: number;
  maximum_pay?: number;
  pay_frequency?: PayFrequency;
  closing_date?: string;
  external_link?: string;
  required_files?: string[];
  status?: string;
  primary_responsibilities?: string;
  required_qualifications?: string;
  desired_qualifications?: string;
  compensation_benefits?: string;
  created_at: string;
  recruiter_name?: string;
  recruiter_job_title?: string;
  recruiter_email?: string;
  recruiter_profile_picture_url?: string;
  stage?: Record<string, boolean>;
}
