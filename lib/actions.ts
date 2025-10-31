"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { Database } from "./supabase"
import { getSafeEnvironmentConfig } from "./env"

async function createSupabaseServerClient() {
  const envConfig = getSafeEnvironmentConfig()
  const cookieStore = await cookies()

  return createServerClient<Database>(envConfig.supabase.url || "", envConfig.supabase.anonKey || "", {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch (error) {
          // Handle cookie setting errors
        }
      },
    },
  })
}

export async function signInWithPassword(email: string, password: string) {
  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("[v0] Login error:", error.message)
      return { error: error.message }
    }

    if (!data.user) {
      return { error: "Login failed. Please check your credentials." }
    }

    // Server-side redirect after successful login
    redirect("/admin/dashboard")
  } catch (error: any) {
    // If it's a redirect error, let it propagate
    if (error?.message?.includes("NEXT_REDIRECT")) {
      throw error
    }
    console.error("[v0] Login exception:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    return { success: "Check your email to confirm your account." }
  } catch (error) {
    console.error("[v0] Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  try {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()
  } catch (error) {
    console.error("[v0] Sign out error:", error)
  }
  redirect("/auth/login")
}
