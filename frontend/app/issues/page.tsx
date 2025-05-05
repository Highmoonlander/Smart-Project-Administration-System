"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { issuesAPI } from "@/lib/api-client"
import MainLayout from "@/components/layout/main-layout"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Plus } from "lucide-react"

interface Issue {
  id: number
  title: string
  description: string | null
  status: string
  priority: string
  projectID: number
  dueDate: string
  tags: string[]
}

export default function IssuesPage() {
  const { user } = useAuth()
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchIssues = async () => {
      if (!user) return

      try {
        // For demo purposes, we're fetching issues for project ID 1
        const projectId = 1
        const data = await issuesAPI.getProjectIssues(projectId)
        setIssues(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch issues")
      } finally {
        setLoading(false)
      }
    }

    fetchIssues()
  }, [user])

  const filteredIssues = issues.filter((issue) => {
    if (filter === "all") return true
    return issue.status?.toLowerCase() === filter.toLowerCase()
  })

  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-800"

    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    if (!priority) return "bg-gray-100 text-gray-800"

    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Issues</h1>
            <Link href="/issues/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Issue
              </Button>
            </Link>
          </div>

          <div className="flex space-x-2">
            <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
              All
            </Button>
            <Button variant={filter === "in progress" ? "default" : "outline"} onClick={() => setFilter("in progress")}>
              In Progress
            </Button>
            <Button variant={filter === "completed" ? "default" : "outline"} onClick={() => setFilter("completed")}>
              Completed
            </Button>
            <Button variant={filter === "pending" ? "default" : "outline"} onClick={() => setFilter("pending")}>
              Pending
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Issues</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="py-4 text-center text-red-500">{error}</div>
              ) : filteredIssues.length === 0 ? (
                <div className="py-4 text-center text-gray-500">No issues found</div>
              ) : (
                <div className="space-y-4">
                  {filteredIssues.map((issue) => (
                    <Link key={issue.id} href={`/issues/${issue.id}`}>
                      <div className="flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50">
                        <div>
                          <h3 className="font-medium">{issue.title}</h3>
                          <p className="text-sm text-gray-500">
                            {issue.description
                              ? `${issue.description.substring(0, 100)}${issue.description.length > 100 ? "..." : ""}`
                              : "No description provided"}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {issue.tags?.map((tag, index) => (
                              <Badge key={index} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getStatusColor(issue.status)}>{issue.status || "Unknown"}</Badge>
                          <Badge className={getPriorityColor(issue.priority)}>{issue.priority || "Unknown"}</Badge>
                          {issue.dueDate && (
                            <p className="text-xs text-gray-500">Due: {new Date(issue.dueDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
