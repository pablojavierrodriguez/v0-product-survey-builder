import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    const { data: surveys, error } = await supabase
      .from("surveys")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching surveys:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const surveysWithStats = await Promise.all(
      (surveys || []).map(async (survey) => {
        const { count, error: countError } = await supabase
          .from("survey_responses")
          .select("*", { count: "exact", head: true })
          .eq("survey_id", survey.id)

        if (countError) {
          console.error(`Error counting responses for survey ${survey.id}:`, countError)
        }

        return {
          ...survey,
          response_count: count || 0,
        }
      }),
    )

    return NextResponse.json({ success: true, surveys: surveysWithStats })
  } catch (error) {
    console.error("Error in surveys API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    const body = await request.json()
    const { slug, title, description, config, is_active, is_published } = body

    const { data: survey, error } = await supabase
      .from("surveys")
      .insert({
        slug,
        title,
        description,
        config,
        is_active: is_active ?? true,
        is_published: is_published ?? false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating survey:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, survey })
  } catch (error) {
    console.error("Error in surveys API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
