// APPLICATION TYPES - Proper type definitions to replace 'any' usage
// =====================================================================================

import type { Database } from "./supabase"

// Supabase types
export interface SupabaseUser {
  id: string
  email?: string
  [key: string]: unknown
}

export interface SupabaseSession {
  access_token: string
  user: SupabaseUser
  [key: string]: unknown
}

export interface SupabaseAuthResponse {
  data: { user: SupabaseUser | null; session: SupabaseSession | null }
  error: Error | null
}

// Supabase client types
export interface SupabaseClient {
  from: (table: string) => SupabaseQueryBuilder
  auth: {
    getUser: () => Promise<{ data: { user: SupabaseUser } | null; error: Error | null }>
    getSession: () => Promise<{ data: { session: SupabaseSession } | null; error: Error | null }>
    onAuthStateChange: (callback: (event: string, session: SupabaseSession | null) => void) => { data: { subscription: { unsubscribe: () => void } } }
    exchangeCodeForSession: (code: string) => Promise<SupabaseAuthResponse>
    signInWithPassword: (credentials: { email: string; password: string }) => Promise<SupabaseAuthResponse>
    signUp: (credentials: { email: string; password: string }) => Promise<SupabaseAuthResponse>
    signInWithOAuth: (provider: { provider: string }) => Promise<SupabaseAuthResponse>
    signOut: () => Promise<{ error: Error | null }>
  }
}

export interface SupabaseQueryBuilder {
  select: (columns?: string) => SupabaseQueryBuilder
  insert: (data: Record<string, unknown>) => SupabaseQueryBuilder
  upsert: (data: Record<string, unknown>) => SupabaseQueryBuilder
  update: (data: Record<string, unknown>) => SupabaseQueryBuilder
  delete: () => SupabaseQueryBuilder
  eq: (column: string, value: string | number | boolean) => SupabaseQueryBuilder
  limit: (count: number) => SupabaseQueryBuilder
  single: () => SupabaseQueryBuilder
  order: (column: string, options?: { ascending?: boolean }) => SupabaseQueryBuilder
  range: (from: number, to: number) => SupabaseQueryBuilder
  then: <T>(callback: (result: { data: T | null; error: Error | null; count?: number }) => void) => Promise<{ data: T | null; error: Error | null; count?: number }>
}

// Survey data types
export interface SurveyData {
  role: string
  other_role: string
  seniority: string
  company_type: string
  company_size: string
  industry: string
  product_type: string
  customer_segment: string
  main_challenge: string
  daily_tools: string[]
  other_tool: string
  learning_methods: string[]
  salary_currency: string
  salary_min: string
  salary_max: string
  salary_average: string
  email: string
}

// App settings types
export interface AppSettings {
  general: {
    maintenanceMode: boolean
    debugMode: boolean
    [key: string]: string | number | boolean
  }
  database?: {
    url: string
    apiKey: string
    tableName: string
    environment: string
  }
  [key: string]: Record<string, unknown> | undefined
}

// Auth context types
export interface AuthContextType {
  user: SupabaseUser | null
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null
  session: SupabaseSession | null
  loading: boolean
  userIsAdmin: boolean
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
  clearCorruptedSession: () => Promise<void>
  updateProfile: (updates: Partial<Database["public"]["Tables"]["profiles"]["Row"]>) => Promise<{ error: Error | null }>
  getAccessToken: () => string | null
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Database operation types
export interface DatabaseOperationResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// Form data types
export interface FormData {
  get: (key: string) => string | null
  entries: () => IterableIterator<[string, string]>
}

// Error types
export interface AppError {
  message: string
  code?: string
  details?: Record<string, unknown>
}