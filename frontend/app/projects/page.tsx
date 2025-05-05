"use client"

import { useEffect, useState } from "react"
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
import { Plus, Trash2, Users, FileText, FolderKanban, Search, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast } from "@/lib/toast"

interface Project {
  id: number
  name: string
  description: string | null
  category: string
  tags: string[]
  owner: {
    id: number
    fullName: string
  }
  team: {
    id: number
    fullName: string
  }[]
  issues: {
    id: number
    title: string
  }[]
}

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return

      try {
        setLoading(true)
        const data = await projectsAPI.getProjects()
        setProjects(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch projects")
        toast({
          title: "Error",
          description: err.message || "Failed to fetch projects",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [user])

  const handleDeleteProject = async () => {
    if (!deleteProjectId) return

    setDeleteLoading(true)
    try {
      await projectsAPI.deleteProject(deleteProjectId)
      setProjects(projects.filter((project) => project.id !== deleteProjectId))
      setDeleteDialogOpen(false)
      setDeleteProjectId(null)
      toast({
        title: "Project Deleted",
        description: "The project has been deleted successfully",
      })
    } catch (err: any) {
      setError(err.message || "Failed to delete project")
      toast({
        title: "Error",
        description: err.message || "Failed to delete project",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Projects</h1>
              <p className="mt-1 text-slate-500 dark:text-slate-400">Manage and organize your projects</p>
            </div>
            <Link href="/projects/new">
              <Button className="transition-all duration-200 hover:shadow">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </Link>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 dark:bg-slate-900 dark:border-slate-700"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <Card className="border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950">
              <CardContent className="flex items-center justify-center p-6 text-rose-800 dark:text-rose-300">
                <AlertCircle className="mr-2 h-5 w-5" />
                {error}
              </CardContent>
            </Card>
          ) : filteredProjects.length === 0 ? (
            <Card className="border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FolderKanban className="h-16 w-16 text-slate-300" />
                <h3 className="mt-4 text-xl font-semibold text-slate-800">No Projects Found</h3>
                {searchQuery ? (
                  <p className="mt-2 text-slate-500">No projects match your search criteria</p>
                ) : (
                  <p className="mt-2 text-slate-500">Create your first project to get started</p>
                )}
                {!searchQuery && (
                  <Link href="/projects/new" className="mt-4">
                    <Button className="transition-all duration-200 hover:shadow">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Project
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="overflow-hidden border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <CardHeader className="bg-slate-50 pb-3 dark:bg-slate-900/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                          {project.name}
                        </CardTitle>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{project.category}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:text-slate-500 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
                        onClick={() => {
                          setDeleteProjectId(project.id)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 dark:bg-slate-900">
                    <p className="line-clamp-2 text-sm text-slate-700 dark:text-slate-300">
                      {project.description || "No description provided"}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tags?.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center">
                        <Users className="mr-1.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <span>{project.team?.length || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="mr-1.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <span>{project.issues?.length || 0}</span>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <Link href={`/projects/${project.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-200 transition-all duration-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/issues?projectId=${project.id}`}>
                        <Button size="sm" className="transition-all duration-200 hover:shadow">
                          View Issues
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <ConfirmationDialog
          title="Delete Project"
          description="Are you sure you want to delete this project? All associated issues and data will be permanently removed. This action cannot be undone."
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteProject}
          isLoading={deleteLoading}
        />
      </MainLayout>
    </ProtectedRoute>
  )
}
