import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let supabaseInstance: SupabaseClient | null = null
let isConfigured = false

function getEnvVar(key: string): string | null {
  // Only access NEXT_PUBLIC_ variables on client
  if (typeof window !== "undefined" && !key.startsWith("NEXT_PUBLIC_")) {
    return null
  }
  return process.env[key] || null
}

function initializeSupabase() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = getEnvVar("NEXT_PUBLIC_SUPABASE_URL")
  const supabaseAnonKey = getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY")

  if (!supabaseUrl || !supabaseAnonKey) {
    isConfigured = false
    return null
  }

  try {
    isConfigured = true
    supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
    return supabaseInstance
  } catch (error) {
    console.error("❌ Failed to create Supabase client:", error)
    isConfigured = false
    return null
  }
}

export const supabase = initializeSupabase()
export const isSupabaseConfigured = isConfigured

// Legacy function for backward compatibility
export async function getSupabaseClient() {
  if (!isSupabaseConfigured) {
    console.warn("⚠️ Supabase not configured. Please check environment variables.")
    return null
  }
  return supabase
}

export function getSupabaseClientSync() {
  return isSupabaseConfigured ? supabase : null
}

export async function clearSupabaseCache() {
  // Supabase cache cleared
}

export async function requireSupabase() {
  return isSupabaseConfigured
}

// Database types - updated to match new schema
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name?: string
          role?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      app_settings: {
        Row: {
          id: string
          key: string
          value: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: any
          created_at?: string
          updated_at?: string
        }
      }
      survey_responses: {
        Row: {
          id: string
          session_id: string
          user_agent?: string
          ip_address?: string
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
        Insert: {
          id?: string
          session_id: string
          user_agent?: string
          ip_address?: string
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
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_agent?: string
          ip_address?: string
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
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
