"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { issuesAPI, commentsAPI } from "@/lib/api-client"
import MainLayout from "@/components/layout/main-layout"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Calendar, Tag, User, Trash2, MessageSquare, Clock, Edit } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/lib/toast"

interface Issue {
  id: number
  title: string
  description: string | null
  status: string
  priority: string
  projectID: number
  dueDate: string
  tags: string[]
  assignee: {
    id: number
    fullName: string
    email: string
  } | null
}

interface Comment {
  id: number
  content: string
  createdDateTime: string
  user: {
    id: number
    fullName: string
    email: string
  }
}

interface ProjectUser {
  id: number
  fullName: string
  email: string
}

export default function IssueDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)
  const [error, setError] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null)
  const [deleteCommentDialogOpen, setDeleteCommentDialogOpen] = useState(false)
  const [deleteCommentLoading, setDeleteCommentLoading] = useState(false)
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([])
  const [assigneeLoading, setAssigneeLoading] = useState(false)

  useEffect(() => {
    const fetchIssueAndComments = async () => {
      if (!id) return

      try {
        setLoading(true)
        const issueData = await issuesAPI.getIssue(Number(id))
        setIssue(issueData)

        const commentsData = await commentsAPI.getIssueComments(Number(id))
        setComments(commentsData)

        // In a real app, you would fetch project users from an API endpoint
        // For now, we'll use a placeholder with the current user
        if (user) {
          setProjectUsers([
            {
              id: user.id,
              fullName: user.fullName,
              email: user.email,
            },
          ])
        }
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

    fetchIssueAndComments()
  }, [id, user])

  const handleStatusChange = async (newStatus: string) => {
    if (!issue) return

    try {
      const updatedIssue = await issuesAPI.updateIssueStatus(issue.id, newStatus)
      setIssue(updatedIssue)
      toast({
        title: "Status Updated",
        description: `Issue status changed to ${newStatus.toLowerCase()}`,
      })
    } catch (err: any) {
      setError(err.message || "Failed to update issue status")
      toast({
        title: "Error",
        description: err.message || "Failed to update issue status",
        variant: "destructive",
      })
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !issue) return

    setCommentLoading(true)
    try {
      const comment = await commentsAPI.createComment({
        issueId: issue.id,
        comment: newComment,
      })

      setComments([...comments, comment])
      setNewComment("")
      toast({
        title: "Comment Added",
        description: "Your comment has been added successfully",
      })
    } catch (err: any) {
      setError(err.message || "Failed to add comment")
      toast({
        title: "Error",
        description: err.message || "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setCommentLoading(false)
    }
  }

  const handleDeleteIssue = async () => {
    if (!issue) return

    setDeleteLoading(true)
    try {
      await issuesAPI.deleteIssue(issue.id)
      setDeleteDialogOpen(false)
      toast({
        title: "Issue Deleted",
        description: "The issue has been deleted successfully",
      })
      router.push("/issues")
    } catch (err: any) {
      setError(err.message || "Failed to delete issue")
      toast({
        title: "Error",
        description: err.message || "Failed to delete issue",
        variant: "destructive",
      })
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleDeleteComment = async () => {
    if (!deleteCommentId) return

    setDeleteCommentLoading(true)
    try {
      await commentsAPI.deleteComment(deleteCommentId)
      setComments(comments.filter((comment) => comment.id !== deleteCommentId))
      setDeleteCommentDialogOpen(false)
      setDeleteCommentId(null)
      toast({
        title: "Comment Deleted",
        description: "The comment has been deleted successfully",
      })
    } catch (err: any) {
      setError(err.message || "Failed to delete comment")
      toast({
        title: "Error",
        description: err.message || "Failed to delete comment",
        variant: "destructive",
      })
    } finally {
      setDeleteCommentLoading(false)
    }
  }

  const handleAssignUser = async (userId: string) => {
    if (!issue) return

    setAssigneeLoading(true)
    try {
      // If "unassigned" is selected, we don't assign any user
      if (userId === "unassigned") {
        // In a real app, you would have an API endpoint to unassign users
        // For now, we'll just update the UI
        setIssue({
          ...issue,
          assignee: null,
        })
        toast({
          title: "User Unassigned",
          description: "The issue is now unassigned",
        })
      } else {
        const updatedIssue = await issuesAPI.assignUser(issue.id, Number(userId))
        setIssue(updatedIssue)
        toast({
          title: "User Assigned",
          description: "The user has been assigned to this issue",
        })
      }
    } catch (err: any) {
      setError(err.message || "Failed to assign user")
      toast({
        title: "Error",
        description: err.message || "Failed to assign user",
        variant: "destructive",
      })
    } finally {
      setAssigneeLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    if (!status)
      return "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"

    switch (status.toLowerCase()) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
      case "in progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
      case "pending":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50"
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
    }
  }

  const getStatusIcon = (status: string) => {
    if (!status) return <div className="mr-2 h-2 w-2 rounded-full bg-slate-500" />

    switch (status.toLowerCase()) {
      case "completed":
        return <div className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
      case "in progress":
        return <Clock className="mr-2 h-4 w-4 text-blue-500" />
      case "pending":
        return <div className="mr-2 h-2 w-2 rounded-full bg-amber-500" />
      default:
        return <div className="mr-2 h-2 w-2 rounded-full bg-slate-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    if (!priority)
      return "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"

    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50"
      case "medium":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50"
      case "low":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
    }
  }

  const getPriorityIcon = (priority: string) => {
    if (!priority) return <div className="mr-2 h-2 w-2 rounded-full bg-slate-500" />

    switch (priority?.toLowerCase()) {
      case "high":
        return <div className="mr-2 h-2 w-2 rounded-full bg-rose-500" />
      case "medium":
        return <div className="mr-2 h-2 w-2 rounded-full bg-amber-500" />
      case "low":
        return <div className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
      default:
        return <div className="mr-2 h-2 w-2 rounded-full bg-slate-500" />
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex h-full items-center justify-center">
            <LoadingSpinner />
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-rose-500" />
              <h2 className="mt-2 text-xl font-bold dark:text-slate-100">Error</h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400">{error}</p>
            </div>
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
              <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
              <h2 className="mt-2 text-xl font-bold dark:text-slate-100">Issue Not Found</h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400">The requested issue could not be found.</p>
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
          <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-bold dark:text-slate-100">{issue.title}</h1>
                <Badge variant="outline" className="ml-2">
                  #{issue.id}
                </Badge>
              </div>
              <div className="mt-2 flex items-center space-x-2 text-slate-500">
                <Badge className={getStatusColor(issue.status)}>
                  <div className="flex items-center">
                    {getStatusIcon(issue.status)}
                    {issue.status || "Unknown"}
                  </div>
                </Badge>
                <Badge className={getPriorityColor(issue.priority)}>
                  <div className="flex items-center">
                    {getPriorityIcon(issue.priority)}
                    {issue.priority || "Unknown"}
                  </div>
                </Badge>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link href={`/issues/${id}/edit`}>
                <Button variant="outline" className="transition-all duration-200">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Issue
                </Button>
              </Link>
              <Button
                variant={issue.status?.toLowerCase() === "pending" ? "default" : "outline"}
                onClick={() => handleStatusChange("PENDING")}
                className="transition-all duration-200"
              >
                Pending
              </Button>
              <Button
                variant={issue.status?.toLowerCase() === "in progress" ? "default" : "outline"}
                onClick={() => handleStatusChange("IN_PROGRESS")}
                className="transition-all duration-200"
              >
                In Progress
              </Button>
              <Button
                variant={issue.status?.toLowerCase() === "completed" ? "default" : "outline"}
                onClick={() => handleStatusChange("COMPLETED")}
                className="transition-all duration-200"
              >
                Completed
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setDeleteDialogOpen(true)}
                className="transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card className="overflow-hidden border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <CardHeader className="bg-slate-50 pb-3 dark:bg-slate-900/50">
                  <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                    {issue.description || "No description provided"}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <CardHeader className="bg-slate-50 pb-3 dark:bg-slate-900/50">
                  <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Due Date</span>
                      </div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : "Not set"}
                      </div>
                    </div>

                    <Separator className="dark:bg-slate-700" />

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <User className="mr-2 h-4 w-4" />
                        <span>Assignee</span>
                      </div>
                      <Select
                        value={issue.assignee ? String(issue.assignee.id) : "unassigned"}
                        onValueChange={handleAssignUser}
                        disabled={assigneeLoading}
                      >
                        <SelectTrigger className="w-full border-slate-200 dark:border-slate-700 dark:bg-slate-900">
                          <SelectValue placeholder="Assign to user" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-slate-900 dark:border-slate-700">
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {projectUsers.map((user) => (
                            <SelectItem key={user.id} value={String(user.id)}>
                              {user.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="dark:bg-slate-700" />

                    {issue.tags && issue.tags.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                          <Tag className="mr-2 h-4 w-4" />
                          <span>Tags</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {issue.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="bg-slate-50 pb-3 dark:bg-slate-900/50">
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Comments</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/50">
                    <p className="text-slate-500 dark:text-slate-400">No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow dark:border-slate-700 dark:bg-slate-900"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700">
                              <AvatarFallback className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                                {comment.user.fullName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-slate-800 dark:text-slate-200">
                                {comment.user.fullName}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {new Date(comment.createdDateTime).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          {user?.id === comment.user.id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:text-slate-500 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
                              onClick={() => {
                                setDeleteCommentId(comment.id)
                                setDeleteCommentDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <p className="mt-3 whitespace-pre-wrap text-slate-700 dark:text-slate-300">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="border-slate-200 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={commentLoading || !newComment.trim()}
                      className="transition-all duration-200"
                    >
                      {commentLoading ? <LoadingSpinner /> : "Add Comment"}
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        <ConfirmationDialog
          title="Delete Issue"
          description="Are you sure you want to delete this issue? This action cannot be undone."
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteIssue}
          isLoading={deleteLoading}
        />

        <ConfirmationDialog
          title="Delete Comment"
          description="Are you sure you want to delete this comment? This action cannot be undone."
          open={deleteCommentDialogOpen}
          onOpenChange={setDeleteCommentDialogOpen}
          onConfirm={handleDeleteComment}
          isLoading={deleteCommentLoading}
        />
      </MainLayout>
    </ProtectedRoute>
  )
}
