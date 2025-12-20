"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function NewSurveyPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [slug, setSlug] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTitleChange = (value: string) => {
    setTitle(value)
    // Auto-generate slug from title
    const generatedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
    setSlug(generatedSlug)
  }

  const createSurvey = async () => {
    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required")
      return
    }

    setSaving(true)
    setError(null)

    try {
      // Create default survey config with one sample question
      const defaultConfig = {
        questions: [
          {
            id: "q_1",
            type: "single_choice",
            label: "Sample Question",
            required: true,
            options: ["Option 1", "Option 2", "Option 3"],
          },
        ],
        styling: {
          primaryColor: "#3b82f6",
          theme: "gradient",
        },
        settings: {
          allowMultipleResponses: false,
          showProgressBar: true,
          autoAdvance: true,
          thankYouMessage: "Thank you for completing the survey!",
        },
      }

      const response = await fetch("/api/admin/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          slug,
          config: defaultConfig,
          is_active: isActive,
          is_published: isPublished,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create survey")
      }

      const data = await response.json()
      // Redirect to edit page to configure questions
      router.push(`/admin/surveys/${data.survey.id}/edit`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create survey")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Survey</h1>
            <p className="text-gray-600 dark:text-gray-400">Set up basic information for your survey</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Survey Details</CardTitle>
            <CardDescription>Provide basic information about your survey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Survey Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Product Manager Survey 2024"
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">/survey/</span>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="product-manager-survey"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This will be the URL where your survey is accessible
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A comprehensive survey for product managers to understand their challenges and needs..."
                rows={4}
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active">Active</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Only active surveys can receive responses</p>
                </div>
                <Switch id="is_active" checked={isActive} onCheckedChange={setIsActive} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_published">Published</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Published surveys appear in the public survey list
                  </p>
                </div>
                <Switch id="is_published" checked={isPublished} onCheckedChange={setIsPublished} />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={createSurvey} disabled={saving || !title.trim() || !slug.trim()} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Creating..." : "Create Survey"}
              </Button>
              <Button variant="outline" onClick={() => router.back()} disabled={saving}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
