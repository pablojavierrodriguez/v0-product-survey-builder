import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    // Fetch only active AND published surveys
    const { data: surveys, error } = await supabase
      .from("surveys")
      .select("*")
      .eq("is_active", true)
      .eq("is_published", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching active surveys:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, surveys: surveys || [] })
  } catch (error) {
    console.error("Error in active surveys API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
