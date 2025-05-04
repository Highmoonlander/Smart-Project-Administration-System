"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { issuesAPI } from "@/lib/api-client"
import MainLayout from "@/components/layout/main-layout"
import ProtectedRoute from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { CheckCircle, AlertCircle, Clock, ArrowUpCircle, BarChart3, FolderKanban } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

interface Issue {
  id: number
  title: string
  status: string | null
  priority: string | null
  projectID: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchIssues = async () => {
      if (!user) return

      try {
        // For demo purposes, we're fetching issues for project ID 1
        // In a real app, you'd fetch the user's projects first
        const projectId = 1
        const data = await issuesAPI.getProjectIssues(projectId)
        setIssues(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch issues")
        toast({
          title: "Error",
          description: err.message || "Failed to fetch issues",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchIssues()
  }, [user])

  const getStatusIcon = (status: string | null) => {
    if (!status) return <AlertCircle className="h-5 w-5 text-slate-500 dark:text-slate-400" />

    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
      case "in progress":
        return <Clock className="h-5 w-5 text-blue-500 dark:text-blue-400" />
      case "high priority":
        return <ArrowUpCircle className="h-5 w-5 text-rose-500 dark:text-rose-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-slate-500 dark:text-slate-400" />
    }
  }

  const getPriorityColor = (priority: string | null) => {
    if (!priority) return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"

    switch (priority.toLowerCase()) {
      case "high":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "low":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  const getStatusColor = (status: string | null) => {
    if (!status) return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"

    switch (status.toLowerCase()) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
      case "in progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  // Count issues by status, handling null/undefined values
  const completedIssues = issues.filter((issue) => issue.status?.toLowerCase() === "completed").length
  const inProgressIssues = issues.filter((issue) => issue.status?.toLowerCase() === "in progress").length
  const pendingIssues = issues.filter((issue) => issue.status?.toLowerCase() === "pending").length

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400">Welcome back, {user?.fullName}</p>
            </div>
            <div className="flex space-x-2">
              <Link href="/projects/new">
                <Button className="shadow-sm hover:shadow">
                  <FolderKanban className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </Link>
              <Link href="/issues/new">
                <Button variant="outline" className="border-slate-200 shadow-sm hover:shadow dark:border-slate-700">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  New Issue
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all dark:border-slate-700 dark:bg-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-primary/10 p-2 dark:bg-primary/20">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{issues.length}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all dark:border-slate-700 dark:bg-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/20">
                    <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{completedIssues}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all dark:border-slate-700 dark:bg-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-blue-100 p-2 dark:bg-blue-900/20">
                    <Clock className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{inProgressIssues}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all dark:border-slate-700 dark:bg-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-amber-100 p-2 dark:bg-amber-900/20">
                    <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{pendingIssues}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all dark:border-slate-700 dark:bg-slate-800">
            <CardHeader className="border-b border-slate-200 dark:border-slate-700">
              <CardTitle className="text-slate-900 dark:text-white">Recent Issues</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              ) : issues.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
                  <AlertCircle className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                  <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">No issues found</h3>
                  <p className="mt-1 text-slate-500 dark:text-slate-400">Create your first issue to get started</p>
                  <Link href="/issues/new" className="mt-4 inline-block">
                    <Button>Create Issue</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {issues.slice(0, 5).map((issue) => (
                    <Link key={issue.id} href={`/issues/${issue.id}`}>
                      <div className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(issue.status)}
                          <div>
                            <h3 className="font-medium text-slate-900 dark:text-white">{issue.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Issue #{issue.id}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className={getStatusColor(issue.status)}>{issue.status || "Unknown"}</Badge>
                          <Badge className={getPriorityColor(issue.priority)}>{issue.priority || "Unknown"}</Badge>
                        </div>
                      </div>
                    </Link>
                  ))}

                  {issues.length > 5 && (
                    <div className="text-center">
                      <Link href="/issues">
                        <Button variant="outline" className="border-slate-200 dark:border-slate-700">
                          View All Issues
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
