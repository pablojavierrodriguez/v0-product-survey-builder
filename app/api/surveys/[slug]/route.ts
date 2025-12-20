import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = await getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    const { data: survey, error } = await supabase
      .from("surveys")
      .select("*")
      .eq("slug", params.slug)
      .eq("is_published", true)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Survey not found" }, { status: 404 })
      }
      console.error("Error fetching survey:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, survey })
  } catch (error) {
    console.error("Error in survey API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
