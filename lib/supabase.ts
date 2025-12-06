import { createBrowserClient } from "@supabase/ssr"

export const isSupabaseConfigured = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  return url.length > 0 && key.length > 0 && url.startsWith("http")
})()

export const supabase = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!url || !key || !url.startsWith("http")) {
    console.warn("⚠️ Supabase environment variables are not set. Using mock client.")
    // Return a mock client to prevent errors
    return {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        upsert: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        update: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        delete: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () =>
          Promise.resolve({ data: { user: null, session: null }, error: { message: "Supabase not configured" } }),
        signUp: () =>
          Promise.resolve({ data: { user: null, session: null }, error: { message: "Supabase not configured" } }),
        signOut: () => Promise.resolve({ error: null }),
      },
    } as any
  }

  return createBrowserClient(url, key)
})()

// Legacy function for backward compatibility
export async function getSupabaseClient() {
  if (!isSupabaseConfigured) {
    console.warn(
      "⚠️ Supabase environment variables are not set. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    )
    return null
  }
  return supabase
}

export function getSupabaseClientSync() {
  return isSupabaseConfigured ? supabase : null
}

export async function clearSupabaseCache() {
  console.log("🗑️ Supabase cache cleared")
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
