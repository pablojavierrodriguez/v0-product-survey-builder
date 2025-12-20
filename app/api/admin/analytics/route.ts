import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"

interface SurveyResponse {
  id: string
  survey_id?: string
  created_at: string
  updated_at: string
  session_id: string
  user_agent?: string
  ip_address?: string
  role: string
  seniority: string
  company_size: string
  industry: string
  daily_tools: string[]
  learning_methods: string[]
  satisfaction_score?: number
  feedback?: string
}

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Analytics API called")

    if (!isSupabaseConfigured) {
      console.log("[v0] Missing Supabase configuration")
      return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 500 })
    }

    const supabase = await getSupabaseClient()
    if (!supabase) {
      console.log("[v0] Could not create Supabase client")
      return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const surveyFilter = searchParams.get("survey")

    // Build query with optional survey filter
    let query = supabase.from("survey_responses").select("*").order("created_at", { ascending: false })

    if (surveyFilter) {
      query = query.eq("survey_id", surveyFilter)
    }

    const { data: surveyData, error: surveyError } = await query

    if (surveyError) {
      console.log("[v0] Error fetching survey data:", surveyError)
      return NextResponse.json(
        { success: false, error: `Error fetching survey data: ${surveyError.message}` },
        { status: 500 },
      )
    }

    console.log(
      "[v0] Survey data fetched:",
      surveyData?.length || 0,
      "records",
      surveyFilter ? `(filtered by survey: ${surveyFilter})` : "(all surveys)",
    )

    const totalResponses = surveyData?.length || 0
    const today = new Date().toDateString()
    const todayResponses =
      surveyData?.filter((r: SurveyResponse) => new Date(r.created_at).toDateString() === today).length || 0

    // Initialize distributions
    const roleDistribution: { [key: string]: number } = {}
    const seniorityDistribution: { [key: string]: number } = {}
    const industryDistribution: { [key: string]: number } = {}
    const companyDistribution: { [key: string]: number } = {}
    const toolsUsage: { [key: string]: number } = {}
    const learningMethods: { [key: string]: number } = {}

    // Process each survey response - now using normalized fields
    surveyData?.forEach((response: SurveyResponse) => {
      // Role distribution
      if (response.role) {
        roleDistribution[response.role] = (roleDistribution[response.role] || 0) + 1
      }

      // Seniority distribution
      if (response.seniority) {
        seniorityDistribution[response.seniority] = (seniorityDistribution[response.seniority] || 0) + 1
      }

      // Industry distribution
      if (response.industry) {
        industryDistribution[response.industry] = (industryDistribution[response.industry] || 0) + 1
      }

      // Company size distribution
      if (response.company_size) {
        companyDistribution[response.company_size] = (companyDistribution[response.company_size] || 0) + 1
      }

      // Tools usage
      if (response.daily_tools && Array.isArray(response.daily_tools)) {
        response.daily_tools.forEach((tool: string) => {
          if (tool) {
            toolsUsage[tool] = (toolsUsage[tool] || 0) + 1
          }
        })
      }

      // Learning methods
      if (response.learning_methods && Array.isArray(response.learning_methods)) {
        response.learning_methods.forEach((method: string) => {
          if (method) {
            learningMethods[method] = (learningMethods[method] || 0) + 1
          }
        })
      }
    })

    const recentResponses =
      surveyData?.slice(0, 10).map((response: SurveyResponse) => ({
        id: response.id,
        survey_id: response.survey_id,
        role: response.role,
        seniority: response.seniority,
        company_size: response.company_size,
        industry: response.industry,
        created_at: response.created_at,
      })) || []

    return NextResponse.json({
      success: true,
      data: {
        totalResponses,
        todayResponses,
        roleDistribution,
        seniorityDistribution,
        industryDistribution,
        companyDistribution,
        toolsUsage,
        learningMethods,
        recentResponses,
        filter: surveyFilter ? { survey_id: surveyFilter } : null,
      },
    })
  } catch (error) {
    console.error("[v0] Analytics API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
