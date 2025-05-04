"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authAPI } from "@/lib/api-client"

interface User {
  id: number
  fullName: string
  email: string
  projectSize: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (userData: any) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshUser = async () => {
    try {
      if (authAPI.isAuthenticated()) {
        // Try to get user data from the API
        try {
          const userData = await authAPI.getProfile()
          setUser(userData)
        } catch (error) {
          console.error("Failed to fetch user profile from API:", error)

          // Fallback: Try to get user data from localStorage
          if (typeof window !== "undefined") {
            const storedUserData = localStorage.getItem("user_data")
            if (storedUserData) {
              try {
                const parsedUserData = JSON.parse(storedUserData)
                setUser(parsedUserData)
              } catch (parseError) {
                console.error("Failed to parse stored user data:", parseError)
                setUser(null)
              }
            } else {
              setUser(null)
            }
          } else {
            setUser(null)
          }
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Failed to refresh user:", error)
      setUser(null)
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true)
      await refreshUser()
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      await authAPI.login({ email, password })
      await refreshUser()
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData: any) => {
    setLoading(true)
    try {
      await authAPI.signup(userData)
      await refreshUser()
      router.push("/dashboard")
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authAPI.logout()
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
