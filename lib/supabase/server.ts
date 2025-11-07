import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { cache } from "react"
import type { Database } from "../supabase"
import { getSafeEnvironmentConfig } from "../env"

// Check if Supabase environment variables are available
const envConfig = getSafeEnvironmentConfig()
export const isSupabaseConfigured = envConfig.supabase.isConfigured

// Create a cached version of the Supabase client for Server Components
export const createClient = cache(async () => {
  const cookieStore = await cookies()

  if (!isSupabaseConfigured) {
    console.warn("⚠️ Supabase not configured. Server-side features will be limited.")
    if (envConfig.validation.errors.length > 0) {
      console.warn("Environment errors:", envConfig.validation.errors)
    }
    return null
  }

  try {
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      },
    )
  } catch (error) {
    console.error("❌ Failed to create server Supabase client:", error)
    return null
  }
})
