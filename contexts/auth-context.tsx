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
    // Check for stored user session
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          // Ensure existing users have a role (backward compatibility)
          if (!userData.role) {
            userData.role = "user"
          }
          setUser(userData)
        } catch (error) {
          console.error("Error parsing stored user:", error)
          localStorage.removeItem("user")
        }
      }
      setIsHydrated(true)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Login attempt:", { email, password: "***" })
    setIsLoading(true)

    const response = await apiService.login(email, password)

    if (response.success && response.data) {
      const apiUser = response.data
      console.log("Processing user data from API:", apiUser)

      const safeUser: User = {
        id: apiUser.id || Date.now().toString(),
        email: apiUser.email || email,
        name: apiUser.name || (apiUser.email ? apiUser.email.split("@")[0] : email.split("@")[0]),
        avatar: apiUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiUser.email || email}`,
        role: apiUser.role || "user",
        createdAt: apiUser.createdAt || new Date().toISOString(),
      }

      console.log("Login successful, setting user:", safeUser)
      setUser(safeUser)
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(safeUser))
        console.log("User saved to localStorage")
      }
      setIsLoading(false)
      return true
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

    if (response.success && response.data) {
      const apiUser = response.data
      console.log("Processing registration data from API:", apiUser)

      const safeUser: User = {
        id: apiUser.id || Date.now().toString(),
        email: apiUser.email || email,
        name: apiUser.name || name,
        avatar: apiUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        role: apiUser.role || role,
        createdAt: apiUser.createdAt || new Date().toISOString(),
      }

      setUser(safeUser)
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(safeUser))
      }
      setIsLoading(false)
      return true
    }

    console.log("Registration failed:", response.error)
    setIsLoading(false)
    return false
  }

  const logout = () => {
    console.log("Logout called")
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      console.log("User removed from localStorage")
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
