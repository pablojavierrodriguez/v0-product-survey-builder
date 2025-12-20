"use client"

import type React from "react"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  ArrowLeft,
  Eye,
  Type,
  ListChecks,
  CheckSquare,
  Mail,
  DollarSign,
  Hash,
} from "lucide-react"
import type { Survey, SurveyQuestion } from "@/lib/types/survey"
import { Switch } from "@/components/ui/switch"

const QUESTION_TYPES = [
  { value: "single_choice", label: "Single Choice", icon: CheckSquare },
  { value: "multi_select", label: "Multiple Select", icon: ListChecks },
  { value: "textarea", label: "Long Text", icon: Type },
  { value: "text", label: "Short Text", icon: Type },
  { value: "email", label: "Email", icon: Mail },
  { value: "number", label: "Number", icon: Hash },
  { value: "salary_range", label: "Salary Range", icon: DollarSign },
]

export default function EditSurveyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [questions, setQuestions] = useState<SurveyQuestion[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [slug, setSlug] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    fetchSurvey()
  }, [resolvedParams.id])

  const fetchSurvey = async () => {
    try {
      const response = await fetch(`/api/admin/surveys/${resolvedParams.id}`)
      if (!response.ok) throw new Error("Failed to fetch survey")
      const data = await response.json()
      setSurvey(data)
      setTitle(data.title)
      setDescription(data.description || "")
      setSlug(data.slug)
      setQuestions(data.config?.questions || [])
    } catch (error) {
      console.error("Error fetching survey:", error)
    } finally {
      setLoading(false)
    }
  }

  const addQuestion = () => {
    const newQuestion: SurveyQuestion = {
      id: `q_${Date.now()}`,
      type: "single_choice",
      label: "New Question",
      required: true,
      options: ["Option 1", "Option 2"],
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (index: number, updates: Partial<SurveyQuestion>) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], ...updates }
    setQuestions(newQuestions)
  }

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions]
    const options = newQuestions[questionIndex].options || []
    newQuestions[questionIndex].options = [...options, `Option ${options.length + 1}`]
    setQuestions(newQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions]
    const options = [...(newQuestions[questionIndex].options || [])]
    options[optionIndex] = value
    newQuestions[questionIndex].options = options
    setQuestions(newQuestions)
  }

  const deleteOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions]
    const options = newQuestions[questionIndex].options || []
    newQuestions[questionIndex].options = options.filter((_, i) => i !== optionIndex)
    setQuestions(newQuestions)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newQuestions = [...questions]
    const draggedQuestion = newQuestions[draggedIndex]
    newQuestions.splice(draggedIndex, 1)
    newQuestions.splice(index, 0, draggedQuestion)
    setQuestions(newQuestions)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const saveSurvey = async () => {
    setSaving(true)
    try {
      const updatedConfig = {
        ...survey?.config,
        questions,
      }

      const response = await fetch(`/api/admin/surveys/${resolvedParams.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          slug,
          config: updatedConfig,
        }),
      })

      if (!response.ok) throw new Error("Failed to save survey")

      router.push("/admin/surveys")
    } catch (error) {
      console.error("Error saving survey:", error)
      alert("Failed to save survey")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading survey...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Survey</h1>
              <p className="text-gray-600 dark:text-gray-400">Configure questions and settings</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/survey/${slug}`)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={saveSurvey} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Survey Information</CardTitle>
            <CardDescription>Basic details about your survey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product Manager Survey 2024"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                placeholder="product-manager-survey"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A comprehensive survey for product managers..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Questions</CardTitle>
                <CardDescription>Drag to reorder, click to edit</CardDescription>
              </div>
              <Button onClick={addQuestion} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No questions yet</p>
                <Button onClick={addQuestion} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Question
                </Button>
              </div>
            ) : (
              questions.map((question, qIndex) => (
                <Card
                  key={question.id}
                  draggable
                  onDragStart={() => handleDragStart(qIndex)}
                  onDragOver={(e) => handleDragOver(e, qIndex)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-move transition-all ${draggedIndex === qIndex ? "opacity-50" : ""}`}
                >
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <GripVertical className="w-5 h-5 text-gray-400 mt-2 flex-shrink-0" />
                      <div className="flex-1 space-y-4">
                        {/* Question Label */}
                        <div className="flex items-start gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Q{qIndex + 1}</Badge>
                              <Select
                                value={question.type}
                                onValueChange={(value: any) => updateQuestion(qIndex, { type: value })}
                              >
                                <SelectTrigger className="w-48">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {QUESTION_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      <div className="flex items-center gap-2">
                                        <type.icon className="w-4 h-4" />
                                        {type.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Input
                              value={question.label}
                              onChange={(e) => updateQuestion(qIndex, { label: e.target.value })}
                              placeholder="Question text"
                              className="font-medium"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteQuestion(qIndex)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Options (for single_choice and multi_select) */}
                        {(question.type === "single_choice" || question.type === "multi_select") && (
                          <div className="space-y-2 ml-8">
                            <Label className="text-sm text-gray-600">Options</Label>
                            {(question.options || []).map((option, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-2">
                                <Input
                                  value={option}
                                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                  placeholder={`Option ${oIndex + 1}`}
                                  className="flex-1"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteOption(qIndex, oIndex)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={() => addOption(qIndex)}>
                              <Plus className="w-3 h-3 mr-2" />
                              Add Option
                            </Button>
                          </div>
                        )}

                        {/* Placeholder (for text inputs) */}
                        {(question.type === "text" ||
                          question.type === "textarea" ||
                          question.type === "email" ||
                          question.type === "number") && (
                          <div className="ml-8 space-y-2">
                            <Label className="text-sm text-gray-600">Placeholder</Label>
                            <Input
                              value={question.placeholder || ""}
                              onChange={(e) => updateQuestion(qIndex, { placeholder: e.target.value })}
                              placeholder="Enter placeholder text..."
                            />
                          </div>
                        )}

                        {/* Required Toggle */}
                        <div className="ml-8 flex items-center gap-2">
                          <Switch
                            checked={question.required}
                            onCheckedChange={(checked) => updateQuestion(qIndex, { required: checked })}
                          />
                          <Label className="text-sm text-gray-600">Required question</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
