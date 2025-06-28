// Add these types to your auth types file
export interface Experience {
  id: string;
  position_title: string;
  company_name: string;
  employment_type: string;
  is_current: boolean;
  start_month: number;
  start_year: number;
  end_month?: number;
  end_year?: number;
  logo_url?: string;
}

export interface CreateExperienceRequest {
  position_title: string;
  company_name: string;
  employment_type: string;
  is_current: boolean;
  start_month: number;
  start_year: number;
  end_month?: number;
  end_year?: number;
  logo_url?: string;
}

export interface UpdateExperienceRequest extends Partial<CreateExperienceRequest> {}
