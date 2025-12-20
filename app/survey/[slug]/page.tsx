"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/lib/auth-context"
import { useDebugMode } from "@/lib/use-debug-mode"
import { SurveyProgress } from "@/components/ui/survey-progress"
import { SurveySkeleton, ProgressIndicator, ErrorDisplay, LoadingOverlay } from "@/components/ui/loading-states"
import type { Survey } from "@/lib/types/survey"

interface SurveyData {
  [key: string]: any
}

export default function SurveyPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user, userIsAdmin, clearCorruptedSession } = useAuth()
  const { debugMode } = useDebugMode()

  const [survey, setSurvey] = useState<Survey | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [surveyData, setSurveyData] = useState<SurveyData>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    loadSurvey()
  }, [resolvedParams.slug])

  const loadSurvey = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/surveys/${resolvedParams.slug}`)

      if (!response.ok) {
        throw new Error("Survey not found")
      }

      const data = await response.json()
      setSurvey(data.survey)

      // Check if survey was already completed
      if (typeof window !== "undefined" && window.sessionStorage) {
        const completed = window.sessionStorage.getItem(`survey_completed_${data.survey.id}`)
        if (completed === "true") {
          setCurrentStep(data.survey.config.questions.length + 1)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load survey")
    } finally {
      setIsLoading(false)
    }
  }

  const submitSurvey = async () => {
    if (!survey) return

    setIsSubmitting(true)
    setError(null)

    try {
      const payload = {
        survey_id: survey.id,
        response_data: surveyData,
        session_id:
          typeof window !== "undefined"
            ? window.sessionStorage?.getItem(`survey_session_${survey.id}`) || crypto.randomUUID()
            : crypto.randomUUID(),
        user_agent: typeof window !== "undefined" ? window.navigator?.userAgent : "Unknown",
        ip_address: null,
      }

      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem(`survey_session_${survey.id}`, payload.session_id)
      }

      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setCurrentStep(survey.config.questions.length + 1)
        if (typeof window !== "undefined" && window.sessionStorage) {
          window.sessionStorage.setItem(`survey_completed_${survey.id}`, "true")
        }
      } else {
        setError(result.error || "Error submitting survey")
      }
    } catch (error) {
      console.error("Error submitting survey:", error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isMounted || isLoading) {
    return <SurveySkeleton />
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={loadSurvey} />
  }

  if (!survey) {
    return <ErrorDisplay error="Survey not found" onRetry={() => router.push("/")} />
  }

  // This is a simplified version - the full implementation would render questions dynamically
  // For now, redirect to the old hardcoded survey for the default survey
  if (survey.slug === "product-survey-2025") {
    if (typeof window !== "undefined") {
      window.location.href = "/survey-legacy"
    }
    return <ProgressIndicator message="Loading survey..." />
  }

  const totalSteps = survey.config.questions.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200/60 dark:border-gray-800/60 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12 sm:h-14 md:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">
                {survey.title}
              </h1>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
              <ModeToggle />
              {userIsAdmin && (
                <Button
                  onClick={() => router.push("/admin/dashboard")}
                  size="sm"
                  className="px-2.5 sm:px-3 md:px-4 h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
                >
                  <Shield className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                  Admin
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-3 sm:py-4 md:py-6 lg:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl lg:max-w-4xl mx-auto">
          {currentStep <= totalSteps && (
            <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
              <SurveyProgress
                current={currentStep}
                total={totalSteps}
                percentage={Math.round((currentStep / totalSteps) * 100)}
              />
            </div>
          )}

          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Dynamic Survey Rendering</h2>
            <p className="text-muted-foreground mb-6">
              This survey uses the new dynamic configuration system. Full implementation coming soon.
            </p>
            <Button onClick={() => router.push("/")}>Back to Survey List</Button>
          </div>
        </div>
      </main>

      <LoadingOverlay isVisible={isSubmitting} message="Submitting survey..." />
    </div>
  )
}
