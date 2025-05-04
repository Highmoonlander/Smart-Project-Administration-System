import { jwtDecode } from "jwt-decode"

// Base API URL
const API_BASE_URL = "http://localhost:8080"

// Token management
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}

const isTokenExpired = (token: string) => {
  try {
    const decoded: any = jwtDecode(token)
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch (error) {
    return true
  }
}

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const config: RequestInit = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401) {
        removeToken()
        window.location.href = "/login"
        throw new Error("Session expired. Please login again.")
      }

      const errorData = await response.json()
      throw new Error(errorData.message || "API request failed")
    }

    return await response.json()
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// Auth API
export const authAPI = {
  signup: async (userData: any) => {
    const response = await apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    })

    if (response.jwt) {
      setToken(response.jwt)
    }

    return response
  },

  login: async (credentials: any) => {
    const response = await apiRequest("/auth/signin", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    if (response.jwt) {
      setToken(response.jwt)
    }

    return response
  },

  logout: () => {
    removeToken()
  },

  isAuthenticated: () => {
    const token = getToken()
    return !!token && !isTokenExpired(token)
  },

  getProfile: async () => {
    try {
      return await apiRequest("/api/users/profile")
    } catch (error) {
      // For demo purposes, try to get the profile from local storage
      if (typeof window !== "undefined") {
        const storedUserData = localStorage.getItem("user_data")
        if (storedUserData) {
          return JSON.parse(storedUserData)
        }
      }
      throw error
    }
  },

  updateProfile: async (profileData: any) => {
    const response = await apiRequest("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })

    // For demo purposes, also update the local storage
    if (typeof window !== "undefined") {
      const storedUserData = localStorage.getItem("user_data")
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData)
          const updatedUserData = { ...parsedUserData, ...profileData }
          localStorage.setItem("user_data", JSON.stringify(updatedUserData))
        } catch (error) {
          console.error("Failed to update stored user data:", error)
        }
      }
    }

    return response
  },
}

// Issues API
export const issuesAPI = {
  getIssue: async (issueId: number) => {
    return await apiRequest(`/api/issues/${issueId}`)
  },

  getProjectIssues: async (projectId: number) => {
    return await apiRequest(`/api/issues/projects/${projectId}`)
  },

  createIssue: async (issueData: any) => {
    return await apiRequest("/api/issues", {
      method: "POST",
      body: JSON.stringify(issueData),
    })
  },

  updateIssueStatus: async (issueId: number, status: string) => {
    return await apiRequest(`/api/issues/${issueId}/status/${status}`, {
      method: "PUT",
    })
  },

  assignUser: async (issueId: number, userId: number) => {
    return await apiRequest(`/api/issues/${issueId}/assignee/${userId}`, {
      method: "POST",
    })
  },

  deleteIssue: async (issueId: number) => {
    return await apiRequest(`/api/issues/${issueId}`, {
      method: "DELETE",
    })
  },
}

// Comments API
export const commentsAPI = {
  getIssueComments: async (issueId: number) => {
    return await apiRequest(`/api/comments/${issueId}`)
  },

  createComment: async (commentData: any) => {
    return await apiRequest("/api/comments", {
      method: "POST",
      body: JSON.stringify(commentData),
    })
  },

  deleteComment: async (commentId: number) => {
    return await apiRequest(`/api/comments/${commentId}`, {
      method: "DELETE",
    })
  },
}

// Messages API
export const messagesAPI = {
  getChatMessages: async (projectId: number) => {
    return await apiRequest(`/api/messages/chat/${projectId}`)
  },

  sendMessage: async (messageData: any) => {
    return await apiRequest("/api/messages/send", {
      method: "POST",
      body: JSON.stringify(messageData),
    })
  },
}

// Subscription API
export const subscriptionAPI = {
  getUserSubscription: async () => {
    return await apiRequest("/api/subscriptions/user")
  },

  updateSubscription: async (planType: "FREE" | "MONTHLY" | "ANNUALLY") => {
    return await apiRequest(`/api/subscriptions/update?planType=${planType}`, {
      method: "PATCH",
    })
  },

  createPaymentLink: async (planType: "FREE" | "MONTHLY" | "ANNUALLY") => {
    return await apiRequest(`/api/payment/${planType}`, {
      method: "POST",
    })
  },
}

// Projects API
export const projectsAPI = {
  getProjects: async () => {
    // This endpoint isn't in the OpenAPI spec, but we'll simulate it
    // In a real app, you'd have an endpoint to fetch all projects
    return await apiRequest("/api/projects")
  },

  getProject: async (projectId: number) => {
    // This endpoint isn't in the OpenAPI spec, but we'll simulate it
    // In a real app, you'd have an endpoint to fetch a specific project
    return await apiRequest(`/api/projects/${projectId}`)
  },

  createProject: async (projectData: any) => {
    // This endpoint isn't in the OpenAPI spec, but we'll simulate it
    // In a real app, you'd have an endpoint to create a project
    return await apiRequest("/api/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    })
  },

  updateProject: async (projectId: number, projectData: any) => {
    // This endpoint isn't in the OpenAPI spec, but we'll simulate it
    // In a real app, you'd have an endpoint to update a project
    return await apiRequest(`/api/projects/${projectId}`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    })
  },

  deleteProject: async (projectId: number) => {
    // This endpoint isn't in the OpenAPI spec, but we'll simulate it
    // In a real app, you'd have an endpoint to delete a project
    return await apiRequest(`/api/projects/${projectId}`, {
      method: "DELETE",
    })
  },

  addUserToProject: async (projectId: number, userId: number) => {
    // This endpoint isn't in the OpenAPI spec, but we'll simulate it
    // In a real app, you'd have an endpoint to add a user to a project
    return await apiRequest(`/api/projects/${projectId}/users/${userId}`, {
      method: "POST",
    })
  },

  removeUserFromProject: async (projectId: number, userId: number) => {
    // This endpoint isn't in the OpenAPI spec, but we'll simulate it
    // In a real app, you'd have an endpoint to remove a user from a project
    return await apiRequest(`/api/projects/${projectId}/users/${userId}`, {
      method: "DELETE",
    })
  },
}
