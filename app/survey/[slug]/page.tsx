"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/lib/auth-context"
import { useDebugMode } from "@/lib/use-debug-mode"
import { SurveyProgress } from "@/components/ui/survey-progress"
import { SurveySkeleton, ErrorDisplay, LoadingOverlay } from "@/components/ui/loading-states"
import { SurveyRenderer } from "@/components/survey-renderer"
import type { Survey } from "@/lib/types/survey"
import { motion } from "framer-motion"

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

      if (typeof window !== "undefined" && window.sessionStorage) {
        const completed = window.sessionStorage.getItem(`survey_completed_${data.survey.id}`)
        if (completed === "true") {
          setCurrentStep((data.survey.config?.questions?.length || 0) + 1)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load survey")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResponse = (questionId: string, value: any) => {
    console.log("[v0] Response updated:", { questionId, value })
    setSurveyData((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (!survey) return
    const totalSteps = survey.config?.questions?.length || 0

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    } else if (currentStep === totalSteps) {
      submitSurvey()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const isStepValid = () => {
    if (!survey) return false
    const question = survey.config.questions[currentStep - 1]
    if (!question || !question.required) return true

    const value = surveyData[question.id]

    if (question.type === "multi_select") {
      return Array.isArray(value) && value.length > 0
    }

    return value !== undefined && value !== null && value !== ""
  }

  const submitSurvey = async () => {
    if (!survey) return

    setIsSubmitting(true)
    setError(null)

    try {
      const responseData: any = {}

      survey.config.questions.forEach((question) => {
        const value = surveyData[question.id]
        // Map question IDs to field names (you may want to store field_name in question config)
        const fieldName = question.id.replace(/^q_/, "")
        responseData[fieldName] = value
      })

      const payload = {
        survey_id: survey.id,
        response_data: responseData,
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

      console.log("[v0] Submitting survey:", payload)

      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setCurrentStep((survey.config?.questions?.length || 0) + 1)
        if (typeof window !== "undefined" && window.sessionStorage) {
          window.sessionStorage.setItem(`survey_completed_${survey.id}`, "true")
        }
      } else {
        setError(result.error || "Error submitting survey")
      }
    } catch (error) {
      console.error("[v0] Error submitting survey:", error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const restartSurvey = () => {
    if (!survey) return
    setSurveyData({})
    setCurrentStep(1)
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.removeItem(`survey_completed_${survey.id}`)
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

  const totalSteps = survey.config?.questions?.length || 0
  const isCompleted = currentStep > totalSteps

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
          {!isCompleted && (
            <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
              <SurveyProgress
                current={currentStep}
                total={totalSteps}
                percentage={Math.round((currentStep / totalSteps) * 100)}
              />
            </div>
          )}

          {isCompleted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl mx-auto text-center space-y-6"
            >
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Check className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Survey Completed!</h2>
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    ✅ Your responses have been successfully saved
                  </p>
                </div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {survey.config?.settings?.thankYouMessage ||
                  "Thank you for participating! Your responses help us improve our products and services."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {userIsAdmin && (
                  <Button onClick={() => router.push("/admin/dashboard")} className="px-8 py-3">
                    View Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline" onClick={restartSurvey} className="px-8 py-3 bg-transparent">
                  Take Survey Again
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              <SurveyRenderer
                questions={survey.config.questions}
                currentStep={currentStep}
                responses={surveyData}
                onResponse={handleResponse}
                onNext={handleNext}
                autoAdvance={survey.config?.settings?.autoAdvance}
              />

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3 mt-6 sm:mt-8">
                <Button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="px-4 sm:px-6 h-10 sm:h-11 text-sm sm:text-base bg-transparent"
                >
                  <ArrowLeft className="mr-1.5 sm:mr-2 h-4 w-4" />
                  Back
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="px-4 sm:px-6 h-10 sm:h-11 text-sm sm:text-base"
                >
                  {currentStep === totalSteps ? "Submit" : "Next"}
                  <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      <LoadingOverlay isVisible={isSubmitting} message="Submitting survey..." />
    </div>
  )
}
