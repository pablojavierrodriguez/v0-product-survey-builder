"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check } from "lucide-react"
import type { SurveyQuestion } from "@/lib/types/survey"

interface SurveyRendererProps {
  questions: SurveyQuestion[]
  currentStep: number
  responses: Record<string, any>
  onResponse: (questionId: string, value: any) => void
  onNext: () => void
  autoAdvance?: boolean
}

export function SurveyRenderer({
  questions,
  currentStep,
  responses,
  onResponse,
  onNext,
  autoAdvance = false,
}: SurveyRendererProps) {
  const question = questions[currentStep - 1]
  const value = responses[question.id]

  // Auto-advance for single choice questions
  useEffect(() => {
    if (autoAdvance && question && question.type === "single_choice" && value && value !== "Other") {
      const timer = setTimeout(() => {
        onNext()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [value, autoAdvance, question, onNext])

  const renderQuestion = () => {
    if (!question) return null

    switch (question.type) {
      case "single_choice":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto space-y-6"
          >
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white text-center leading-relaxed px-2"
            >
              {question.label}
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(question.options || []).map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onResponse(question.id, option)}
                  className={`
                    p-4 text-left rounded-xl border-2 transition-all duration-200
                    min-h-[56px] flex items-center justify-between
                    ${
                      value === option
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 shadow-sm"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white"
                    }
                  `}
                >
                  <span className="text-base font-medium">{option}</span>
                  {value === option && <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )

      case "multi_select":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto space-y-6"
          >
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white text-center"
            >
              {question.label}
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(question.options || []).map((option) => {
                const selected = Array.isArray(value) && value.includes(option)
                return (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const currentValues = Array.isArray(value) ? value : []
                      const newValues = selected
                        ? currentValues.filter((v) => v !== option)
                        : [...currentValues, option]
                      onResponse(question.id, newValues)
                    }}
                    className={`
                      p-4 text-left rounded-xl border-2 transition-all duration-200
                      min-h-[56px] flex items-center justify-between
                      ${
                        selected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white"
                      }
                    `}
                  >
                    <span className="text-base font-medium">{option}</span>
                    {selected && <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  </motion.button>
                )
              })}
            </div>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              {Array.isArray(value) ? value.length : 0} selected
            </div>
          </motion.div>
        )

      case "textarea":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto space-y-6"
          >
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white text-center leading-relaxed px-2"
            >
              {question.label}
            </motion.h2>
            <Textarea
              value={value || ""}
              onChange={(e) => onResponse(question.id, e.target.value)}
              placeholder={question.placeholder || "Type your answer..."}
              className="min-h-32 text-base p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 resize-none"
            />
          </motion.div>
        )

      case "text":
      case "email":
      case "number":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto space-y-6"
          >
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white text-center leading-relaxed px-2"
            >
              {question.label}
            </motion.h2>
            <Input
              type={question.type === "email" ? "email" : question.type === "number" ? "number" : "text"}
              value={value || ""}
              onChange={(e) => onResponse(question.id, e.target.value)}
              placeholder={question.placeholder || "Type your answer..."}
              className="text-lg p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500"
            />
          </motion.div>
        )

      default:
        return <div>Unsupported question type: {question.type}</div>
    }
  }

  return <div>{renderQuestion()}</div>
}
