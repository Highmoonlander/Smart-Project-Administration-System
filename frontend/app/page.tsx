"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  // Only redirect if user explicitly navigates to dashboard
  const handleDashboardClick = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="container mx-auto flex items-center justify-between px-4">
          <Link href="/">
            <h1 className="text-xl font-bold text-primary">ProjectPilot</h1>
          </Link>
          <div className="space-x-2">
            {user ? (
              <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="border-slate-200 dark:border-slate-700">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="bg-gradient-to-b from-slate-50 to-white py-20 dark:from-slate-900 dark:to-slate-950">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Manage Your Projects Efficiently
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Track issues, collaborate with your team, and deliver projects on time with our comprehensive project
              administration system.
            </p>
            <div className="mt-10">
              <Button
                size="lg"
                className="px-8 shadow-lg transition-all hover:shadow-xl"
                onClick={handleDashboardClick}
              >
                Get Started
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-slate-900 dark:text-white">Key Features</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">Issue Tracking</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Create, assign, and track issues with customizable statuses and priorities.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">Team Collaboration</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Communicate with your team in real-time through the integrated messaging system.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">Flexible Subscriptions</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Choose the plan that fits your needs, from free to enterprise-level features.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Ready to streamline your project management?
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Join thousands of teams that use our platform to deliver projects on time and within budget.
              </p>
              <div className="mt-8">
                <Button
                  size="lg"
                  className="px-8 shadow-lg transition-all hover:shadow-xl"
                  onClick={handleDashboardClick}
                >
                  Start Now — It's Free
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-slate-600 dark:text-slate-400">&copy; 2023 Project Admin System. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary">
                Terms
              </a>
              <a href="#" className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary">
                Privacy
              </a>
              <a href="#" className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
