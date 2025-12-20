"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  BarChart3,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  MoreVertical,
} from "lucide-react"
import type { SurveyStats } from "@/lib/types/survey"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function SurveysManagementPage() {
  const router = useRouter()
  const [surveys, setSurveys] = useState<SurveyStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSurveys()
  }, [])

  const fetchSurveys = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/admin/surveys")
      if (!response.ok) throw new Error("Failed to fetch surveys")
      const data = await response.json()
      setSurveys(data.surveys || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load surveys")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/surveys/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      })
      if (!response.ok) throw new Error("Failed to update survey")
      await fetchSurveys()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update survey")
    }
  }

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/surveys/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !currentStatus }),
      })
      if (!response.ok) throw new Error("Failed to update survey")
      await fetchSurveys()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update survey")
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/surveys/${id}/duplicate`, {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to duplicate survey")
      await fetchSurveys()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to duplicate survey")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this survey? This action cannot be undone.")) return

    try {
      const response = await fetch(`/api/admin/surveys/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete survey")
      await fetchSurveys()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete survey")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Surveys</h1>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Surveys</h1>
          <p className="text-muted-foreground mt-1">Manage your surveys and track responses</p>
        </div>
        <Button onClick={() => router.push("/admin/surveys/new")} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Survey
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Surveys List */}
      {surveys.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No surveys yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first survey to start collecting responses
            </p>
            <Button onClick={() => router.push("/admin/surveys/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Create Survey
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {surveys.map((survey) => (
            <Card key={survey.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{survey.title}</CardTitle>
                      <Badge variant={survey.is_active ? "default" : "secondary"}>
                        {survey.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant={survey.is_published ? "default" : "outline"}>
                        {survey.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {survey.response_count} responses
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Created {new Date(survey.created_at).toLocaleDateString()}
                      </span>
                      {survey.last_response_at && (
                        <span className="flex items-center gap-1">
                          Last response {new Date(survey.last_response_at).toLocaleDateString()}
                        </span>
                      )}
                    </CardDescription>
                  </div>

                  {/* Actions Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/admin/surveys/${survey.id}`)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/admin/analytics?survey=${survey.id}`)}>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(survey.id)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleTogglePublished(survey.id, survey.is_published)}>
                        {survey.is_published ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Publish
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleActive(survey.id, survey.is_active)}>
                        {survey.is_active ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(survey.id)} className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/survey/${survey.slug}`)}
                    className="bg-transparent"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/surveys/${survey.id}`)}
                    className="bg-transparent"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/analytics?survey=${survey.id}`)}
                    className="bg-transparent"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
