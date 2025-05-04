"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { projectsAPI } from "@/lib/api-client"
import MainLayout from "@/components/layout/main-layout"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, Trash2, Plus, Edit, Users, FileText } from "lucide-react"

interface Project {
  id: number
  name: string
  description: string
  category: string
  tags: string[]
  owner: {
    id: number
    fullName: string
    email: string
  }
  team: {
    id: number
    fullName: string
    email: string
  }[]
  issues: {
    id: number
    title: string
    status: string
    priority: string
  }[]
}

interface User {
  id: number
  fullName: string
  email: string
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [removeUserDialogOpen, setRemoveUserDialogOpen] = useState(false)
  const [removeUserId, setRemoveUserId] = useState<number | null>(null)
  const [removeUserLoading, setRemoveUserLoading] = useState(false)
  const [availableUsers, setAvailableUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [addUserLoading, setAddUserLoading] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return

      try {
        setLoading(true)
        const projectData = await projectsAPI.getProject(Number(id))
        setProject(projectData)

        // In a real app, you would fetch available users from an API endpoint
        // For now, we'll use a placeholder with the current user
        if (user) {
          setAvailableUsers([
            {
              id: user.id + 100, // Just to make it different from the current user
              fullName: "Available User",
              email: "available@example.com",
            },
          ])
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch project details")
        toast({
          title: "Error",
          description: err.message || "Failed to fetch project details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id, user])

  const handleDeleteProject = async () => {
    if (!project) return

    setDeleteLoading(true)
    try {
      await projectsAPI.deleteProject(project.id)
      setDeleteDialogOpen(false)
      toast({
        title: "Project Deleted",
        description: "The project has been deleted successfully",
      })
      router.push("/projects")
    } catch (err: any) {
      setError(err.message || "Failed to delete project")
      toast({
        title: "Error",
        description: err.message || "Failed to delete project",
        variant: "destructive",
      })
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleRemoveUser = async () => {
    if (!project || !removeUserId) return

    setRemoveUserLoading(true)
    try {
      await projectsAPI.removeUserFromProject(project.id, removeUserId)

      // Update the project state
      setProject({
        ...project,
        team: project.team.filter((member) => member.id !== removeUserId),
      })

      setRemoveUserDialogOpen(false)
      setRemoveUserId(null)
      toast({
        title: "Team Member Removed",
        description: "The team member has been removed from the project",
      })
    } catch (err: any) {
      setError(err.message || "Failed to remove user")
      toast({
        title: "Error",
        description: err.message || "Failed to remove user",
        variant: "destructive",
      })
    } finally {
      setRemoveUserLoading(false)
    }
  }

  const handleAddUser = async () => {
    if (!project || !selectedUserId) return

    setAddUserLoading(true)
    try {
      const userId = Number(selectedUserId)
      await projectsAPI.addUserToProject(project.id, userId)

      // Update the project state
      const userToAdd = availableUsers.find((user) => user.id === userId)
      if (userToAdd) {
        setProject({
          ...project,
          team: [...project.team, userToAdd],
        })
        setAvailableUsers(availableUsers.filter((user) => user.id !== userId))
        setSelectedUserId("")
        toast({
          title: "Team Member Added",
          description: "The team member has been added to the project",
        })
      }
    } catch (err: any) {
      setError(err.message || "Failed to add user")
      toast({
        title: "Error",
        description: err.message || "Failed to add user",
        variant: "destructive",
      })
    } finally {
      setAddUserLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-emerald-100 text-emerald-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-rose-100 text-rose-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "low":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-slate-100 text-slate-800"
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

  if (error) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-rose-500" />
              <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">Error</h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400">{error}</p>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  if (!project) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
              <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">Project Not Found</h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400">The requested project could not be found.</p>
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
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{project.name}</h1>
                <Badge variant="outline" className="ml-2">
                  #{project.id}
                </Badge>
              </div>
              <p className="mt-1 text-slate-500 dark:text-slate-400">{project.category}</p>
            </div>
            <div className="flex space-x-2">
              <Link href={`/projects/${project.id}/edit`}>
                <Button variant="outline" className="border-slate-200 transition-all duration-200 hover:bg-slate-100">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Project
                </Button>
              </Link>
              <Link href={`/issues/new?projectId=${project.id}`}>
                <Button className="transition-all duration-200 hover:shadow">
                  <Plus className="mr-2 h-4 w-4" />
                  New Issue
                </Button>
              </Link>
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

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start border-b bg-transparent p-0 dark:border-slate-800">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:text-slate-400 dark:data-[state=active]:text-primary-foreground"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="issues"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:text-slate-400 dark:data-[state=active]:text-primary-foreground"
              >
                Issues
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:text-slate-400 dark:data-[state=active]:text-primary-foreground"
              >
                Team
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 pt-6">
              <Card className="border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <CardHeader className="bg-slate-50 pb-3 dark:bg-slate-900/50">
                  <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{project.description}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                  <CardHeader className="bg-slate-50 pb-3 dark:bg-slate-900/50">
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
                      <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Team</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {project.team.slice(0, 5).map((member) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700">
                              <AvatarFallback className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                                {member.fullName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-800 dark:text-slate-200">{member.fullName}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{member.email}</p>
                            </div>
                          </div>
                          {member.id === project.owner.id && (
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              Owner
                            </Badge>
                          )}
                        </div>
                      ))}

                      {project.team.length > 5 && (
                        <div className="text-center">
                          <Button variant="link" asChild className="text-primary dark:text-primary-foreground">
                            <Link href="#team">View all team members</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                  <CardHeader className="bg-slate-50 pb-3 dark:bg-slate-900/50">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
                      <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Issues</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {project.issues.slice(0, 5).map((issue) => (
                        <Link key={issue.id} href={`/issues/${issue.id}`}>
                          <div className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-3 transition-all duration-200 hover:bg-slate-50 hover:shadow-sm dark:border-slate-700 dark:hover:bg-slate-800">
                            <p className="font-medium text-slate-800 dark:text-slate-200">{issue.title}</p>
                            <div className="flex space-x-2">
                              <Badge className={`${getStatusColor(issue.status)} dark:bg-opacity-20`}>
                                {issue.status}
                              </Badge>
                              <Badge className={`${getPriorityColor(issue.priority)} dark:bg-opacity-20`}>
                                {issue.priority}
                              </Badge>
                            </div>
                          </div>
                        </Link>
                      ))}

                      {project.issues.length > 5 && (
                        <div className="text-center">
                          <Button variant="link" asChild className="text-primary dark:text-primary-foreground">
                            <Link href="#issues">View all issues</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="issues" className="pt-6">
              <Card className="border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <CardHeader className="flex flex-row items-center justify-between bg-slate-50 pb-3 dark:bg-slate-900/50">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-slate-500" />
                    <CardTitle className="text-lg font-semibold text-slate-800">All Issues</CardTitle>
                  </div>
                  <Link href={`/issues/new?projectId=${project.id}`}>
                    <Button size="sm" className="transition-all duration-200 hover:shadow">
                      <Plus className="mr-2 h-4 w-4" />
                      New Issue
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="pt-4">
                  {project.issues.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/50">
                      <p className="text-slate-500 dark:text-slate-400">No issues found for this project.</p>
                      <Link href={`/issues/new?projectId=${project.id}`} className="mt-4 inline-block">
                        <Button variant="outline" size="sm" className="mt-2 border-slate-200 dark:border-slate-700">
                          Create your first issue
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {project.issues.map((issue) => (
                        <Link key={issue.id} href={`/issues/${issue.id}`}>
                          <div className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-4 transition-all duration-200 hover:bg-slate-50 hover:shadow-sm dark:border-slate-700 dark:hover:bg-slate-800">
                            <div>
                              <h3 className="font-medium text-slate-800 dark:text-slate-200">{issue.title}</h3>
                              <p className="text-sm text-slate-500">Issue #{issue.id}</p>
                            </div>
                            <div className="flex space-x-2">
                              {issue.status && <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>}
                              {issue.priority && (
                                <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="pt-6">
              <Card className="border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <CardHeader className="flex flex-row items-center justify-between bg-slate-50 pb-3 dark:bg-slate-900/50">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-slate-500" />
                    <CardTitle className="text-lg font-semibold text-slate-800">Team Members</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                      <SelectTrigger className="w-[200px] border-slate-200 dark:border-slate-700 dark:bg-slate-900">
                        <SelectValue placeholder="Add team member" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-900 dark:border-slate-700">
                        {availableUsers.map((user) => (
                          <SelectItem key={user.id} value={String(user.id)}>
                            {user.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      disabled={!selectedUserId || addUserLoading}
                      onClick={handleAddUser}
                      className="transition-all duration-200 hover:shadow"
                    >
                      {addUserLoading ? <LoadingSpinner /> : "Add"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {project.team.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                      <p className="text-slate-500">No team members found for this project.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {project.team.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition-all duration-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
                              <AvatarFallback className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                                {member.fullName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-800 dark:text-slate-200">{member.fullName}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {member.id === project.owner.id ? (
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                Owner
                              </Badge>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:text-slate-500 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
                                onClick={() => {
                                  setRemoveUserId(member.id)
                                  setRemoveUserDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <ConfirmationDialog
          title="Delete Project"
          description="Are you sure you want to delete this project? All associated issues and data will be permanently removed. This action cannot be undone."
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteProject}
          isLoading={deleteLoading}
        />

        <ConfirmationDialog
          title="Remove Team Member"
          description="Are you sure you want to remove this team member from the project?"
          open={removeUserDialogOpen}
          onOpenChange={setRemoveUserDialogOpen}
          onConfirm={handleRemoveUser}
          isLoading={removeUserLoading}
        />
      </MainLayout>
    </ProtectedRoute>
  )
}
