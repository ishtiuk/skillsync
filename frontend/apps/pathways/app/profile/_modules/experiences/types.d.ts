export type CreateExperienceRequest = {
  user_id: string;
  position_title: string;
  company_name: string;
  employment_type: string;
  is_current: boolean;
  start_month: number;
  start_year: number;
  end_month?: number | null;
  end_year?: number | null;
  logo_url: string;
};

export type GetExperienceResponse = {
  id: string;
  position_title: string;
  company_name: string;
  employment_type: string;
  is_current: boolean;
  start_month: number;
  start_year: number;
  end_month: number;
  end_year: number;
};

export type UpdateExperienceRequest = {
  id: string;
  request: CreateExperienceRequest;
};
