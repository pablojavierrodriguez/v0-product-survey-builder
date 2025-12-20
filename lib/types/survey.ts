export interface Survey {
  id: string
  slug: string
  title: string
  description: string | null
  config: SurveyConfig
  is_active: boolean
  is_published: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface SurveyConfig {
  questions: SurveyQuestion[]
  styling: SurveyStyling
  settings: SurveySettings
}

export interface SurveyQuestion {
  id: string
  type: "single_choice" | "multi_select" | "textarea" | "email" | "salary_range" | "number" | "text"
  label?: string
  required: boolean
  options?: string[]
  placeholder?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface SurveyStyling {
  primaryColor?: string
  theme?: "gradient" | "solid" | "minimal"
  logoUrl?: string
}

export interface SurveySettings {
  allowMultipleResponses: boolean
  showProgressBar: boolean
  autoAdvance: boolean
  requireEmail?: boolean
  thankYouMessage?: string
  redirectUrl?: string
}

export interface SurveyStats {
  id: string
  slug: string
  title: string
  is_active: boolean
  is_published: boolean
  response_count: number
  last_response_at: string | null
  created_at: string
  updated_at: string
}

export interface SurveyResponse {
  id: string
  survey_id: string
  session_id: string
  user_agent: string | null
  ip_address: string | null

  // Dynamic response data (varies per survey)
  role?: string
  other_role?: string
  seniority?: string
  company_type?: string
  company_size?: string
  industry?: string
  product_type?: string
  customer_segment?: string
  main_challenge?: string
  daily_tools?: string[]
  other_tool?: string
  learning_methods?: string[]
  salary_currency?: string
  salary_min?: string
  salary_max?: string
  salary_average?: string
  email?: string

  created_at: string
  updated_at: string
}
