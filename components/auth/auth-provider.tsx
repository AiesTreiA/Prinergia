"use client"

import React from "react"
import { isV0Environment } from "@/lib/auth-utils"

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // En v0, nunca usar SessionProvider
  if (isV0Environment()) {
    return <>{children}</>
  }

  // Solo en producción, cargar dinámicamente SessionProvider
  const SessionProviderWrapper = ({ children }: { children: React.ReactNode }) => {
    const [SessionProvider, setSessionProvider] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
      const loadSessionProvider = async () => {
        try {
          const { SessionProvider: NextAuthSessionProvider } = await import("next-auth/react")
          setSessionProvider(() => NextAuthSessionProvider)
        } catch (error) {
          console.error("Error loading SessionProvider:", error)
        } finally {
          setLoading(false)
        }
      }
      loadSessionProvider()
    }, [])

    if (loading) {
      return <>{children}</>
    }

    if (!SessionProvider) {
      return <>{children}</>
    }

    return <SessionProvider>{children}</SessionProvider>
  }

  return <SessionProviderWrapper>{children}</SessionProviderWrapper>
}
