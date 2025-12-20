import { getSupabaseClient } from "@/lib/supabase"
import type { Survey, SurveyStats } from "@/lib/types/survey"

export async function getAllSurveys(): Promise<Survey[]> {
  const supabase = await getSupabaseClient()
  if (!supabase) throw new Error("Supabase client not available")

  const { data, error } = await supabase.from("surveys").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getActiveSurveys(): Promise<Survey[]> {
  const supabase = await getSupabaseClient()
  if (!supabase) throw new Error("Supabase client not available")

  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("is_active", true)
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getSurveyBySlug(slug: string): Promise<Survey | null> {
  const supabase = await getSupabaseClient()
  if (!supabase) throw new Error("Supabase client not available")

  const { data, error } = await supabase.from("surveys").select("*").eq("slug", slug).eq("is_published", true).single()

  if (error) {
    if (error.code === "PGRST116") return null // Not found
    throw error
  }
  return data
}

export async function getSurveyStats(): Promise<SurveyStats[]> {
  const supabase = await getSupabaseClient()
  if (!supabase) throw new Error("Supabase client not available")

  const { data, error } = await supabase.from("survey_stats").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createSurvey(survey: Partial<Survey>): Promise<Survey> {
  const supabase = await getSupabaseClient()
  if (!supabase) throw new Error("Supabase client not available")

  const { data, error } = await supabase.from("surveys").insert(survey).select().single()

  if (error) throw error
  return data
}

export async function updateSurvey(id: string, updates: Partial<Survey>): Promise<Survey> {
  const supabase = await getSupabaseClient()
  if (!supabase) throw new Error("Supabase client not available")

  const { data, error } = await supabase.from("surveys").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteSurvey(id: string): Promise<void> {
  const supabase = await getSupabaseClient()
  if (!supabase) throw new Error("Supabase client not available")

  const { error } = await supabase.from("surveys").delete().eq("id", id)

  if (error) throw error
}

export async function toggleSurveyActive(id: string, is_active: boolean): Promise<Survey> {
  return updateSurvey(id, { is_active })
}

export async function toggleSurveyPublished(id: string, is_published: boolean): Promise<Survey> {
  return updateSurvey(id, { is_published })
}
