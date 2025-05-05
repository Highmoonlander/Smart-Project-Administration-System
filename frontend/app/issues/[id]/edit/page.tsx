"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { issuesAPI } from "@/lib/api-client"
import MainLayout from "@/components/layout/main-layout"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { toast } from "@/lib/toast"

interface Issue {
  id: number
  title: string
  description: string | null
  status: string
  priority: string
  projectID: number
  dueDate: string | null
  tags: string[]
}

export default function EditIssuePage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: "",
    tags: "",
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchIssue = async () => {
      if (!id) return

      try {
        setLoading(true)
        const issueData = await issuesAPI.getIssue(Number(id))
        setIssue(issueData)

        // Format the date to YYYY-MM-DD for the input field
        const formattedDate = issueData.dueDate ? new Date(issueData.dueDate).toISOString().split("T")[0] : ""

        setFormData({
          title: issueData.title || "",
          description: issueData.description || "",
          status: issueData.status || "",
          priority: issueData.priority || "",
          dueDate: formattedDate,
          tags: issueData.tags ? issueData.tags.join(", ") : "",
        })
      } catch (err: any) {
        setError(err.message || "Failed to fetch issue details")
        toast({
          title: "Error",
          description: err.message || "Failed to fetch issue details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchIssue()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      // Convert tags string to array
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)

      const issueData = {
        ...issue,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate || null,
        tags: tagsArray,
      }

      // In a real app, you would have an API endpoint to update an issue
      // For now, we'll simulate it with the updateIssueStatus method
      await issuesAPI.updateIssueStatus(Number(id), formData.status)

      toast({
        title: "Issue Updated",
        description: "The issue has been updated successfully",
      })

      router.push(`/issues/${id}`)
    } catch (err: any) {
      setError(err.message || "Failed to update issue")
      toast({
        title: "Error",
        description: err.message || "Failed to update issue",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex h-full items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  if (!issue) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-bold">Issue Not Found</h2>
              <p className="mt-2 text-slate-500">The requested issue could not be found.</p>
              <Button onClick={() => router.push("/issues")} className="mt-4">
                Back to Issues
              </Button>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Edit Issue</h1>
          </div>

          <Card className="border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="bg-slate-50 pb-3 dark:bg-slate-900/50">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Issue Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {error && (
                <Alert variant="destructive" className="mb-6 dark:bg-rose-950 dark:border-rose-900 dark:text-rose-300">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Title
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Issue title"
                    className="border-slate-200 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the issue in detail"
                    rows={5}
                    className="border-slate-200 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Status
                    </label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                      <SelectTrigger className="border-slate-200 dark:border-slate-700 dark:bg-slate-900">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-900 dark:border-slate-700">
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="priority" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Priority
                    </label>
                    <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                      <SelectTrigger className="border-slate-200 dark:border-slate-700 dark:bg-slate-900">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-900 dark:border-slate-700">
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="dueDate" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Due Date
                  </label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="border-slate-200 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="tags" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Tags (comma separated)
                  </label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="bug, frontend, urgent"
                    className="border-slate-200 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={submitting}
                    className="border-slate-200 transition-all duration-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="transition-all duration-200 hover:shadow">
                    {submitting ? <LoadingSpinner /> : "Update Issue"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
