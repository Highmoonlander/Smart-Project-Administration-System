"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SignupPage() {
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    projectSize: 5,
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
    setIsLoading(true)

    try {
      await signup(formData)
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <Link href="/" className="text-xl font-bold text-primary">
          Project Admin System
        </Link>
        <ThemeToggle />
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-slate-200 shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Create an account</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4 dark:bg-red-900/30 dark:border-red-900 dark:text-red-300">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="border-slate-200 focus-visible:ring-primary dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="border-slate-200 focus-visible:ring-primary dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="border-slate-200 focus-visible:ring-primary dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="projectSize" className="text-sm font-medium text-slate-700 dark:text-slate-300">
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
                  className="border-slate-200 focus-visible:ring-primary dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
              <Button type="submit" className="w-full shadow hover:shadow-md" disabled={isLoading}>
                {isLoading ? <LoadingSpinner /> : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-slate-200 pt-4 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
