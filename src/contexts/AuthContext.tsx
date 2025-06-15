'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { magic } from '@/lib/magic-client'
import { AuthUser } from '@/types'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const isLoggedIn = !!user

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
        
        // If we have Magic, also logout from Magic
        if (magic) {
          try {
            await magic.user.logout()
          } catch (magicError) {
            // Ignore Magic logout errors
          }
        }
      }
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string) => {
    if (!magic) {
      throw new Error('Magic not initialized')
    }

    try {
      setLoading(true)

      const didToken = await magic.auth.loginWithMagicLink({ 
        email,
        showUI: true
      })
      
      // Send token to our backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ didToken }),
      })
      
      if (!response.ok) {
        let errorData
        try {
          const responseText = await response.text()
          errorData = JSON.parse(responseText)
        } catch (parseError) {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
        }
        throw new Error(errorData.error || 'Login failed')
      }

      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)

      // Logout from Magic
      if (magic) {
        await magic.user.logout()
      }

      // Logout from our backend
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      setUser(null)
    } catch (error) {
      // Ignore logout errors
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    await checkAuthStatus()
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      refreshUser,
      isLoggedIn 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}