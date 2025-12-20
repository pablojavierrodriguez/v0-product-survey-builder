import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    const { data: original, error: fetchError } = await supabase
      .from("surveys")
      .select("*")
      .eq("id", params.id)
      .single()

    if (fetchError || !original) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 })
    }

    const duplicate = {
      slug: `${original.slug}-copy-${Date.now()}`,
      title: `${original.title} (Copy)`,
      description: original.description,
      config: original.config,
      is_active: false, // Copies start as inactive
      is_published: false,
    }

    const { data: newSurvey, error: createError } = await supabase.from("surveys").insert(duplicate).select().single()

    if (createError) {
      console.error("Error duplicating survey:", createError)
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, survey: newSurvey })
  } catch (error) {
    console.error("Error in duplicate survey API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
