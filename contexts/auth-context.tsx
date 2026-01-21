"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiService } from "@/lib/api-service"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: "user" | "seller" | "admin"
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  demoLogin: (role: "user" | "seller" | "admin") => Promise<boolean>
  register: (email: string, password: string, password_confirmation: string, name: string, role?: "user" | "seller" | "admin") => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Check for stored user session and token
    const initializeAuth = async () => {
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if (storedToken) {
          // Verify token with 'me' endpoint
          const response = await apiService.getMe(storedToken)
          if (response.success && response.data) {
            const apiUser: any = response.data
            const userObj = apiUser.user || apiUser.data || apiUser
            const safeUser: User = {
              id: String(userObj.id || Date.now()),
              email: userObj.email,
              name: userObj.name,
              avatar: userObj.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userObj.email}`,
              role: userObj.role || "user",
              createdAt: userObj.createdAt || userObj.created_at || new Date().toISOString(),
            }
            setUser(safeUser)
            // Update stored user just in case
            localStorage.setItem("user", JSON.stringify(safeUser))
          } else {
            // Token invalid or expired
            console.warn("Stored token invalid, clearing session")
            localStorage.removeItem("token")
            localStorage.removeItem("user")
          }
        } else if (storedUser) {
          // Fallback to stored user if no token (legacy or offline) - but actually user wants token auth.
          // For now, let's respect the token flow strictly.
          try {
            const userData = JSON.parse(storedUser)
            // Force re-login if no token present
            // setUser(userData) 
          } catch {
            localStorage.removeItem("user")
          }
        }
        setIsHydrated(true)
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Login attempt:", { email })
    setIsLoading(true)

    const response = await apiService.login(email, password)

    if (response.success && response.data) {
      // Handle potential variations in API response structure
      // e.g. { access_token: "..." } or { token: "..." } or { data: { token: "..." } }
      const data: any = response.data
      const accessToken = data.access_token || data.token || data.accessToken || (data.data && (data.data.access_token || data.data.token))

      console.log("Login successful, token found:", accessToken ? "Yes" : "No")

      if (accessToken) {
        localStorage.setItem("token", accessToken)

        // Fetch full profile using token
        const meResponse = await apiService.getMe(accessToken)

        if (meResponse.success && meResponse.data) {
          const apiUser: any = meResponse.data
          const userObj = apiUser.user || apiUser.data || apiUser
          const safeUser: User = {
            id: String(userObj.id),
            email: userObj.email,
            name: userObj.name,
            avatar: userObj.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userObj.email}`,
            role: userObj.role || "user",
            createdAt: userObj.createdAt || userObj.created_at || new Date().toISOString(),
          }
          setUser(safeUser)
          localStorage.setItem("user", JSON.stringify(safeUser))
          setIsLoading(false)
          return true
        } else {
          console.error("Failed to fetch profile after login:", meResponse.error)
        }
      } else {
        console.error("Token missing in response data:", data)
      }
    }

    console.log("Login failed:", response.error)
    setIsLoading(false)
    return false
  }

  const demoLogin = async (role: "user" | "seller" | "admin"): Promise<boolean> => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const demoUsers = {
      user: {
        id: "demo-user-1",
        email: "demo.user@gamehub.com",
        name: "Demo User",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=demouser`,
        role: "user" as const,
        createdAt: new Date().toISOString(),
      },
      seller: {
        id: "demo-seller-1",
        email: "demo.seller@gamehub.com",
        name: "Demo Seller",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=demoseller`,
        role: "seller" as const,
        createdAt: new Date().toISOString(),
      },
      admin: {
        id: "demo-admin-1",
        email: "demo.admin@gamehub.com",
        name: "Demo Admin",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=demoadmin`,
        role: "admin" as const,
        createdAt: new Date().toISOString(),
      },
    }

    const mockUser = demoUsers[role]
    setUser(mockUser)
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(mockUser))
      // Demo doesn't have a real token
    }
    setIsLoading(false)
    return true
  }

  const register = async (
    email: string,
    password: string,
    password_confirmation: string,
    name: string,
    role: "user" | "seller" | "admin" = "user",
  ): Promise<boolean> => {
    setIsLoading(true)

    const response = await apiService.register(email, password, password_confirmation, name, role)

    if (response.success) {
      console.log("Registration successful")
      // No auto-login as per request
      setIsLoading(false)
      return true
    }

    console.log("Registration failed:", response.error)
    setIsLoading(false)
    return false
  }

  const logout = async () => {
    console.log("Logout called")
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    if (token) {
      try {
        await apiService.logout(token)
        console.log("Logged out from API")
      } catch (error) {
        console.error("Logout API failed", error)
      }
    }

    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      console.log("User and token removed from localStorage")
    }
  }

  return <AuthContext.Provider value={{ user, login, demoLogin, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
