// Create a new AuthProvider component to manage authentication state globally

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api } from "@/lib/api"

type User = {
  id: number
  name: string
  email: string
  is_active: boolean
  is_seller: boolean
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Function to refresh token
  const refreshToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem("hanythrift_refresh_token")
      if (!storedRefreshToken) {
        throw new Error("No refresh token found")
      }

      const data = await api.refreshToken(storedRefreshToken)
      
      // Validate the response data
      if (!data.access_token || !data.refresh_token) {
        throw new Error("Invalid token response")
      }

      localStorage.setItem("hanythrift_token", data.access_token)
      localStorage.setItem("hanythrift_refresh_token", data.refresh_token)
      api.setToken(data.access_token)

      // Update user data if available
      if (data.user_id) {
        const userData = {
          id: data.user_id,
          name: data.user_name,
          email: data.user_email,
          is_active: data.is_active,
          is_seller: data.is_seller
        }
        localStorage.setItem("hanythrift_user", JSON.stringify(userData))
        setUser(userData)
      }

      return true
    } catch (error) {
      console.error("Token refresh failed:", error)
      // Clear any invalid data
      localStorage.removeItem("hanythrift_token")
      localStorage.removeItem("hanythrift_refresh_token")
      localStorage.removeItem("hanythrift_user")
      setUser(null)
      return false
    }
  }

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Check for stored token
      const token = localStorage.getItem("hanythrift_token")
      const storedUser = localStorage.getItem("hanythrift_user")
      const refreshTokenStr = localStorage.getItem("hanythrift_refresh_token")

      if (token && storedUser && refreshTokenStr) {
        try {
          // Set the token in the API client
          api.setToken(token)
          setUser(JSON.parse(storedUser))

          // Set up token refresh
          const payload = JSON.parse(atob(token.split('.')[1]))
          const expiresIn = payload.exp * 1000 - Date.now()
          
          if (expiresIn < 300000) { // If token expires in less than 5 minutes
            const refreshSuccess = await refreshToken()
            if (!refreshSuccess) {
              throw new Error("Token refresh failed")
            }
          }

          // Schedule token refresh 5 minutes before expiration
          const refreshTimeout = setTimeout(refreshToken, expiresIn - 300000)
          return () => clearTimeout(refreshTimeout)
        } catch (e) {
          console.error("Auth check failed:", e)
          localStorage.removeItem("hanythrift_token")
          localStorage.removeItem("hanythrift_refresh_token")
          localStorage.removeItem("hanythrift_user")
          setUser(null)
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('username', email)
      formData.append('password', password)

      const response = await fetch(`${api.getBaseUrl()}/token`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Login failed')
      }

      const data = await response.json()
      
      // Store tokens in localStorage
      localStorage.setItem("hanythrift_token", data.access_token)
      localStorage.setItem("hanythrift_refresh_token", data.refresh_token)
      
      // Set the token in the API client
      api.setToken(data.access_token)
      
      // Get user data from response
      const userData = {
        id: data.user_id,
        name: data.user_name,
        email: data.user_email,
        is_active: data.is_active,
        is_seller: data.is_seller
      }
      
      // Store user data in localStorage
      localStorage.setItem("hanythrift_user", JSON.stringify(userData))
      
      setUser(userData)
      return Promise.resolve()
    } catch (error) {
      console.error("Login error:", error)
      return Promise.reject(error)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    try {
      // First register the user
      await api.register(name, email, password)
      
      // Then attempt to login
      await login(email, password)
      
      return Promise.resolve()
    } catch (error: any) {
      console.error("Registration error:", error)
      setIsLoading(false)
      return Promise.reject(error.message || "Registration failed")
    }
  }

  const logout = () => {
    localStorage.removeItem("hanythrift_token")
    localStorage.removeItem("hanythrift_refresh_token")
    localStorage.removeItem("hanythrift_user")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
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

