"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { authAPI } from "@/lib/api-client"
import MainLayout from "@/components/layout/main-layout"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { toast } from "@/lib/toast"

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    projectSize: 0,
  })

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        projectSize: user.projectSize || 0,
      })
    }
  }, [user])

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "projectSize" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      // Call the API to update the user profile
      await authAPI.updateProfile({
        fullName: formData.fullName,
        projectSize: formData.projectSize,
      })

      // Refresh user data
      await refreshUser()

      setSuccess("Profile updated successfully!")
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
      toast({
        title: "Error",
        description: err.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Profile</h1>

          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="projectSize" className="text-sm font-medium">
                    Project Size (Max number of projects)
                  </label>
                  <Input
                    id="projectSize"
                    name="projectSize"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.projectSize}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? <LoadingSpinner /> : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
