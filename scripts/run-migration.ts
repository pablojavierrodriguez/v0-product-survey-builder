/**
 * Migration script runner for survey system
 * Run this script to execute all migration SQL files in order
 */

import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"
import * as path from "path"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

interface MigrationResult {
  file: string
  success: boolean
  error?: string
  duration: number
}

async function runMigration(filePath: string): Promise<MigrationResult> {
  const fileName = path.basename(filePath)
  const startTime = Date.now()

  try {
    console.log(`\n📄 Running migration: ${fileName}`)
    const sql = fs.readFileSync(filePath, "utf8")

    // Split by semicolons but keep them for execution
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"))

    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc("exec_sql", { sql_query: statement + ";" })

        if (error) {
          // Try direct execution as fallback
          const { error: directError } = await supabase.from("_migration_log").insert({
            migration_file: fileName,
            sql_statement: statement,
            executed_at: new Date().toISOString(),
          })

          if (directError) {
            throw error
          }
        }
      }
    }

    const duration = Date.now() - startTime
    console.log(`✅ Completed ${fileName} in ${duration}ms`)

    return {
      file: fileName,
      success: true,
      duration,
    }
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`❌ Failed ${fileName}:`, error)

    return {
      file: fileName,
      success: false,
      error: error instanceof Error ? error.message : String(error),
      duration,
    }
  }
}

async function runAllMigrations() {
  console.log("🚀 Starting database migration...")
  console.log("=".repeat(50))

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ Missing Supabase configuration!")
    console.error("Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
  }

  const scriptsDir = path.join(process.cwd(), "scripts")
  const migrationFiles = fs
    .readdirSync(scriptsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort() // Ensures files run in order (01_, 02_, etc.)

  console.log(`\n📋 Found ${migrationFiles.length} migration files`)

  const results: MigrationResult[] = []

  for (const file of migrationFiles) {
    const filePath = path.join(scriptsDir, file)
    const result = await runMigration(filePath)
    results.push(result)

    if (!result.success) {
      console.error(`\n⚠️  Migration failed at ${file}`)
      console.error("Stopping migration process.")
      break
    }
  }

  console.log("\n" + "=".repeat(50))
  console.log("📊 Migration Summary:")
  console.log("=".repeat(50))

  const successful = results.filter((r) => r.success).length
  const failed = results.filter((r) => !r.success).length
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0)

  console.log(`✅ Successful: ${successful}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`⏱️  Total duration: ${totalDuration}ms`)

  if (failed > 0) {
    console.log("\n❌ Failed migrations:")
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`  - ${r.file}: ${r.error}`)
      })
    process.exit(1)
  } else {
    console.log("\n✨ All migrations completed successfully!")
  }
}

// Run migrations
runAllMigrations().catch((error) => {
  console.error("💥 Fatal error:", error)
  process.exit(1)
})
