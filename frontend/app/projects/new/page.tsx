"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { projectsAPI } from "@/lib/api-client"
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
import { FolderKanban } from "lucide-react"

export default function NewProjectPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    tags: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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
    setLoading(true)

    try {
      // Convert tags string to array
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)

      const projectData = {
        ...formData,
        tags: tagsArray,
        ownerId: user?.id,
      }

      const newProject = await projectsAPI.createProject(projectData)
      toast({
        title: "Project Created",
        description: "Your new project has been created successfully",
      })
      router.push(`/projects/${newProject.id}`)
    } catch (err: any) {
      setError(err.message || "Failed to create project")
      toast({
        title: "Error",
        description: err.message || "Failed to create project",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-primary/10 p-2 dark:bg-primary/20">
              <FolderKanban className="h-6 w-6 text-primary dark:text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Create New Project</h1>
          </div>

          <Card className="border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="bg-slate-50 pb-3 dark:bg-slate-900/50">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {error && (
                <Alert variant="destructive" className="mb-6 dark:bg-rose-950 dark:border-rose-900 dark:text-rose-300">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Project Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter project name"
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
                    placeholder="Describe the project in detail"
                    rows={5}
                    className="border-slate-200 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger className="border-slate-200 dark:border-slate-700 dark:bg-slate-900">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-900 dark:border-slate-700">
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                      <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                      <SelectItem value="DevOps">DevOps</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
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
                    placeholder="frontend, design, api"
                    className="border-slate-200 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                    className="border-slate-200 transition-all duration-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="transition-all duration-200 hover:shadow">
                    {loading ? <LoadingSpinner /> : "Create Project"}
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
